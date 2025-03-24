// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth/authContext';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Redirect href='/(home)/dashboard' />;
  }

  return <Stack />;
}
