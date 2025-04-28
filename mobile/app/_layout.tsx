import { SplashScreen, Stack, useSegments, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (segments[0] as string === 'index') {
          router.replace('/home');
        }
      } else {
        if (segments[0] !== 'login' && segments[0] !== 'register') {
          router.replace('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [segments]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="guestHome" />
        <Stack.Screen name="home" />
        <Stack.Screen name="searchPage" />
        <Stack.Screen name="booking" /> {/* lowercased */}
        <Stack.Screen name="userProfile" />
      </Stack>
    </>
  );
}
