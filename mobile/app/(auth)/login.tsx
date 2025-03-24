// app/(auth)/login.tsx
import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth/authContext';
import LoginForm from '../components/LoginForm';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required');
      return;
    }

    try {
      setErrorMsg('');
      await login()(email, password);
      // Navigation is handled automatically through the auth layout
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    }
  };

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorMsg={errorMsg}
      loading={loading}
      onSubmit={handleLogin}
    />
  );
}
