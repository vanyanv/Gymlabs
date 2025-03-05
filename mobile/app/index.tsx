import React from 'react';

import { Box } from '@/components/ui/box';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { View } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import useCounterStore from '@/store/counterStore';

export default function Home() {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <Box className='flex-1 bg-black h-[100vh]'>
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Box className='bg-background-template py-2 px-6 rounded-full items-center flex-column md:flex-row md:self-start'>
          <Text className='text-typography-white font-normal'>GymLabs</Text>
        </Box>

        <View>
          <Text>{count}</Text>
        </View>

        <Button onPress={increment}>Increment</Button>
        <View />
        <Button onPress={decrement}>Decrement</Button>
        <View />
        <Button onPress={reset}>Reset</Button>
      </ScrollView>
    </Box>
  );
}
