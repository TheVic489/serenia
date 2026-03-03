import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Clock, Flame, Wind, Brain, Activity, PenLine, Anchor } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { exercises } from '@/mocks/exercises';
import { Exercise } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Wind }> = {
  breathing: { label: 'Respiración', icon: Wind },
  mindfulness: { label: 'Mindfulness', icon: Brain },
  physical: { label: 'Físico', icon: Activity },
  journaling: { label: 'Escritura', icon: PenLine },
  grounding: { label: 'Anclaje', icon: Anchor },
};

const FILTERS = ['Todos', 'Respiración', 'Mindfulness', 'Físico', 'Escritura', 'Anclaje'];
const FILTER_MAP: Record<string, string | null> = {
  'Todos': null,
  'Respiración': 'breathing',
  'Mindfulness': 'mindfulness',
  'Físico': 'physical',
  'Escritura': 'journaling',
  'Anclaje': 'grounding',
};

export default function ExercisesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredExercises = activeFilter === 'Todos'
    ? exercises
    : exercises.filter(e => e.type === FILTER_MAP[activeFilter]);

  const handlePress = useCallback((id: string) => {
    router.push({ pathname: '/exercise-detail', params: { id } });
  }, [router]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Ejercicios</Text>
          <Text style={styles.headerSubtitle}>Cuida tu mente y cuerpo</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} onPress={() => handlePress(exercise.id)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const ExerciseCard = React.memo(({ exercise, onPress }: { exercise: Exercise; onPress: () => void }) => {
  const config = TYPE_CONFIG[exercise.type];
  const IconComponent = config?.icon ?? Wind;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} testID={`exercise-${exercise.id}`}>
      <Image source={{ uri: exercise.image }} style={styles.cardImage} contentFit="cover" />
      <View style={[styles.cardOverlay, { backgroundColor: exercise.color + '20' }]}>
        <View style={[styles.typeBadge, { backgroundColor: exercise.color + '30' }]}>
          <IconComponent color={exercise.color} size={12} />
          <Text style={[styles.typeText, { color: exercise.color }]}>{config?.label}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{exercise.title}</Text>
        <View style={styles.cardMeta}>
          <Clock color={Colors.textMuted} size={12} />
          <Text style={styles.metaText}>{exercise.duration}</Text>
          <View style={[styles.difficultyDot, {
            backgroundColor: exercise.difficulty === 'easy' ? Colors.success : exercise.difficulty === 'medium' ? Colors.warm : Colors.accent,
          }]} />
          <Text style={styles.metaText}>
            {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ExerciseCard.displayName = 'ExerciseCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: Colors.cream,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.sand,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    padding: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 19,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  difficultyDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginLeft: 6,
  },
});
