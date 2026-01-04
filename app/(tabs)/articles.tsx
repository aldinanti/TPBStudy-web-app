import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

export default function ArticlesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView>
        <ThemedText type="title">Articles</ThemedText>
        <ThemedText>
          Daftar artikel dan materi belajar akan muncul di sini. Untuk sekarang, ini contoh artikel.
        </ThemedText>
        <Link href="/articles/example-article">
          <Link.Trigger>
            <ThemedText type="link">Buka contoh artikel</ThemedText>
          </Link.Trigger>
        </Link>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});
