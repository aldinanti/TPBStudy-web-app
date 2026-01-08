import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
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
} from 'react-native';

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
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };
    startAnimation();
  }, []);

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

  return (
    // Background diubah ke warna Creamy sesuai website
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/images/background-light.png')} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="#608BC1" />

      {/* 1. RUNNING TEXT */}
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
            Platform pembelajaran interaktif untuk mata kuliah TPB ITB dengan simulasi dan eksperimen virtual. Didesign untuk membantu kamu memahami TPB!
          </Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statNum}>9</Text><Text style={styles.statLab}>MATA KULIAH</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>50+</Text><Text style={styles.statLab}>SIMULASI</Text></View>
            <View style={styles.statItem}><Text style={styles.statNum}>100%</Text><Text style={styles.statLab}>INTERAKTIF</Text></View>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/(tabs)/virtuallab')}>
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
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tickerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    width: width * 10, // Memastikan teks panjang tidak terpotong
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
    color: '#749bc3',
  },
  statLab: {
    fontSize: 10,
    color: '#749bc3',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#749bc3',
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
});