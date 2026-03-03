import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Clock, Play, CheckCircle, ChevronRight, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { exercises } from '@/mocks/exercises';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = exercises.find(e => e.id === id);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const progressAnim = useRef(new Animated.Value(0)).current;

  if (!exercise) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Ejercicio no encontrado</Text>
      </View>
    );
  }

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveStep(0);
    animateProgress(1, exercise.steps.length);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCompleted = new Set(completedSteps);
    newCompleted.add(activeStep);
    setCompletedSteps(newCompleted);

    if (activeStep < exercise.steps.length - 1) {
      setActiveStep(prev => prev + 1);
      animateProgress(activeStep + 2, exercise.steps.length);
    } else {
      setActiveStep(-2);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleReset = () => {
    setActiveStep(-1);
    setCompletedSteps(new Set());
    Animated.timing(progressAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const animateProgress = (step: number, total: number) => {
    Animated.timing(progressAnim, {
      toValue: step / total,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isCompleted = activeStep === -2;
  const isStarted = activeStep >= 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: exercise.title }} />

      <Image source={{ uri: exercise.image }} style={styles.heroImage} contentFit="cover" />
      <View style={[styles.colorStrip, { backgroundColor: exercise.color }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.description}>{exercise.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock color={Colors.textMuted} size={16} />
            <Text style={styles.metaText}>{exercise.duration}</Text>
          </View>
          <View style={[styles.diffBadge, {
            backgroundColor: exercise.difficulty === 'easy' ? Colors.successLight : exercise.difficulty === 'medium' ? Colors.warm + '30' : Colors.dangerLight,
          }]}>
            <Text style={[styles.diffText, {
              color: exercise.difficulty === 'easy' ? Colors.sageDark : exercise.difficulty === 'medium' ? Colors.earth : Colors.accent,
            }]}>
              {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
            </Text>
          </View>
        </View>

        {(isStarted || isCompleted) && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: exercise.color }]} />
            </View>
          </View>
        )}

        {isCompleted ? (
          <View style={styles.completedCard}>
            <CheckCircle color={Colors.success} size={48} />
            <Text style={styles.completedTitle}>¡Bien hecho!</Text>
            <Text style={styles.completedText}>Has completado el ejercicio. Tómate un momento para notar cómo te sientes.</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw color={Colors.primary} size={16} />
              <Text style={styles.resetBtnText}>Repetir ejercicio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.stepsTitle}>Pasos</Text>
            {exercise.steps.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepItem,
                  index === activeStep && styles.stepItemActive,
                  completedSteps.has(index) && styles.stepItemCompleted,
                ]}
              >
                <View style={[
                  styles.stepNumber,
                  index === activeStep && { backgroundColor: exercise.color },
                  completedSteps.has(index) && { backgroundColor: Colors.success },
                ]}>
                  {completedSteps.has(index) ? (
                    <CheckCircle color={Colors.white} size={14} />
                  ) : (
                    <Text style={[styles.stepNumberText, (index === activeStep || completedSteps.has(index)) && { color: Colors.white }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  index === activeStep && styles.stepTextActive,
                  completedSteps.has(index) && styles.stepTextCompleted,
                ]}>
                  {step}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: exercise.color }]}
              onPress={isStarted ? handleNext : handleStart}
              activeOpacity={0.8}
            >
              {!isStarted ? (
                <>
                  <Play color={Colors.white} size={18} fill={Colors.white} />
                  <Text style={styles.actionBtnText}>Comenzar</Text>
                </>
              ) : (
                <>
                  <Text style={styles.actionBtnText}>
                    {activeStep < exercise.steps.length - 1 ? 'Siguiente paso' : 'Finalizar'}
                  </Text>
                  <ChevronRight color={Colors.white} size={18} />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  colorStrip: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  diffText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: Colors.cardBackground,
  },
  stepItemActive: {
    backgroundColor: Colors.warmLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '50',
  },
  stepItemCompleted: {
    opacity: 0.6,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  stepTextActive: {
    color: Colors.text,
    fontWeight: '500' as const,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  completedCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.successLight,
    borderRadius: 20,
    gap: 12,
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.sageDark,
  },
  completedText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
