import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CrimeAlertProvider } from '../src/context/CrimeAlertContext';
import { AuthProvider } from '../src/context/AuthContext';
import { registerBackgroundLocation } from '../src/services/backgroundLocationService';

export default function RootLayout() {
  useEffect(() => {
    registerBackgroundLocation();
  }, []);

  return (
    <AuthProvider>
      <CrimeAlertProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="register" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add-zone" options={{ presentation: 'modal' }} />
          <Stack.Screen name="report-crime" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </CrimeAlertProvider>
    </AuthProvider>
  );
}
