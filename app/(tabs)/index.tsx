import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.navBar}>
        <Text style={styles.brandText}>TPB<Text style={{color: '#3B82F6'}}>Study</Text></Text>
        <View style={styles.navIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="search-outline" size={20} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconCircle, {marginLeft: 12}]}>
            <Ionicons name="notifications-outline" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. HERO SECTION (FOKUS TIPOGRAFI) */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>TAHAP PERSIAPAN BERSAMA</Text>
          <Text style={styles.heroTitle}>Kuasai Materi,{'\n'}Raih IPK Impian.</Text>
          <Text style={styles.heroSubtitle}>
            Platform belajar mandiri khusus mahasiswa TPB dengan kurikulum terbaru dan latihan soal intensif.
          </Text>
        </View>

        {/* 3. SEARCH BAR (MODERN FLAT) */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Cari rumus, materi, atau soal..." 
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* 4. MATA KULIAH GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mata Kuliah Utama</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <CourseCard icon="calculator" title="Kalkulus" count="24 Modul" color="#EFF6FF" iconColor="#3B82F6" />
          <CourseCard icon="flask" title="Kimia Dasar" count="18 Modul" color="#F0FDF4" iconColor="#10B981" />
          <CourseCard icon="speedometer" title="Fisika Dasar" count="21 Modul" color="#FFF7ED" iconColor="#F59E0B" />
          <CourseCard icon="code-slash" title="Komputasi" count="15 Modul" color="#F5F3FF" iconColor="#8B5CF6" />
        </View>

        {/* 5. CONTINUE LEARNING (DARK CARD) */}
        <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>Lanjutkan Belajar</Text>
        <TouchableOpacity style={styles.continueCard}>
          <View style={styles.continueInfo}>
            <Text style={styles.continueCategory}>SEDANG DIPELAJARI</Text>
            <Text style={styles.continueTitle}>Turunan Fungsi Transenden</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>Progres Belajar: 75%</Text>
          </View>
          <View style={styles.playButton}>
            <Ionicons name="play" size={20} color="white" />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-komponen untuk Mata Kuliah
function CourseCard({ icon, title, count, color, iconColor }: any) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardIconHeader}>
        <Ionicons name={icon} size={24} color={iconColor} />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 70,
  },
  navIcons: {
    flexDirection: 'row',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -1.2, 
    color: '#111827',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  // Typography Core
  heroSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 42,
    letterSpacing: -1.5, 
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 26,
    marginTop: 16,
    fontWeight: '400',
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 32,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  // Grid
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 24,
    alignItems: 'flex-start',
  },
  cardIconHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  cardCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#111827', 
    borderRadius: 28,
  },
  continueInfo: {
    flex: 1,
  },
  continueCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});