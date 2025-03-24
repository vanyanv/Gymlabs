// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthLayout() {
  // Redirect to dashboard if already logged in
  const { isSignedIn } = useAuth();

  //redirect to home page if the user is not signed in
  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }
  return <Stack />;
}
