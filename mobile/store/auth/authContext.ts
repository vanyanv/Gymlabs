import React from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User, AuthState } from './types';
import tokenStorage from './tokenStorage';
import { QueryClient } from '@tanstack/react-query';

// Define API base URL - adjust this to your actual API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3009';

// Define a queryClient for direct usage within the store
const queryClient = new QueryClient();

// Custom secure storage implementation
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await tokenStorage.getToken();
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await tokenStorage.storeToken(value);
    } catch (e) {
      console.error('Error storing in secure storage:', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await tokenStorage.removeToken();
    } catch (e) {
      console.error('Error removing from secure storage:', e);
    }
  },
};

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isAuthenticated: false,

      bootstrap: async () => {
        try {
          const token = await tokenStorage.getToken();
          if (token) {
            // Manually fetch user data using JWT token
            // Note: You need to implement a /api/users/me endpoint in your backend
            const response = await fetch(`${API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const userData = await response.json();
              set({ user: userData, isAuthenticated: true });

              // Update the React Query cache with the user data
              queryClient.setQueryData(['user'], userData);
            } else {
              // Token invalid or expired
              await tokenStorage.removeToken();
            }
          }
        } catch (error) {
          // Token invalid or expired
          await tokenStorage.removeToken();
        } finally {
          set({ loading: false });
        }
      },

      login: () => async (email: string, password: string) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        await tokenStorage.storeToken(data.token);

        // Format the user data from backend response
        const user = {
          id: data.id,
          name: data.name,
          email: email, // Backend doesn't return email in response, so we use the one provided
        };

        // Update store
        set({ user, isAuthenticated: true });

        // Update React Query cache
        queryClient.setQueryData(['user'], user);

        return user;
      },

      signup: () => async (email: string, password: string, name: string) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Signup failed');
        }

        const data = await response.json();
        await tokenStorage.storeToken(data.token);

        // Format the user data from backend response
        const user = {
          id: data.id,
          name: data.name,
          email: email, // Backend doesn't return email in response, so we use the one provided
        };

        // Update store
        set({ user, isAuthenticated: true });

        // Update React Query cache
        queryClient.setQueryData(['user'], user);

        return user;
      },

      logout: async () => {
        // Clear token
        await tokenStorage.removeToken();

        // Update store
        set({ user: null, isAuthenticated: false });

        // Invalidate React Query cache
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.removeQueries({ queryKey: ['user'] });
      },

      // Update profile method (you'll need to implement this endpoint in your backend)
      updateProfile: () => async (profileData: Partial<User>) => {
        const token = await tokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();

        // Update store
        set({ user: updatedUser });

        // Update React Query cache
        queryClient.setQueryData(['user'], updatedUser);

        return updatedUser;
      },

      // Add a delete user method to match your backend functionality
      deleteAccount: async () => {
        const token = await tokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        const userId = get().user?.id;
        const response = await fetch(`${API_URL}/api/auth/${userId}`, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to delete account');
        }

        // Clear token and user data after successful deletion
        await tokenStorage.removeToken();
        set({ user: null, isAuthenticated: false });

        // Invalidate React Query cache
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.removeQueries({ queryKey: ['user'] });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user }), // Only persist the user
    }
  )
);

// Initialize auth state on app startup
export const initializeAuth = async (): Promise<void> => {
  const { bootstrap } = useAuthStore.getState();
  await bootstrap();
};

// Create a provider component to initialize auth
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  React.useEffect(() => {
    initializeAuth();
  }, []);

  return children;
};
