// src/services/auth/authService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tokenStorage from './tokenStorage';

// Define API base URL - replace with your actual API URL
const API_BASE_URL = 'https://your-api-url.com/api';

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

// Define API response types
interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Helper function to create headers with authentication token
 */
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await tokenStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API fetch with error handling
 */
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const authHeaders = await getAuthHeaders();

  // Create a new Headers object
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  // Add auth headers
  if ('Authorization' in authHeaders) {
    headers.append('Authorization', authHeaders.Authorization);
  }

  // Add any custom headers from options
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle 401 errors globally
  if (response.status === 401) {
    await tokenStorage.removeToken();
    // You could trigger a redirect to login here
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error: ${response.status}`;

    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Custom hook for login functionality
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const data = await fetchWithAuth('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        // Store the token
        await tokenStorage.storeToken(data.token);

        return data as AuthResponse;
      } catch (error) {
        console.error('Login error:', error);

        if (error instanceof Error) {
          if (error.message.includes('401')) {
            throw new Error('Invalid email or password');
          } else if (error.message.includes('429')) {
            throw new Error('Too many attempts. Please try again later');
          }
        }

        throw new Error('Network error. Please check your connection');
      }
    },
    onSuccess: (data) => {
      // Update user data in the cache
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

/**
 * Custom hook for signup functionality
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      try {
        const data = await fetchWithAuth('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(userData),
        });

        // Store the token
        await tokenStorage.storeToken(data.token);

        return data as AuthResponse;
      } catch (error) {
        console.error('Signup error:', error);

        if (error instanceof Error) {
          if (error.message.includes('409')) {
            throw new Error('Email already in use');
          }
        }

        throw new Error('Registration failed. Please try again.');
      }
    },
    onSuccess: (data) => {
      // Update user data in the cache
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

/**
 * Custom hook to get current user data
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return (await fetchWithAuth('/auth/me')) as User;
      } catch (error) {
        console.error('Get user data error:', error);
        throw new Error('Failed to fetch user data');
      }
    },
    // Only fetch if we have a token
    enabled: Boolean(tokenStorage.getToken()),
  });
};

/**
 * Custom hook for logout functionality
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // Some APIs require a logout request to invalidate the token on the server
        await fetchWithAuth('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout error:', error);
        // Still continue with logout even if API request fails
      } finally {
        await tokenStorage.removeToken();
      }
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Custom hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      try {
        return (await fetchWithAuth('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(userData),
        })) as User;
      } catch (error) {
        console.error('Update profile error:', error);
        throw new Error('Failed to update profile');
      }
    },
    onSuccess: (updatedUser) => {
      // Update user data in the cache
      queryClient.setQueryData(['user'], updatedUser);
    },
  });
};

/**
 * Custom hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      try {
        await fetchWithAuth('/auth/password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword, newPassword }),
        });
      } catch (error) {
        console.error('Change password error:', error);

        if (error instanceof Error) {
          if (error.message.includes('401')) {
            throw new Error('Current password is incorrect');
          }
        }

        throw new Error('Failed to change password');
      }
    },
  });
};

/**
 * Custom hook for requesting password reset
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        await fetchWithAuth('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        console.error('Request password reset error:', error);
        throw new Error('Failed to request password reset');
      }
    },
  });
};

/**
 * Helper to check if the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  return Boolean(await tokenStorage.getToken());
};
