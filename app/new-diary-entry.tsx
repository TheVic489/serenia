import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Smile, Meh, Frown, Moon, CloudRain, Zap, Coffee, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useDiary } from '@/providers/DiaryProvider';
import { Emotion } from '@/types';

const EMOTIONS: { key: Emotion; label: string; icon: typeof Smile; color: string }[] = [
  { key: 'happy', label: 'Feliz', icon: Smile, color: '#F0C27F' },
  { key: 'calm', label: 'En calma', icon: Coffee, color: '#7D9B76' },
  { key: 'neutral', label: 'Neutral', icon: Meh, color: '#9C8B7A' },
  { key: 'tired', label: 'Cansado/a', icon: Moon, color: '#8B6F47' },
  { key: 'sad', label: 'Triste', icon: Frown, color: '#6B8CAE' },
  { key: 'stressed', label: 'Estresado/a', icon: Zap, color: '#D4845A' },
  { key: 'anxious', label: 'Ansioso/a', icon: CloudRain, color: '#C1534E' },
];

export default function NewDiaryEntryScreen() {
  const router = useRouter();
  const { addEntry } = useDiary();
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [gratitude, setGratitude] = useState('');

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('', 'Escribe algo antes de guardar');
      return;
    }
    if (!emotion) {
      Alert.alert('', 'Selecciona cómo te sientes');
      return;
    }

    addEntry({
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      emotion,
      sleepQuality,
      gratitude: gratitude.trim() || undefined,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
              <Check color={Colors.primary} size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>¿Cómo te sientes?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emotionRow}>
          {EMOTIONS.map(e => {
            const IconComp = e.icon;
            const isSelected = emotion === e.key;
            return (
              <TouchableOpacity
                key={e.key}
                style={[styles.emotionChip, isSelected && { backgroundColor: e.color + '25', borderColor: e.color }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEmotion(e.key);
                }}
              >
                <IconComp color={isSelected ? e.color : Colors.textMuted} size={22} />
                <Text style={[styles.emotionLabel, isSelected && { color: e.color }]}>{e.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>¿Qué tienes en mente?</Text>
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Escribe libremente... este es tu espacio seguro."
          placeholderTextColor={Colors.textMuted}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Calidad del sueño</Text>
        <View style={styles.sleepRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity
              key={i}
              style={[styles.sleepBtn, i <= sleepQuality && styles.sleepBtnActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSleepQuality(i);
              }}
            >
              <Moon
                color={i <= sleepQuality ? Colors.white : Colors.textMuted}
                size={18}
                fill={i <= sleepQuality ? Colors.white : 'transparent'}
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.sleepLabel}>{sleepQuality}/5</Text>
        </View>

        <Text style={styles.sectionTitle}>Agradecimiento del día (opcional)</Text>
        <TextInput
          style={styles.gratitudeInput}
          value={gratitude}
          onChangeText={setGratitude}
          placeholder="¿Por qué estás agradecido/a hoy?"
          placeholderTextColor={Colors.textMuted}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Guardar entrada</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  saveHeaderBtn: {
    padding: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 10,
    marginTop: 8,
  },
  emotionRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  emotionChip: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    minWidth: 72,
  },
  emotionLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  contentInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 23,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sleepBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sleepBtnActive: {
    backgroundColor: Colors.earth,
    borderColor: Colors.earth,
  },
  sleepLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  gratitudeInput: {
    backgroundColor: Colors.warmLight,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 80,
    lineHeight: 23,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.warm + '40',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
