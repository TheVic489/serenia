import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Smile, Meh, Frown, Moon, CloudRain, Zap, Coffee } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDiary } from '@/providers/DiaryProvider';
import { Emotion, DiaryEntry } from '@/types';

const EMOTION_CONFIG: Record<Emotion, { label: string; icon: typeof Smile; color: string }> = {
  happy: { label: 'Feliz', icon: Smile, color: '#F0C27F' },
  calm: { label: 'En calma', icon: Coffee, color: '#7D9B76' },
  neutral: { label: 'Neutral', icon: Meh, color: '#9C8B7A' },
  tired: { label: 'Cansado/a', icon: Moon, color: '#8B6F47' },
  sad: { label: 'Triste', icon: Frown, color: '#6B8CAE' },
  stressed: { label: 'Estresado/a', icon: Zap, color: '#D4845A' },
  anxious: { label: 'Ansioso/a', icon: CloudRain, color: '#C1534E' },
};

export default function DiaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entries, isLoading } = useDiary();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Mi Diario</Text>
              <Text style={styles.headerSubtitle}>Tu espacio seguro para reflexionar</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/new-diary-entry')}
              testID="new-diary-entry"
            >
              <Plus color={Colors.white} size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {entries.length === 0 && !isLoading ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Coffee color={Colors.primaryLight} size={40} />
            </View>
            <Text style={styles.emptyTitle}>Tu diario está vacío</Text>
            <Text style={styles.emptyText}>
              Empieza escribiendo cómo te sientes hoy. Este es tu espacio privado.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/new-diary-entry')}
            >
              <Text style={styles.emptyBtnText}>Escribir mi primera entrada</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesList}>
            {entries.map(entry => (
              <DiaryEntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const DiaryEntryCard = React.memo(({ entry }: { entry: DiaryEntry }) => {
  const config = EMOTION_CONFIG[entry.emotion];
  const IconComp = config?.icon ?? Meh;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.entryCard} testID={`diary-entry-${entry.id}`}>
      <View style={styles.entryHeader}>
        <View style={[styles.emotionBadge, { backgroundColor: (config?.color ?? '#9C8B7A') + '20' }]}>
          <IconComp color={config?.color ?? '#9C8B7A'} size={18} />
          <Text style={[styles.emotionLabel, { color: config?.color ?? '#9C8B7A' }]}>{config?.label ?? entry.emotion}</Text>
        </View>
        <View style={styles.entryDateCol}>
          <Text style={styles.entryDate}>{formatDate(entry.createdAt)}</Text>
          <Text style={styles.entryTime}>{formatTime(entry.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
      {entry.gratitude && (
        <View style={styles.gratitudeRow}>
          <Text style={styles.gratitudeLabel}>Agradecimiento:</Text>
          <Text style={styles.gratitudeText}>{entry.gratitude}</Text>
        </View>
      )}
      <View style={styles.sleepRow}>
        <Moon color={Colors.textMuted} size={13} />
        <Text style={styles.sleepText}>Sueño: {entry.sleepQuality}/5</Text>
        <View style={styles.sleepDots}>
          {[1, 2, 3, 4, 5].map(i => (
            <View
              key={i}
              style={[styles.sleepDot, { backgroundColor: i <= entry.sleepQuality ? Colors.primary : Colors.border }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

DiaryEntryCard.displayName = 'DiaryEntryCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.cream,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  entriesList: {
    padding: 16,
    gap: 12,
  },
  entryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  emotionLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  entryDateCol: {
    alignItems: 'flex-end',
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  entryTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  entryContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 10,
  },
  gratitudeRow: {
    backgroundColor: Colors.warmLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  gratitudeLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.earth,
    marginBottom: 2,
  },
  gratitudeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sleepText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sleepDots: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 4,
  },
  sleepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
