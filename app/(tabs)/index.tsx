import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return <ThemedView style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
