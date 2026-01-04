import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Contact</ThemedText>
      <ThemedText>
        Hubungi kami di email: info@tpbstudy.example (placeholder). Jika Anda ingin formulir
        kontak, beritahu saya dan saya akan tambahkan form yang dapat mengirim pesan lewat API.
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
