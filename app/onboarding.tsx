import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, ArrowRight, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useUser } from '@/providers/UserProvider';

const ROLES = [
  'Trabajador/a social',
  'Educador/a social',
  'Psicólogo/a',
  'Integrador/a social',
  'Mediador/a',
  'Otro',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateStep = (nextStep: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(nextStep), 200);
  };

  const handleNext = () => {
    if (step === 0) {
      animateStep(1);
    } else if (step === 1) {
      if (!name.trim()) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateStep(2);
    } else if (step === 2) {
      if (!role) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeOnboarding(name.trim(), role);
      router.replace('/(tabs)/(home)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {step === 0 && (
            <View style={styles.welcomeStep}>
              <View style={styles.logoCircle}>
                <Sparkles color={Colors.primary} size={40} />
              </View>
              <Text style={styles.appName}>Serenia</Text>
              <Text style={styles.tagline}>Cuidar desde dentro</Text>
              <Text style={styles.welcomeText}>
                Un espacio seguro de autocuidado para profesionales de la intervención social.
                {'\n\n'}Aquí encontrarás herramientas, comunidad y apoyo para cuidar tu bienestar emocional.
              </Text>
            </View>
          )}

          {step === 1 && (
            <View style={styles.inputStep}>
              <Heart color={Colors.primaryLight} size={32} />
              <Text style={styles.stepTitle}>¿Cómo te llamas?</Text>
              <Text style={styles.stepSubtitle}>Tu nombre se mostrará en tu perfil privado</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor={Colors.textMuted}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.roleStep}>
              <Text style={styles.stepTitle}>¿Cuál es tu perfil profesional?</Text>
              <Text style={styles.stepSubtitle}>Esto nos ayuda a personalizar tu experiencia</Text>
              <View style={styles.rolesGrid}>
                {ROLES.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, role === r && styles.roleChipActive]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRole(r);
                    }}
                  >
                    <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            ((step === 1 && !name.trim()) || (step === 2 && !role)) && styles.nextBtnDisabled,
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={(step === 1 && !name.trim()) || (step === 2 && !role)}
        >
          <Text style={styles.nextBtnText}>
            {step === 0 ? 'Empezar' : step === 1 ? 'Siguiente' : 'Entrar en Serenia'}
          </Text>
          <ArrowRight color={Colors.white} size={18} />
        </TouchableOpacity>

        {step > 0 && (
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeStep: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  inputStep: {
    alignItems: 'center',
    gap: 12,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  nameInput: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  roleStep: {
    alignItems: 'center',
    gap: 8,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  roleChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.white,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
});
