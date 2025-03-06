import React from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User, AuthState } from './types';
import tokenStorage from './tokenStorage';
import * as authService from './authService'; // Import all exports from the new service
import { QueryClient } from '@tanstack/react-query';

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
            // Manually fetch user data
            const response = await fetch(
              'https://your-api-url.com/api/auth/me',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

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
        // Create a temporary mutation function similar to the one in authService
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(
          'https://your-api-url.com/api/auth/login',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        await tokenStorage.storeToken(data.token);

        // Update store
        set({ user: data.user, isAuthenticated: true });

        // Update React Query cache
        queryClient.setQueryData(['user'], data.user);

        return data.user;
      },

      signup: () => async (email: string, password, name?: string) => {
        // Create a temporary mutation function similar to the one in authService
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(
          'https://your-api-url.com/api/auth/signup',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Signup failed');
        }

        const data = await response.json();
        await tokenStorage.storeToken(data.token);

        // Update store
        set({ user: data.user, isAuthenticated: true });

        // Update React Query cache
        queryClient.setQueryData(['user'], data.user);

        return data.user;
      },

      logout: async () => {
        try {
          // Try to call the server to invalidate the token
          await fetch('https://your-api-url.com/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${await tokenStorage.getToken()}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // Continue with logout even if server call fails
          console.error('Logout server call failed:', error);
        }

        // Clear token
        await tokenStorage.removeToken();

        // Update store
        set({ user: null, isAuthenticated: false });

        // Invalidate React Query cache
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.removeQueries({ queryKey: ['user'] });
      },

      // Optional: Add methods to work with the useUpdateProfile hook
      updateProfile: () => async (profileData: Partial<User>) => {
        const token = await tokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        const response = await fetch(
          'https://your-api-url.com/api/auth/profile',
          {
            method: 'PUT',
            headers,
            body: JSON.stringify(profileData),
          }
        );

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

// Create a provider component to initialize auth and provide the QueryClient
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  React.useEffect(() => {
    initializeAuth();
  }, []);

  return children;
};
