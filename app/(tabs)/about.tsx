import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">About TPB Study</ThemedText>
      <ThemedText>
        TPB Study adalah aplikasi pembelajaran yang menyediakan konten dan materi untuk membantu
        siswa memahami topik-topik penting. Halaman ini placeholder; beri saya konten website
        atau URL, maka saya akan mengisi seluruh isi sesuai website.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});
