import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  StatusBar,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // --- LOGIKA ANIMASI TEXT JALAN ---
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      scrollX.setValue(width); // Mulai dari sisi kanan layar
      Animated.timing(scrollX, {
        toValue: -width * 2.5, // Berjalan ke kiri sampai teks habis
        duration: 12000, // Kecepatan (makin besar makin lambat)
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation()); // Ulangi terus menerus
    };
    startAnimation();
  }, [scrollX]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar agar ikon jam/baterai berwarna hitam di background putih */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- 1. RUNNING TEXT BANNER --- */}
      <View style={styles.tickerContainer}>
        <Animated.Text 
          style={[
            styles.tickerText, 
            { transform: [{ translateX: scrollX }] }
          ]}
        >
          📢 INFO: Modul Kalkulus IA Semester 2 sudah rilis! • Tutorial Sebaya Fisika Dasar akan berlangsung besok jam 19.00 WIB 🚀
        </Animated.Text>
      </View>
      
      {/* --- 2. NAV BAR --- */}
      <View style={styles.navBar}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>TPB<Text style={styles.logoBlue}>Study</Text></Text>
        </View>
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- 3. HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>OFFICIAL LEARNING PLATFORM</Text>
          <Text style={styles.heroTitle}>Kuasai Materi,{'\n'}Raih IPK Impian.</Text>
          <Text style={styles.heroSubtitle}>
            Satu platform untuk semua materi TPB. Belajar lebih cerdas, bukan lebih keras.
          </Text>
        </View>

        {/* --- 4. SEARCH BAR --- */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#A0A0A0" />
          <TextInput 
            placeholder="Cari materi, rumus, atau soal..." 
            placeholderTextColor="#A0A0A0"
            style={styles.searchField}
          />
        </View>

        {/* --- 5. GRID MATA KULIAH --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mata Kuliah Utama</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <CourseCard icon="calculator" title="Kalkulus" count="24 Modul" bg="#F0F7FF" tint="#007AFF" />
          <CourseCard icon="flask" title="Kimia Dasar" count="18 Modul" bg="#F2FBF6" tint="#34C759" />
          <CourseCard icon="speedometer" title="Fisika Dasar" count="21 Modul" bg="#FFF9F2" tint="#FF9500" />
          <CourseCard icon="code-slash" title="Komputasi" count="15 Modul" bg="#F6F5FF" tint="#5856D6" />
        </View>

        {/* --- 6. CONTINUE LEARNING (DARK MODE CARD) --- */}
        <Text style={[styles.sectionTitle, { marginTop: 35, marginBottom: 15 }]}>Lanjutkan Belajar</Text>
        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTag}>SEDANG DIPELAJARI</Text>
            <Text style={styles.featuredTitle}>Turunan Fungsi Transenden</Text>
            <View style={styles.progressRow}>
              <View style={styles.barEmpty}>
                <View style={[styles.barFull, { width: '75%' }]} />
              </View>
              <Text style={styles.percentText}>75%</Text>
            </View>
          </View>
          <View style={styles.playBtn}>
            <Ionicons name="play" size={22} color="#FFF" />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- SUB-KOMPONEN UNTUK KARTU GRID ---
function CourseCard({ icon, title, count, bg, tint }: any) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={26} color={tint} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{count}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Running Text
  tickerContainer: {
    backgroundColor: '#007AFF', 
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tickerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    width: width * 4, 
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  // Logo & Nav
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    height: 70,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1.5,
  },
  logoBlue: {
    color: '#007AFF',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  // Hero Section
  heroSection: {
    marginTop: 15,
    marginBottom: 30,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#007AFF',
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000',
    lineHeight: 44,
    letterSpacing: -2,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 25,
    marginTop: 15,
  },
  // Search Bar
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 60,
    marginBottom: 35,
  },
  searchField: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  // Grid
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.8,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    width: '47.8%',
    padding: 22,
    borderRadius: 28,
  },
  iconBox: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  cardCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginTop: 4,
  },
  // Featured Card (Lanjutkan Belajar)
  featuredCard: {
    backgroundColor: '#000',
    padding: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barEmpty: {
    flex: 1,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFull: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  percentText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  playBtn: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});