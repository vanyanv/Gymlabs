// components/auth/RegisterForm.tsx
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native';
import { Link } from 'expo-router';

interface RegisterFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  errorMsg: string;
  loading: boolean;
  onSubmit: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errorMsg,
  loading,
  onSubmit,
}) => {
  return (
    <View className='flex-1 justify-center items-center p-4'>
      <View className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <Text className='text-2xl font-bold text-center text-gray-800 mb-6'>
          Create an Account
        </Text>

        {errorMsg ? (
          <Text className='text-red-500 text-center mb-4'>{errorMsg}</Text>
        ) : null}

        <TextInput
          className='w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 mb-4'
          placeholder='Full Name'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
          autoComplete='name'
        />

        <TextInput
          className='w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 mb-4'
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
        />

        <TextInput
          className='w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 mb-4'
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete='new-password'
        />

        <TextInput
          className='w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-3 px-4 mb-6'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete='new-password'
        />

        <TouchableOpacity
          className={`w-full py-3 rounded-lg ${
            loading ? 'bg-blue-400' : 'bg-blue-500'
          } flex-row justify-center items-center`}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size='small' color='#ffffff' />
          ) : (
            <Text className='text-white font-semibold text-center'>
              Register
            </Text>
          )}
        </TouchableOpacity>

        <View className='flex-row justify-center items-center mt-6'>
          <Text className='text-gray-600'>Already have an account?</Text>
          <Link href='/login' asChild>
            <TouchableOpacity className='ml-1'>
              <Text className='text-blue-500 font-semibold'>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;
