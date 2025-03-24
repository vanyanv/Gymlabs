import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const isWeb = typeof window !== 'undefined' && window.document;
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
      if (isWeb) {
        // Web fallback
        localStorage.setItem(TOKEN_KEY, token);
        return;
      }
      // Check for availability
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available on this device');
        return;
      }

      // Store the token
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);

      // Log error details but don't throw in production
      if (__DEV__) {
        console.error('Full error details:', error);
      }

      // Continue without throwing to prevent app crashes
      console.warn(
        'Authentication token storage failed, continuing without token'
      );
    }
  },

  /**
   * Retrieve authentication token from secure storage
   * @returns The stored token or null if not found
   */
  getToken: async (): Promise<string | null> => {
    try {
      if (isWeb) {
        // Web fallback
        return localStorage.getItem(TOKEN_KEY);
      }

      // Check for availability
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available on this device');
        return null;
      }

      // Get the token
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
      // Check for availability
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available on this device');
        return;
      }

      // Delete the token
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      // Don't throw to prevent app crashes
    }
  },
};

export default tokenStorage;
