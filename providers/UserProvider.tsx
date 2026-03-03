import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { UserProfile, Reminder } from '@/types';

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  name: '',
  role: '',
  bio: '',
  avatar: '',
  joinedDate: new Date().toISOString(),
  isOnboarded: false,
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Pausa consciente',
      message: 'Es hora de hacer una micro-pausa. Tu bienestar importa.',
      time: '10:00',
      isActive: true,
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    },
    {
      id: '2',
      title: 'Cierre del día',
      message: 'Tómate un momento para escribir en tu diario antes de descansar.',
      time: '20:00',
      isActive: true,
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },
  ]);

  const profileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('serenia-profile');
      return stored ? JSON.parse(stored) as UserProfile : DEFAULT_PROFILE;
    },
  });

  const remindersQuery = useQuery({
    queryKey: ['user-reminders'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('serenia-reminders');
      return stored ? JSON.parse(stored) as Reminder[] : null;
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (p: UserProfile) => {
      await AsyncStorage.setItem('serenia-profile', JSON.stringify(p));
      return p;
    },
  });

  const saveRemindersMutation = useMutation({
    mutationFn: async (r: Reminder[]) => {
      await AsyncStorage.setItem('serenia-reminders', JSON.stringify(r));
      return r;
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    if (remindersQuery.data) {
      setReminders(remindersQuery.data);
    }
  }, [remindersQuery.data]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfileMutation.mutate(updated);
  };

  const completeOnboarding = (name: string, role: string) => {
    const updated = { ...profile, name, role, isOnboarded: true };
    setProfile(updated);
    saveProfileMutation.mutate(updated);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    setReminders(updated);
    saveRemindersMutation.mutate(updated);
  };

  const addReminder = (reminder: Reminder) => {
    const updated = [...reminders, reminder];
    setReminders(updated);
    saveRemindersMutation.mutate(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveRemindersMutation.mutate(updated);
  };

  return {
    profile,
    reminders,
    isLoading: profileQuery.isLoading,
    updateProfile,
    completeOnboarding,
    toggleReminder,
    addReminder,
    deleteReminder,
  };
});
