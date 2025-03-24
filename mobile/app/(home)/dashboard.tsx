import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useAuthStore } from '@/store/auth/authContext';

export default function dashboard() {
  const user = useAuthStore((state) => state.user);
  console.log(user);
  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-4'>
        <View className='bg-white rounded-lg shadow-sm p-6 mb-4'>
          <Text className='text-2xl font-bold text-gray-800 mb-2'>
            Welcome, {user?.name || 'User'}!
          </Text>
          <Text className='text-gray-600'>
            This is your protected dashboard area.
          </Text>
        </View>

        {/* Example dashboard content */}
        <View className='bg-white rounded-lg shadow-sm p-6 mb-4'>
          <Text className='text-lg font-semibold text-gray-800 mb-3'>
            Account Overview
          </Text>
          <View className='border-t border-gray-200 pt-3'>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-gray-600'>Email</Text>
              <Text className='text-gray-800 font-medium'>
                {user?.email || 'Not available'}
              </Text>
            </View>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-gray-600'>Account ID</Text>
              <Text className='text-gray-800 font-medium'>
                {user?.id || 'Not available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Example recent activity section */}
        <View className='bg-white rounded-lg shadow-sm p-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-3'>
            Recent Activity
          </Text>
          <View className='border-t border-gray-200 pt-3'>
            <Text className='text-gray-600 italic'>
              No recent activity to display.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
