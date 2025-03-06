import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

// Custom storage for Zustand that uses SecureStore
const useSecureStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export default useSecureStorage;
