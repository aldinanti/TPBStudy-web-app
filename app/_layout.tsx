import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
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
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // hide native splash as soon as possible, then show our overlay for 2s
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.log('SplashScreen.preventAutoHideAsync error:', e);
      }
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log('SplashScreen.hideAsync error:', e);
      }

      // Set timeout untuk hide overlay setelah 2 detik
      timeoutId = setTimeout(() => {
        if (mounted) {
          setShowOverlay(false);
        }
      }, 2000);
    }

    prepare();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
      {/* Render overlay on top if showOverlay is true */}
      {showOverlay && (
        <View
          style={[
            styles.overlay,
            colorScheme === 'dark' ? styles.darkBackground : styles.lightBackground,
          ]}
          pointerEvents="none"
        >
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
  darkBackground: {
    backgroundColor: '#000',
  },
  lightBackground: {
    backgroundColor: '#fff',
  },
});
