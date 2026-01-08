import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, Easing, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function VirtualLabScreen() {
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah kamu yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  useEffect(() => {
    const startTicker = () => {
      scrollX.setValue(width);
      Animated.timing(scrollX, {
        toValue: -width * 5,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startTicker());
    };
    startTicker();
  }, [scrollX, width]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}
      >
      <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
      <LinearGradient
        colors={['#3b6db1', '#4a69e2', '#7b42f5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tickerContainer}
      >
        <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>
          TPB Study! Tempat kamu bisa belajar materi-materi TPB tanpa pusing! 📚 Gak paham materi TPB? Tenang! Ada TPB Study! ✏️ Kamu bisa belajar Kalkulus, Fisika, Kimia di TPB Study! 🧠 TPB Study! Tempat kamu bisa belajar materi-materi TPB terbaik! 🚀
        </Animated.Text>
      </LinearGradient>
      <View style={styles.navBar}>
        <View style={styles.logoWrapperCentered}>
          <Logo size={56} />
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Virtual Lab</Text>
        <Text style={styles.subtitle}>Pilih mata kuliah untuk mulai belajar!</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Matematika */}
        <View style={styles.labCard}>
          <View style={styles.labCardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="calculator" size={30} color="#608BC1" />
            </View>
            <View style={styles.labCardContent}>
              <Text style={styles.labCardTitle}>Matematika</Text>
              <Text style={styles.labCardDesc}>Grafik fungsi, kalkulus, dan geometri interaktif</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.labCardBtn}
            onPress={() => router.push('/(tabs)/lab-kalkulus')}>
            <Text style={styles.labCardBtnText}>Masuk Lab</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Kimia */}
        <View style={styles.labCard}>
          <View style={styles.labCardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="flask" size={30} color="#608BC1" />
            </View>
            <View style={styles.labCardContent}>
              <Text style={styles.labCardTitle}>Kimia</Text>
              <Text style={styles.labCardDesc}>Tabel periodik dan kalkulator keasaman (pH)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.labCardBtn}
            onPress={() => router.push('/(tabs)/lab-kimia')}>
            <Text style={styles.labCardBtnText}>Masuk Lab</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Fisika */}
        <View style={styles.labCard}>
          <View style={styles.labCardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="speedometer" size={30} color="#608BC1" />
            </View>
            <View style={styles.labCardContent}>
              <Text style={styles.labCardTitle}>Fisika</Text>
              <Text style={styles.labCardDesc}>Simulasi gerak parabola dan mekanika</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.labCardBtn}
            onPress={() => router.push('/(tabs)/lab-fisika')}>
            <Text style={styles.labCardBtnText}>Masuk Lab</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Mata Kuliah Lainnya */}
        <View style={styles.otherSubjects}>
          <Text style={styles.otherSubjectsTitle}>Mata Kuliah Lainnya</Text>
          <Text style={styles.otherSubjectsText}>Berpikir Komputasional</Text>
          <Text style={styles.otherSubjectsText}>Literasi Digital dan AI</Text>
          <Text style={styles.otherSubjectsText}>Olahraga</Text>
          <Text style={styles.otherSubjectsText}>Pancasila</Text>
          <Text style={styles.otherSubjectsText}>Bahasa Indonesia</Text>
          <Text style={styles.otherSubjectsText}>Bahasa Inggris</Text>
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  background: { flex: 1 },
  tickerContainer: { 
    height: 44, 
    justifyContent: 'center', 
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tickerText: { color: '#fff', paddingHorizontal: 12, fontWeight: 'bold', fontSize: 14, width: width * 10 },
  navBar: { 
    height: 64, 
    backgroundColor: '#608BC1', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoWrapperCentered: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  logoutButton: {
    padding: 8,
  },
  header: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#4A628A' },
  subtitle: { color: '#7E99B0', marginTop: 6 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  labCard: {
    backgroundColor: '#F5F6F7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  labCardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F4F8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labCardContent: {
    flex: 1,
  },
  labCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 5,
  },
  labCardDesc: {
    fontSize: 14,
    color: '#7E99B0',
    lineHeight: 20,
  },
  labCardBtn: {
    backgroundColor: '#608BC1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  labCardBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  otherSubjects: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F5F6F7',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  otherSubjectsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 12,
  },
  otherSubjectsText: {
    fontSize: 14,
    color: '#608BC1',
    paddingVertical: 6,
  },
});
