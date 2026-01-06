import Logo from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

// Data tabel periodik sederhana (beberapa elemen penting)
const PERIODIC_TABLE = [
  { symbol: 'H', name: 'Hidrogen', atomicNumber: 1, mass: 1.008 },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, mass: 4.003 },
  { symbol: 'Li', name: 'Litium', atomicNumber: 3, mass: 6.941 },
  { symbol: 'Be', name: 'Berilium', atomicNumber: 4, mass: 9.012 },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, mass: 10.81 },
  { symbol: 'C', name: 'Karbon', atomicNumber: 6, mass: 12.01 },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, mass: 14.01 },
  { symbol: 'O', name: 'Oksigen', atomicNumber: 8, mass: 16.00 },
  { symbol: 'F', name: 'Fluor', atomicNumber: 9, mass: 19.00 },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, mass: 20.18 },
  { symbol: 'Na', name: 'Natrium', atomicNumber: 11, mass: 22.99 },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, mass: 24.31 },
  { symbol: 'Al', name: 'Aluminium', atomicNumber: 13, mass: 26.98 },
  { symbol: 'Si', name: 'Silikon', atomicNumber: 14, mass: 28.09 },
  { symbol: 'P', name: 'Fosfor', atomicNumber: 15, mass: 30.97 },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, mass: 32.07 },
  { symbol: 'Cl', name: 'Klorin', atomicNumber: 17, mass: 35.45 },
  { symbol: 'K', name: 'Kalium', atomicNumber: 19, mass: 39.10 },
  { symbol: 'Ca', name: 'Kalsium', atomicNumber: 20, mass: 40.08 },
  { symbol: 'Fe', name: 'Besi', atomicNumber: 26, mass: 55.85 },
  { symbol: 'Cu', name: 'Tembaga', atomicNumber: 29, mass: 63.55 },
  { symbol: 'Zn', name: 'Seng', atomicNumber: 30, mass: 65.38 },
];

