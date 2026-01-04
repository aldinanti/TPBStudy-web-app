import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet } from 'react-native';

const WEBSITE_URL = 'https://tpbstudy.example';

export default function WebScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Website</ThemedText>
      <ThemedText>
        Untuk membuka versi website di peramban, tekan tautan berikut. Jika Anda ingin konten
        website dimuat di dalam aplikasi, saya bisa menambahkan WebView atau menyalin konten
        statis ke halaman ini.
      </ThemedText>
      <ExternalLink
        href={WEBSITE_URL}
        onPress={() => {
          WebBrowser.openBrowserAsync(WEBSITE_URL);
        }}>
        <ThemedText type="link">Buka versi website</ThemedText>
      </ExternalLink>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});
