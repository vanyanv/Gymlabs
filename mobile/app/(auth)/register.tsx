// app/(auth)/register.tsx
import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth/authContext';
import RegisterForm from '../components/RegisterForm';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setErrorMsg('');
      await signup()(email, password, name);
      // Navigation is handled automatically through the auth layout
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    }
  };

  return (
    <RegisterForm
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      errorMsg={errorMsg}
      loading={loading}
      onSubmit={handleRegister}
    />
  );
}
