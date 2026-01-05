import Logo from '@/components/logo';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    ImageBackground,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';

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
  const { width } = Dimensions.get('window');
  const scrollXRef = useRef(new Animated.Value(width));
  const scrollX = scrollXRef.current;

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

  useEffect(() => {
    // keep secondsLeft synced when switching presets (but not when running)
    if (!isRunning) {
      setSecondsLeft(currentModeToSeconds());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, workMin, shortBreakMin, longBreakMin]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function currentModeToSeconds() {
    if (mode === 'work') return workMin * 60;
    if (mode === 'short') return shortBreakMin * 60;
    return longBreakMin * 60;
  }

  function tick() {
    setSecondsLeft((s) => {
      if (s <= 1) {
        // switch mode
        const next = mode === 'work' ? 'short' : 'work';
        const nextSeconds = next === 'work' ? workMin * 60 : shortBreakMin * 60;
        setMode(next);
        // vibrate briefly on mobile
        if (Platform.OS !== 'web') Vibration.vibrate(300);
        return nextSeconds;
      }
      return s - 1;
    });
  }

  function start() {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(tick, 1000);
  }

  function pause() {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background-light.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover', position: 'absolute', right: 0, width: width * 1.2, height: '100%' }}
      >
      <StatusBar barStyle="light-content" backgroundColor="#608BC1" />
      <View style={styles.tickerContainer}>
        <Animated.Text style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}>TPB Study! Fokus dan produktif dengan Pomodoro.</Animated.Text>
      </View>
      <View style={styles.navBar}>
        <View style={styles.logoWrapperCentered}>
          <Logo size={56} />
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Pomodoro</Text>
        <Text style={styles.subtitle}>Fokus 25 menit, istirahat 5 menit.</Text>
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.modeText}>{mode === 'work' ? 'Work' : mode === 'short' ? 'Short Break' : 'Long Break'}</Text>
        <Text style={styles.timeLarge}>{formatTime(secondsLeft)}</Text>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={isRunning ? pause : start}>
            <Text style={styles.controlBtnText}>{isRunning ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, styles.resetBtn]} onPress={reset}>
            <Text style={styles.controlBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.presetRow}>
        <TouchableOpacity
          style={[styles.presetBtn, mode === 'work' && styles.presetActive]}
          onPress={() => {
            setMode('work');
            if (!isRunning) setSecondsLeft(workMin * 60);
          }}
        >
          <Text style={styles.presetText}>Work ({workMin}m)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.presetBtn, mode === 'short' && styles.presetActive]}
          onPress={() => {
            setMode('short');
            if (!isRunning) setSecondsLeft(shortBreakMin * 60);
          }}
        >
          <Text style={styles.presetText}>Short ({shortBreakMin}m)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.presetBtn, mode === 'long' && styles.presetActive]}
          onPress={() => {
            setMode('long');
            if (!isRunning) setSecondsLeft(longBreakMin * 60);
          }}
        >
          <Text style={styles.presetText}>Long ({longBreakMin}m)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => {
            setWorkMin((v) => Math.max(1, v - 1));
          }}
        >
          <Text style={styles.smallBtnText}>- Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => {
            setWorkMin((v) => v + 1);
          }}
        >
          <Text style={styles.smallBtnText}>+ Work</Text>
        </TouchableOpacity>
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
  navBar: { height: 64, backgroundColor: '#608BC1', justifyContent: 'center' },
  logoWrapperCentered: { alignItems: 'center', justifyContent: 'center' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#4A628A' },
  subtitle: { color: '#7E99B0', marginTop: 6 },
  timerBox: { marginTop: 40, alignItems: 'center' },
  modeText: { color: '#7E99B0', marginBottom: 10, fontWeight: '700' },
  timeLarge: { fontSize: 72, fontWeight: '900', color: '#4A628A' },
  controlsRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  controlBtn: { backgroundColor: '#608BC1', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  resetBtn: { backgroundColor: '#94BCE0' },
  controlBtnText: { color: '#fff', fontWeight: '700' },
  presetRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 36, paddingHorizontal: 12 },
  presetBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#F3F6FB' },
  presetActive: { backgroundColor: '#608BC1' },
  presetText: { fontWeight: '700' },
  footer: { marginTop: 36, flexDirection: 'row', justifyContent: 'space-around' },
  smallBtn: { padding: 10, backgroundColor: '#EEE', borderRadius: 8 },
  smallBtnText: { color: '#333' },
});
