import Logo from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function VirtualLabScreen() {
  const fall = useRef(new Animated.Value(0)).current;
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1); // multiplier: higher => faster
  const { width } = Dimensions.get('window');
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;
  const { logout } = useAuth();
  const router = useRouter();

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

    let anim: Animated.CompositeAnimation | null = null;
    if (running) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(fall, {
            toValue: 1,
            duration: Math.max(300, 2000 / speed),
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(fall, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [running, speed, fall, scrollX, width]);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [0, 300] });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}
      >
      <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
      <View style={styles.tickerContainer}>
        <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>TPB Study! Tempat kamu bisa belajar materi-materi TPB tanpa pusing!</Animated.Text>
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
        <Text style={styles.title}>Virtual Lab — Drop Simulation</Text>
        <Text style={styles.subtitle}>Atur kecepatan lalu tekan Start untuk melihat bola jatuh.</Text>
      </View>

      <View style={styles.simArea}>
        <Animated.View style={[styles.ball, { transform: [{ translateY }] }]} />
      </View>

      <View style={styles.controls}>
        <View style={styles.speedRow}>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setSpeed((s) => Math.max(0.2, +(s - 0.2).toFixed(1)))}>
            <Text style={styles.smallBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.speedText}>Speed: x{speed.toFixed(1)}</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setSpeed((s) => +(s + 0.2).toFixed(1))}>
            <Text style={styles.smallBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playRow}>
          <TouchableOpacity style={styles.playBtn} onPress={() => setRunning((r) => !r)}>
            <Ionicons name={running ? 'pause' : 'play'} size={20} color="#fff" />
            <Text style={styles.playText}>{running ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center' 
  },
  logoutButton: {
    padding: 8,
  },
  header: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#4A628A' },
  subtitle: { color: '#7E99B0', marginTop: 6 },
  simArea: { height: 360, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 },
  ball: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#608BC1' },
  controls: { padding: 20 },
  speedRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  smallBtn: { backgroundColor: '#EEE', padding: 10, borderRadius: 8 },
  smallBtnText: { fontWeight: '700' },
  speedText: { marginHorizontal: 12, fontWeight: '700' },
  playRow: { marginTop: 20, alignItems: 'center' },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#608BC1', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  playText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});
