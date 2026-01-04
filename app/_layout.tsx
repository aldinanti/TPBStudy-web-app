import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // in-app overlay splash for Expo Go/dev clients
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    let mounted = true;

    // hide native splash as soon as possible, then show our overlay for 2s
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch {}
      try {
        await SplashScreen.hideAsync();
      } catch {}

      setTimeout(() => {
        if (!mounted) return;
        setShowOverlay(false);
      }, 2000);
    }

    prepare();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Render only the overlay while showOverlay is true so app pages aren't visible */}
      {showOverlay ? (
        <>
          <View style={styles.overlay} pointerEvents="none">
            <Image
              source={
                colorScheme === 'dark'
                  ? require('../assets/images/splash-icon-dark.png')
                  : require('../assets/images/splash-icon-light.png')
              }
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <StatusBar style="auto" />
        </>
      ) : (
        <>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  image: {
    width: 240,
    height: 240,
  },
});
