// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/auth/authContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Access login from Zustand store
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  // Login using Zustand
  const handleLoginWithZustand = async () => {
    try {
      setError('');
      await login()(email, password);
      console.log('Login successful (Zustand)');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <View>
      <TextInput
        className='text-white'
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        className='text-white'
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View>
        <Button title='Login (Zustand)' onPress={handleLoginWithZustand} />
      </View>

      {loading && <Text>Loading...</Text>}

      {isAuthenticated && <Text>Welcome {user?.name}</Text>}
    </View>
  );
}
