import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PomodoroScreen() {
  const WORK_DEFAULT = 25; // minutes
  const SHORT_BREAK_DEFAULT = 5;
  const LONG_BREAK_DEFAULT = 15;

  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [workMin, setWorkMin] = useState<number>(WORK_DEFAULT);
  const [shortBreakMin, setShortBreakMin] = useState<number>(SHORT_BREAK_DEFAULT);
  const [longBreakMin, setLongBreakMin] = useState<number>(LONG_BREAK_DEFAULT);
  const [secondsLeft, setSecondsLeft] = useState<number>(WORK_DEFAULT * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
  }, [scrollX]);

  useEffect(() => {
    // keep secondsLeft synced when switching presets (but not when running)
    if (!isRunning) {
      setSecondsLeft(currentModeToSeconds());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, workMin, shortBreakMin, longBreakMin]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Handle timer when isRunning changes
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            // switch mode
            const next = mode === 'work' ? 'short' : mode === 'short' ? 'long' : 'work';
            const nextSeconds = next === 'work' ? workMin * 60 : next === 'short' ? shortBreakMin * 60 : longBreakMin * 60;
            setMode(next);
            // vibrate briefly on mobile
            if (Platform.OS !== 'web') Vibration.vibrate(300);
            return nextSeconds;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, mode, workMin, shortBreakMin, longBreakMin]);

  function currentModeToSeconds() {
    if (mode === 'work') return workMin * 60;
    if (mode === 'short') return shortBreakMin * 60;
    return longBreakMin * 60;
  }

  function start() {
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    pause();
    setSecondsLeft(currentModeToSeconds());
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }

  const getSessionColor = () => {
    if (mode === 'short') return '#4caf50'; // Hijau
    if (mode === 'long') return '#2196f3'; // Biru
    return '#e65a4c'; // Merah (Default)
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
        
        {/* Moving Banner / Ticker */}
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Judul & Deskripsi */}
          <View style={styles.headerSection}>
            <View style={styles.headerTitleRow}>
              <View style={styles.clockIconContainer}>
                <MaterialCommunityIcons name="clock-outline" size={32} color="white" />
              </View>
              <Text style={styles.headerTitle}>Pomodoro Timer</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Tingkatkan fokus dan produktivitas belajar dengan teknik Pomodoro.
            </Text>
          </View>

          {/* Container Utama (Card) */}
          <View style={styles.card}>
            
            {/* Label Sesi */}
            <View style={[styles.sessionLabel, { backgroundColor: getSessionColor() }]}>
              <Text style={styles.sessionLabelText}>
                {mode === 'work' ? 'SESI FOKUS' : mode === 'short' ? 'BREAK PENDEK' : 'BREAK PANJANG'}
              </Text>
            </View>
            
            <Text style={styles.pomodoroTitle}>Pomodoro #1</Text>

            {/* Timer Lingkaran */}
            <View style={styles.timerContainer}>
              <View style={styles.timerCircle}>
                {/* Indikator Titik Merah */}
                <View style={styles.redDot} />
                {/* Angka Waktu */}
                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
              </View>
            </View>

            {/* Baris Tombol Kontrol Atas */}
            <View style={styles.controlsGrid}>
              <TouchableOpacity 
                style={[styles.controlBtn, styles.btnCream, isRunning && styles.btnDisabled]} 
                onPress={start}
                disabled={isRunning}
              >
                <Ionicons name="play" size={20} color="#82a3c5" />
                <Text style={styles.btnTextCream}>MULAI</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlBtn, styles.btnBlue]} 
                onPress={pause}
                disabled={!isRunning}
              >
                <Ionicons name="pause" size={20} color={isRunning ? "#FFF" : "#82a3c5"} />
                <Text style={[styles.btnTextBlue, !isRunning && { color: '#82a3c5' }]}>JEDA</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.controlBtn, styles.btnCream]} onPress={reset}>
                <Ionicons name="refresh" size={20} color="#82a3c5" />
                <Text style={styles.btnTextCream}>RESET</Text>
              </TouchableOpacity>
            </View>

            {/* Baris Tombol Mode Bawah */}
            <View style={styles.modesGrid}>
              <TouchableOpacity 
                style={[styles.modeBtn, mode === 'work' && styles.modeBtnActive]}
                onPress={() => { setMode('work'); setIsRunning(false); setSecondsLeft(workMin * 60); }}
              >
                <MaterialCommunityIcons name="brain" size={18} color="black" />
                <Text style={styles.modeBtnText}>FOCUS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeBtn, mode === 'short' && styles.modeBtnActive]}
                onPress={() => { setMode('short'); setIsRunning(false); setSecondsLeft(shortBreakMin * 60); }}
              >
                <Ionicons name="cafe-outline" size={18} color="black" />
                <Text style={styles.modeBtnTextSmall}>SHORT BREAK</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeBtn, mode === 'long' && styles.modeBtnActive]}
                onPress={() => { setMode('long'); setIsRunning(false); setSecondsLeft(longBreakMin * 60); }}
              >
                <MaterialCommunityIcons name="sofa" size={18} color="black" />
                <Text style={styles.modeBtnTextSmall}>LONG BREAK</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  navBar: { height: 64, backgroundColor: '#608BC1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  logoWrapperCentered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoutButton: { padding: 8 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  // Header Section
  headerSection: { alignItems: 'center', marginBottom: 30 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  clockIconContainer: { backgroundColor: '#e65a4c', padding: 8, borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  headerTitle: { color: '#5182a4', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { color: '#7fa3c1', fontSize: 16, fontWeight: '500', textAlign: 'center', maxWidth: 300, lineHeight: 22 },
  
  // Card Styles
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#82a3c5',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sessionLabel: {
    backgroundColor: '#e65a4c',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sessionLabelText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, letterSpacing: 1.5 },
  pomodoroTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600', marginBottom: 48 },
  
  // Timer Circle
  timerContainer: { marginBottom: 64, alignItems: 'center', justifyContent: 'center' },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#e65a4c',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#82a3c5',
  },
  timerText: { fontSize: 80, fontWeight: '900', color: '#FFF' },

  // Controls
  controlsGrid: { flexDirection: 'row', gap: 16, width: '100%', marginBottom: 24 },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  btnCream: { backgroundColor: '#fcf9ee' },
  btnBlue: { backgroundColor: '#b2c3d4' },
  btnDisabled: { opacity: 0.7 },
  btnTextCream: { color: '#82a3c5', fontWeight: '900', fontSize: 14 },
  btnTextBlue: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  // Modes
  modesGrid: { flexDirection: 'row', gap: 12, width: '100%' },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#fcf9ee',
    gap: 6,
    opacity: 0.9,
  },
  modeBtnActive: { opacity: 1, backgroundColor: '#FFF' },
  modeBtnText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
  modeBtnTextSmall: { color: '#000', fontWeight: 'bold', fontSize: 9 },
});
