import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function ExampleArticle() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Contoh Artikel</ThemedText>
      <ThemedText>
        Ini adalah contoh artikel. Jika Anda punya konten artikel di website, kirim file atau URL
        agar saya salin isinya ke halaman ini.
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
