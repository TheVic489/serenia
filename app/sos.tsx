import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Heart, ChevronRight, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import Colors from '@/constants/colors';
import { sosExercise } from '@/mocks/exercises';

export default function SOSScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const breathAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(1)).current;
  const audioRef = useRef<Audio.Sound | null>(null);

  const stopAndUnloadAudio = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      await audioRef.current.stopAsync();
      await audioRef.current.unloadAsync();
    } catch {
      // Ignore audio cleanup errors to keep SOS flow stable.
    } finally {
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0.6,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, [breathAnim]);

  useEffect(() => {
    let mounted = true;

    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DUCK_OTHERS,
          interruptionModeIOS: InterruptionModeIOS.DUCK_OTHERS,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/relaxing-piano.mp3'),
          {
            shouldPlay: true,
            isLooping: true,
            isMuted,
            volume: 0.25,
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        audioRef.current = sound;
      } catch {
        audioRef.current = null;
      }
    };

    setupAudio();

    return () => {
      mounted = false;
      stopAndUnloadAudio();
    };
  }, [stopAndUnloadAudio]);

  const handleClose = useCallback(async () => {
    await stopAndUnloadAudio();
    router.back();
  }, [router, stopAndUnloadAudio]);

  const goNext = async () => {
    if (currentStep < sosExercise.steps.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.sequence([
        Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await stopAndUnloadAudio();
      router.back();
    }
  };

  const toggleMute = useCallback(async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!audioRef.current) {
      return;
    }

    try {
      await audioRef.current.setIsMutedAsync(nextMuted);
    } catch {
      // Keep SOS usable even if mute update fails.
    }
  }, [isMuted]);

  const progress = (currentStep + 1) / sosExercise.steps.length;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={toggleMute} style={styles.closeBtn} activeOpacity={0.8}>
          {isMuted ? (
            <VolumeX color={Colors.white} size={20} />
          ) : (
            <Volume2 color={Colors.white} size={20} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
          <X color={Colors.white} size={22} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.breathCircle, { transform: [{ scale: breathAnim }] }]}>
        <View style={styles.breathInner}>
          <Heart color="rgba(255,255,255,0.8)" size={32} fill="rgba(255,255,255,0.3)" />
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.title}>Estás a salvo</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>Paso {currentStep + 1} de {sosExercise.steps.length}</Text>

        <Animated.View style={[styles.stepCard, { opacity: stepFade }]}>
          <Text style={styles.stepText}>{sosExercise.steps[currentStep]}</Text>
        </Animated.View>

        <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.8}>
          <Text style={styles.nextBtnText}>
            {currentStep < sosExercise.steps.length - 1 ? 'Siguiente' : 'Estoy mejor'}
          </Text>
          <ChevronRight color={Colors.white} size={18} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3A3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircle: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(232, 168, 124, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  breathInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(232, 168, 124, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#F5E6D3',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 2,
  },
  stepCount: {
    fontSize: 12,
    color: 'rgba(245, 230, 211, 0.6)',
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepText: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: '#F5E6D3',
    textAlign: 'center',
    lineHeight: 30,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
