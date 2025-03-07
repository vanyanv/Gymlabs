import React from 'react';
import { Box } from '@/components/ui/box';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import LoginScreen from './screens/LoginScreen';

export default function Home() {
  return (
    <Box className='flex-1 bg-black min-h-screen'>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Center>
          {/* Logo/Branding */}
          <Box className='items-center mb-8'>
            {/* You can replace this with an actual Image component if you have a logo */}
            <Box className='w-24 h-24 rounded-full bg-zinc-800 items-center justify-center mb-4'>
              <Text className='text-white text-4xl font-bold'>💪</Text>
            </Box>
            <Text className='text-white text-4xl font-bold'>GymLabs</Text>
            <Text className='text-zinc-400 text-lg mt-2 text-center'>
              Your personal fitness journey starts here
            </Text>
          </Box>

          {/* Auth Buttons */}
          <VStack className='space-y-4 w-full mt-12'>
            <Button className='bg-white rounded-xl py-4'>
              <ButtonText className='text-black font-semibold text-lg'>
                Login
              </ButtonText>
            </Button>
            <Button className='bg-blue-600 rounded-xl py-4'>
              <ButtonText className='text-white font-semibold text-lg'>
                Sign Up
              </ButtonText>
            </Button>
          </VStack>

          {/* Optional: Terms text */}
          <Text className='text-zinc-500 text-xs text-center mt-8'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Center>
      </ScrollView>

      <Box>
        <LoginScreen />
      </Box>
    </Box>
  );
}
