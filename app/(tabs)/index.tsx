import Logo from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(width)).current;
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const startAnimation = () => {
      scrollX.setValue(width);
      Animated.timing(scrollX, {
        toValue: -width * 5, 
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };
    startAnimation();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
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

  return (
    // Background diubah ke warna Creamy sesuai website
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/images/background-light.png')} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="#608BC1" />

      {/* 1. RUNNING TEXT */}
      <View style={styles.tickerContainer}>
        <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>
          TPB Study! Tempat kamu bisa belajar materi-materi TPB tanpa pusing! 📚 Gak paham materi TPB? Tenang! Ada TPB Study! ✏️
        </Animated.Text>
      </View>
      
      {/* 2. NAV BAR */}
      <View style={styles.navBar}>
        <View style={styles.logoWrapperCentered}>
          <Logo size={56} />
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 3. HERO SECTION */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Selamat Datang di TPBStudy!</Text>
          <Text style={styles.heroSubtitle}>
            Platform pembelajaran interaktif untuk mata kuliah TPB ITB dengan simulasi dan eksperimen virtual.
          </Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statNum}>9</Text><Text style={styles.statLab}>MATA KULIAH</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>50+</Text><Text style={styles.statLab}>SIMULASI</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>100%</Text><Text style={styles.statLab}>INTERAKTIF</Text></View>
          </View>

          <TouchableOpacity style={styles.ctaButton}>
            <Ionicons name="play" size={18} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.ctaText}>Mulai Belajar</Text>
          </TouchableOpacity>
        </View>

        {/* 4. MATA KULIAH LIST */}
        <Text style={styles.sectionTitle}>Mata Kuliah TPB ITB</Text>
        
        <View style={styles.mataKuliahList}>
          <Text style={styles.mataKuliahItem}>Matematika</Text>
          <Text style={styles.mataKuliahItem}>Fisika</Text>
          <Text style={styles.mataKuliahItem}>Kimia</Text>
          <Text style={styles.mataKuliahItem}>Berpikir Komputasional</Text>
          <Text style={styles.mataKuliahItem}>Literasi Digital dan AI</Text>
          <Text style={styles.mataKuliahItem}>Olahraga</Text>
          <Text style={styles.mataKuliahItem}>Pancasila</Text>
          <Text style={styles.mataKuliahItem}>Bahasa Indonesia</Text>
          <Text style={styles.mataKuliahItem}>Bahasa Inggris</Text>
        </View>

        {/* 5. FOOTER - Navigasi & Kontak */}
        <View style={styles.footer}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Navigasi</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/virtuallab')}>
              <Text style={styles.footerLink}>Virtual Lab</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/pomodoro')}>
              <Text style={styles.footerLink}>Pomodoro</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Mata Kuliah</Text>
            <Text style={styles.footerText}>Matematika</Text>
            <Text style={styles.footerText}>Fisika</Text>
            <Text style={styles.footerText}>Kimia</Text>
            <Text style={styles.footerText}>Berpikir Komputasional</Text>
            <Text style={styles.footerText}>Literasi Digital dan AI</Text>
            <Text style={styles.footerText}>Olahraga</Text>
            <Text style={styles.footerText}>Pancasila</Text>
            <Text style={styles.footerText}>Bahasa Indonesia</Text>
            <Text style={styles.footerText}>Bahasa Inggris</Text>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Kontak</Text>
            <Text style={styles.footerText}>Jl. awikawokoawk, Bandung, Jakarta</Text>
            <Text style={styles.footerText}>08123456789</Text>
            <Text style={styles.footerText}>@instagram</Text>
          </View>
        </View>

      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBF7', 
  },
    background: { flex: 1 },
  tickerContainer: {
    backgroundColor: '#4A628A', 
    height: 30,
    justifyContent: 'center',
  },
  tickerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    width: width * 6,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#608BC1', 
    paddingHorizontal: 20,
    height: 70,
  },
  logoWrapperCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  logoLight: {
    fontWeight: '400',
    opacity: 0.9,
  },
  menuBtn: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F9FBF7',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4A628A',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#7E99B0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#608BC1',
  },
  statLab: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#7AB2D3',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  ctaText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4A628A',
    marginLeft: 25,
    marginTop: 12,
    marginBottom: 20,
  },
  mataKuliahList: {
    marginHorizontal: 25,
    marginBottom: 30,
    gap: 12,
  },
  mataKuliahItem: {
    fontSize: 16,
    color: '#608BC1',
    paddingVertical: 8,
  },
  footer: {
    backgroundColor: '#F5F6F7',
    paddingHorizontal: 25,
    paddingVertical: 30,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  footerColumn: {
    flex: 1,
    gap: 8,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#608BC1',
    textDecorationLine: 'underline',
    paddingVertical: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#608BC1',
    paddingVertical: 2,
  },
});