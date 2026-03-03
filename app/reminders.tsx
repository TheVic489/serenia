import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Plus, Trash2, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useUser } from '@/providers/UserProvider';
import { Reminder } from '@/types';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function RemindersScreen() {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newDays, setNewDays] = useState<string[]>(['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);

  const handleAdd = () => {
    if (!newTitle.trim()) {
      Alert.alert('', 'Escribe un título para el recordatorio');
      return;
    }
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      message: newMessage.trim() || 'Es hora de cuidarte',
      time: newTime,
      isActive: true,
      days: newDays,
    };
    addReminder(reminder);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsAdding(false);
    setNewTitle('');
    setNewMessage('');
    setNewTime('12:00');
    setNewDays(['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar recordatorio', '¿Estás seguro/a?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteReminder(id);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
      },
    ]);
  };

  const toggleDay = (day: string) => {
    setNewDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: 'Recordatorios' }} />

      <View style={styles.infoCard}>
        <Bell color={Colors.primary} size={20} />
        <Text style={styles.infoText}>
          Los recordatorios te ayudan a mantener tus rutinas de autocuidado. Se mostrarán como notificaciones en tu dispositivo.
        </Text>
      </View>

      {reminders.map(reminder => (
        <View key={reminder.id} style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <View style={styles.timeRow}>
                <Clock color={Colors.textMuted} size={13} />
                <Text style={styles.timeText}>{reminder.time}</Text>
              </View>
            </View>
            <Switch
              value={reminder.isActive}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleReminder(reminder.id);
              }}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={reminder.isActive ? Colors.primary : Colors.textMuted}
            />
          </View>
          <Text style={styles.reminderMessage}>{reminder.message}</Text>
          <View style={styles.daysRow}>
            {DAYS.map(day => (
              <View
                key={day}
                style={[styles.dayChip, reminder.days.includes(day) && styles.dayChipActive]}
              >
                <Text style={[styles.dayText, reminder.days.includes(day) && styles.dayTextActive]}>
                  {day[0]}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(reminder.id)}
            >
              <Trash2 color={Colors.accent} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.addForm}>
          <Text style={styles.addFormTitle}>Nuevo recordatorio</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Título del recordatorio"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Mensaje (opcional)"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={styles.input}
            value={newTime}
            onChangeText={setNewTime}
            placeholder="Hora (ej: 14:00)"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.daysLabel}>Días</Text>
          <View style={styles.daysSelector}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.daySelectorChip, newDays.includes(day) && styles.daySelectorChipActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.daySelectorText, newDays.includes(day) && styles.daySelectorTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addFormActions}>
            <TouchableOpacity style={styles.cancelFormBtn} onPress={() => setIsAdding(false)}>
              <Text style={styles.cancelFormText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveFormBtn} onPress={handleAdd}>
              <Text style={styles.saveFormText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAdding(true)}
        >
          <Plus color={Colors.primary} size={20} />
          <Text style={styles.addBtnText}>Añadir recordatorio</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  reminderCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  reminderMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 19,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  dayTextActive: {
    color: Colors.white,
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  addForm: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '40',
  },
  addFormTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.sand,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
  },
  daysLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  daysSelector: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  daySelectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.sand,
  },
  daySelectorChipActive: {
    backgroundColor: Colors.primary,
  },
  daySelectorText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  daySelectorTextActive: {
    color: Colors.white,
  },
  addFormActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelFormBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.sand,
    alignItems: 'center',
  },
  cancelFormText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  saveFormBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveFormText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryLight + '40',
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
