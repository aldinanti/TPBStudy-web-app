import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LabKalkulusScreen() {
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'linear' | 'derivative'>('linear');

  // State untuk Grafik Linear (y = mx + c)
  const [gradient, setGradient] = useState('1'); // m
  const [intercept, setIntercept] = useState('0'); // c

  // State untuk Kalkulator Turunan (f(x) = ax^n)
  const [coeff, setCoeff] = useState('1'); // a
  const [power, setPower] = useState('2'); // n
  const [derivativeResult, setDerivativeResult] = useState<string | null>(null);

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

  // Logic Grafik Linear
  const GRAPH_HEIGHT = 300;
  const GRAPH_WIDTH = width - 40; // padding 20 kiri kanan
  const CENTER_X = GRAPH_WIDTH / 2;
  const CENTER_Y = GRAPH_HEIGHT / 2;
  const SCALE = 20; // 1 unit = 20 pixels

  const generatePoints = () => {
    const m = parseFloat(gradient);
    const c = parseFloat(intercept);
    
    if (isNaN(m) || isNaN(c)) return [];

    const points = [];
    // Generate x dari -10 sampai 10
    for (let x = -10; x <= 10; x += 0.5) {
      const y = m * x + c;
      points.push({ x, y });
    }
    return points;
  };

  const points = generatePoints();

  // Logic Turunan
  const calculateDerivative = () => {
    const a = parseFloat(coeff);
    const n = parseFloat(power);

    if (isNaN(a) || isNaN(n)) {
      Alert.alert('Error', 'Masukkan angka yang valid');
      return;
    }

    // Aturan pangkat: d/dx (ax^n) = a*n*x^(n-1)
    const newCoeff = a * n;
    const newPower = n - 1;

    let resultStr = '';
    if (newPower === 0) {
      resultStr = `${newCoeff}`;
    } else if (newPower === 1) {
      resultStr = `x`;
    } else {
      resultStr = `x^`;
    }
    
    setDerivativeResult(`f'(x) = `);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}>
        <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
        
        {/* Ticker */}
        <View style={styles.tickerContainer}>
          <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>
            TPB Study! Virtual Lab Matematika - Grafik Linear & Kalkulus Dasar
          </Animated.Text>
        </View>

        {/* Navbar */}
        <View style={styles.navBar}>
          <View style={styles.logoWrapperCentered}>
            <Logo size={56} />
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Virtual Lab Matematika</Text>
          <Text style={styles.subtitle}>Eksplorasi Fungsi & Kalkulus</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'linear' && styles.tabActive]}
            onPress={() => setActiveTab('linear')}>
            <Text style={[styles.tabText, activeTab === 'linear' && styles.tabTextActive]}>
              Grafik Linear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'derivative' && styles.tabActive]}
            onPress={() => setActiveTab('derivative')}>
            <Text style={[styles.tabText, activeTab === 'derivative' && styles.tabTextActive]}>
              Turunan
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'linear' ? (
            <View style={styles.contentContainer}>
              <Text style={styles.sectionTitle}>Visualisasi Fungsi Linear</Text>
              <Text style={styles.formulaText}>y = mx + c</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Gradien (m)</Text>
                  <TextInput
                    style={styles.input}
                    value={gradient}
                    onChangeText={setGradient}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Konstanta (c)</Text>
                  <TextInput
                    style={styles.input}
                    value={intercept}
                    onChangeText={setIntercept}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              {/* Graph Area */}
              <View style={[styles.graphArea, { height: GRAPH_HEIGHT, width: GRAPH_WIDTH }]}>
                {/* Axes */}
                <View style={[styles.axis, { width: '100%', height: 1, top: CENTER_Y }]} />
                <View style={[styles.axis, { width: 1, height: '100%', left: CENTER_X }]} />
                
                {/* Points */}
                {points.map((p, i) => {
                  // Transform coordinates to view
                  const viewX = CENTER_X + (p.x * SCALE);
                  const viewY = CENTER_Y - (p.y * SCALE);
                  
                  // Only render if within bounds
                  if (viewX < 0 || viewX > GRAPH_WIDTH || viewY < 0 || viewY > GRAPH_HEIGHT) return null;

                  return (
                    <View
                      key={i}
                      style={[
                        styles.point,
                        { left: viewX - 3, top: viewY - 3 } // -3 to center the 6px dot
                      ]}
                    />
                  );
                })}
              </View>
              
              <View style={styles.legendContainer}>
                <Text style={styles.legendText}>Sumbu X: Horizontal</Text>
                <Text style={styles.legendText}>Sumbu Y: Vertikal</Text>
                <Text style={styles.legendText}>Skala: 1 unit = 20px</Text>
              </View>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.sectionTitle}>Kalkulator Turunan Dasar</Text>
              <Text style={styles.descriptionText}>
                Hitung turunan pertama dari fungsi pangkat sederhana.
              </Text>
              <Text style={styles.formulaText}>f(x) = axⁿ</Text>

              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Koefisien (a)</Text>
                  <TextInput
                    style={styles.input}
                    value={coeff}
                    onChangeText={setCoeff}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Pangkat (n)</Text>
                  <TextInput
                    style={styles.input}
                    value={power}
                    onChangeText={setPower}
                    keyboardType="numeric"
                    placeholder="2"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.calculateBtn} onPress={calculateDerivative}>
                <Text style={styles.calculateBtnText}>Hitung Turunan</Text>
              </TouchableOpacity>

              {derivativeResult && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>Hasil:</Text>
                  <Text style={styles.resultValue}>{derivativeResult}</Text>
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 10,
  },
  formulaText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#608BC1',
    textAlign: 'center',
    marginVertical: 15,
    fontStyle: 'italic',
  },
  descriptionText: {
    color: '#7E99B0',
    marginBottom: 10,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
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
  graphArea: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 15,
  },
  axis: {
    position: 'absolute',
    backgroundColor: '#CCC',
  },
  point: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#608BC1',
  },
  legendContainer: {
    backgroundColor: '#F5F6F7',
    padding: 15,
    borderRadius: 10,
  },
  legendText: {
    fontSize: 12,
    color: '#7E99B0',
    marginBottom: 2,
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
  resultBox: {
    backgroundColor: '#F5F6F7',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#7E99B0',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4A628A',
  },
});
