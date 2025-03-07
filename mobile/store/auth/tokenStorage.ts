import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

/**
 * Service to handle token storage operations using Expo's SecureStore
 */
const tokenStorage = {
  /**
   * Store authentication token securely
   * @param token The JWT or auth token to store
   */
  storeToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  },

  /**
   * Retrieve authentication token from secure storage
   * @returns The stored token or null if not found
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token from secure storage
   */
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove authentication token');
    }
  },
};

export default tokenStorage;