export default function LabKimiaScreen() {
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'periodik' | 'ph'>('periodik');
  const [selectedElement, setSelectedElement] = useState<any>(null);
  
  // pH Calculator state
  const [concentration, setConcentration] = useState('');
  const [phResult, setPhResult] = useState<number | null>(null);
  const [isAcid, setIsAcid] = useState(true); // true = asam, false = basa

  useEffect(() => {
    const startTicker = () => {
      scrollX.setValue(width);
      Animated.timing(scrollX, {
        toValue: -width * 5,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startTicker());
    };
    startTicker();
  }, [scrollX, width]);

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

  const calculatePH = () => {
    const conc = parseFloat(concentration);
    if (isNaN(conc) || conc <= 0) {
      Alert.alert('Error', 'Masukkan konsentrasi yang valid');
      return;
    }
    
    if (isAcid) {
      // Untuk asam kuat: pH = -log[H+]
      const ph = -Math.log10(conc);
      setPhResult(ph);
    } else {
      // Untuk basa kuat: pOH = -log[OH-], pH = 14 - pOH
      const poh = -Math.log10(conc);
      const ph = 14 - poh;
      setPhResult(ph);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}>
        <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
        <View style={styles.tickerContainer}>
          <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>
            TPB Study! Virtual Lab Kimia - Tabel Periodik & Kalkulator Keasaman
          </Animated.Text>
        </View>
        <View style={styles.navBar}>
          <View style={styles.logoWrapperCentered}>
            <Logo size={56} />
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Virtual Lab Kimia</Text>
          <Text style={styles.subtitle}>Tabel Periodik & Kalkulator Keasaman (pH)</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'periodik' && styles.tabActive]}
            onPress={() => setActiveTab('periodik')}>
            <Text style={[styles.tabText, activeTab === 'periodik' && styles.tabTextActive]}>
              Tabel Periodik
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ph' && styles.tabActive]}
            onPress={() => setActiveTab('ph')}>
            <Text style={[styles.tabText, activeTab === 'ph' && styles.tabTextActive]}>
              Kalkulator pH
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'periodik' ? (
            <View style={styles.periodicContainer}>
              <Text style={styles.sectionTitle}>Tabel Periodik</Text>
              <View style={styles.periodicGrid}>
                {PERIODIC_TABLE.map((element) => (
                  <TouchableOpacity
                    key={element.atomicNumber}
                    style={styles.elementCard}
                    onPress={() => setSelectedElement(element)}>
                    <Text style={styles.elementNumber}>{element.atomicNumber}</Text>
                    <Text style={styles.elementSymbol}>{element.symbol}</Text>
                    <Text style={styles.elementName} numberOfLines={1}>{element.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedElement && (
                <View style={styles.elementDetail}>
                  <Text style={styles.detailTitle}>Detail Elemen</Text>
                  <Text style={styles.detailText}>Nama: {selectedElement.name}</Text>
                  <Text style={styles.detailText}>Simbol: {selectedElement.symbol}</Text>
                  <Text style={styles.detailText}>Nomor Atom: {selectedElement.atomicNumber}</Text>
                  <Text style={styles.detailText}>Massa Atom: {selectedElement.mass} u</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedElement(null)}>
                    <Text style={styles.closeBtnText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.phContainer}>
              <Text style={styles.sectionTitle}>Kalkulator Keasaman (pH)</Text>
              <Text style={styles.phDescription}>
                Hitung pH larutan asam atau basa kuat berdasarkan konsentrasi
              </Text>

              <View style={styles.phTypeContainer}>
                <TouchableOpacity
                  style={[styles.phTypeBtn, isAcid && styles.phTypeActive]}
                  onPress={() => setIsAcid(true)}>
                  <Text style={[styles.phTypeText, isAcid && styles.phTypeTextActive]}>Asam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.phTypeBtn, !isAcid && styles.phTypeActive]}
                  onPress={() => setIsAcid(false)}>
                  <Text style={[styles.phTypeText, !isAcid && styles.phTypeTextActive]}>Basa</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Konsentrasi [{isAcid ? 'H+' : 'OH-'}] (M)
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan konsentrasi"
                  placeholderTextColor="#999"
                  value={concentration}
                  onChangeText={setConcentration}
                  keyboardType="decimal-pad"
                />
              </View>

              <TouchableOpacity style={styles.calculateBtn} onPress={calculatePH}>
                <Text style={styles.calculateBtnText}>Hitung pH</Text>
              </TouchableOpacity>

              {phResult !== null && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>pH =</Text>
                  <Text style={styles.resultValue}>{phResult.toFixed(2)}</Text>
                  <Text style={styles.resultDescription}>
                    {phResult < 7 ? 'Asam' : phResult > 7 ? 'Basa' : 'Netral'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  background: { flex: 1 },
  tickerContainer: { height: 28, backgroundColor: '#4A628A', justifyContent: 'center', overflow: 'hidden' },
  tickerText: { color: '#fff', paddingHorizontal: 12, fontWeight: '700' },
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
    justifyContent: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  header: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#4A628A' },
  subtitle: { color: '#7E99B0', marginTop: 6 },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F6FB',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#608BC1',
  },
  tabText: {
    fontWeight: '700',
    color: '#7E99B0',
  },
  tabTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  periodicContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 15,
  },
  periodicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  elementCard: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#F5F6F7',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  elementNumber: {
    fontSize: 8,
    color: '#7E99B0',
    fontWeight: '600',
  },
  elementSymbol: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4A628A',
    marginTop: 2,
  },
  elementName: {
    fontSize: 7,
    color: '#8E9AAF',
    marginTop: 2,
    textAlign: 'center',
  },
  elementDetail: {
    backgroundColor: '#F5F6F7',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#7E99B0',
    marginBottom: 5,
  },
  closeBtn: {
    backgroundColor: '#608BC1',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  phContainer: {
    paddingHorizontal: 20,
  },
  phDescription: {
    fontSize: 14,
    color: '#7E99B0',
    marginBottom: 20,
    lineHeight: 20,
  },
  phTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  phTypeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F6FB',
    alignItems: 'center',
  },
  phTypeActive: {
    backgroundColor: '#608BC1',
  },
  phTypeText: {
    fontWeight: '700',
    color: '#7E99B0',
  },
  phTypeTextActive: {
    color: '#FFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A628A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  calculateBtn: {
    backgroundColor: '#608BC1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#F5F6F7',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultLabel: {
    fontSize: 16,
    color: '#7E99B0',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#4A628A',
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 14,
    color: '#7E99B0',
    fontWeight: '600',
  },
});

