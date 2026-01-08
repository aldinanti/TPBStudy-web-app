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

const { width, height } = Dimensions.get('window');
const GRAVITY = 9.8; // m/s²

export default function LabFisikaScreen() {
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;
  const { logout } = useAuth();
  const router = useRouter();
  
  // State untuk simulasi
  const [isRunning, setIsRunning] = useState(false);
  const [initialVelocity, setInitialVelocity] = useState('10'); // m/s
  const [angle, setAngle] = useState('45'); // derajat
  const [time, setTime] = useState(0);
  
  // Animated values untuk posisi bola
  const posX = useRef(new Animated.Value(20)).current;
  const posY = useRef(new Animated.Value(280)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<any>(null);

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

  const startSimulation = () => {
    const v0 = parseFloat(initialVelocity);
    const thetaDeg = parseFloat(angle);
    
    if (isNaN(v0) || v0 <= 0 || isNaN(thetaDeg) || thetaDeg <= 0 || thetaDeg >= 90) {
      Alert.alert('Error', 'Masukkan nilai yang valid (kecepatan > 0, sudut 0-90°)');
      return;
    }

    // Stop any existing simulation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsRunning(true);
    setTime(0);
    
    // Reset posisi
    posX.setValue(20);
    posY.setValue(280);

    const theta = thetaDeg * (Math.PI / 180); // Convert to radians

    // Komponen kecepatan awal
    const v0x = v0 * Math.cos(theta);
    const v0y = v0 * Math.sin(theta);

    // Waktu maksimum (ketika bola kembali ke tanah)
    const tMax = (2 * v0y) / GRAVITY;
    
    // Jarak maksimum
    const xMax = v0x * tMax;
    
    // Tinggi maksimum
    const yMax = (v0y * v0y) / (2 * GRAVITY);

    let currentTime = 0;
    const timeStep = 0.05; // 50ms per frame
    const simWidth = width - 60; // Width untuk simulasi
    const simHeight = 280; // Height untuk simulasi

    const animate = () => {
      if (currentTime >= tMax) {
        setIsRunning(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return;
      }

      // Hitung posisi berdasarkan waktu
      const x = v0x * currentTime;
      const y = v0y * currentTime - 0.5 * GRAVITY * currentTime * currentTime;

      // Normalisasi ke skala layar
      const normalizedX = 20 + (x / xMax) * simWidth;
      const normalizedY = 280 - (y / yMax) * simHeight;

      posX.setValue(Math.max(20, Math.min(normalizedX, width - 40)));
      posY.setValue(Math.max(20, Math.min(normalizedY, 280)));

      currentTime += timeStep;
      setTime(currentTime);

      if (currentTime < tMax) {
        timeoutRef.current = setTimeout(animate, 50);
      } else {
        setIsRunning(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    animate();
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      animationRef.current.stop();
    }
    posX.setValue(20);
    posY.setValue(280);
    setTime(0);
  };

  const resetSimulation = () => {
    stopSimulation();
    setInitialVelocity('10');
    setAngle('45');
  };

  // Hitung hasil teoritis
  const calculateResults = () => {
    const v0 = parseFloat(initialVelocity);
    const theta = parseFloat(angle) * (Math.PI / 180);
    
    if (isNaN(v0) || isNaN(theta)) return null;

    const v0x = v0 * Math.cos(theta);
    const v0y = v0 * Math.sin(theta);
    const tMax = (2 * v0y) / GRAVITY;
    const xMax = v0x * tMax;
    const yMax = (v0y * v0y) / (2 * GRAVITY);

    return { tMax, xMax, yMax };
  };

  const results = calculateResults();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}>
        <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
        <View style={styles.tickerContainer}>
          <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>
            TPB Study! Virtual Lab Fisika - Simulasi Gerak Parabola
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
          <Text style={styles.title}>Virtual Lab Fisika</Text>
          <Text style={styles.subtitle}>Simulasi Gerak Parabola</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Input Parameters */}
          <View style={styles.inputSection}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kecepatan Awal (m/s)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor="#999"
                  value={initialVelocity}
                  onChangeText={setInitialVelocity}
                  keyboardType="decimal-pad"
                  editable={!isRunning}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sudut (°)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45"
                  placeholderTextColor="#999"
                  value={angle}
                  onChangeText={setAngle}
                  keyboardType="decimal-pad"
                  editable={!isRunning}
                />
              </View>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={[styles.controlBtn, styles.startBtn]}
                onPress={isRunning ? stopSimulation : startSimulation}
                disabled={isRunning && false}>
                <Ionicons name={isRunning ? 'pause' : 'play'} size={20} color="#FFF" />
                <Text style={styles.controlBtnText}>{isRunning ? 'Pause' : 'Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, styles.resetBtn]}
                onPress={resetSimulation}
                disabled={isRunning}>
                <Text style={styles.controlBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Simulation Area */}
          <View style={styles.simArea}>
            <View style={styles.groundLine} />
            <Animated.View
              style={[
                styles.ball,
                {
                  transform: [
                    { translateX: posX },
                    { translateY: posY },
                  ],
                },
              ]}
            />
            {isRunning && (
              <View style={styles.trajectory}>
                <Text style={styles.trajectoryText}>Waktu: {time.toFixed(2)}s</Text>
              </View>
            )}
          </View>

          {/* Results */}
          {results && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Hasil Teoritis</Text>
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Jarak Maksimum</Text>
                  <Text style={styles.resultValue}>{results.xMax.toFixed(2)} m</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Tinggi Maksimum</Text>
                  <Text style={styles.resultValue}>{results.yMax.toFixed(2)} m</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Waktu Tempuh</Text>
                  <Text style={styles.resultValue}>{results.tMax.toFixed(2)} s</Text>
                </View>
              </View>
            </View>
          )}

          {/* Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Rumus Gerak Parabola</Text>
            <Text style={styles.infoText}>x(t) = v₀·cos(θ)·t</Text>
            <Text style={styles.infoText}>y(t) = v₀·sin(θ)·t - ½·g·t²</Text>
            <Text style={styles.infoText}>g = 9.8 m/s²</Text>
          </View>
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
  scrollContent: {
    paddingBottom: 40,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  inputContainer: {
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
  controlRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  startBtn: {
    backgroundColor: '#608BC1',
  },
  resetBtn: {
    backgroundColor: '#94BCE0',
  },
  controlBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  simArea: {
    height: 320,
    backgroundColor: '#F5F6F7',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  groundLine: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4A628A',
  },
  ball: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#608BC1',
    position: 'absolute',
  },
  trajectory: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(74, 98, 138, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  trajectoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resultsSection: {
    backgroundColor: '#F5F6F7',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 15,
  },
  resultItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  resultLabel: {
    fontSize: 12,
    color: '#7E99B0',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4A628A',
  },
  infoSection: {
    backgroundColor: '#F5F6F7',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A628A',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7E99B0',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
