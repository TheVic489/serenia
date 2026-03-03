import { useEffect, useState, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { DiaryEntry } from '@/types';

export const [DiaryProvider, useDiary] = createContextHook(() => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const entriesQuery = useQuery({
    queryKey: ['diary-entries'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('serenia-diary');
      return stored ? JSON.parse(stored) as DiaryEntry[] : [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (e: DiaryEntry[]) => {
      await AsyncStorage.setItem('serenia-diary', JSON.stringify(e));
      return e;
    },
  });

  useEffect(() => {
    if (entriesQuery.data) {
      setEntries(entriesQuery.data);
    }
  }, [entriesQuery.data]);

  const addEntry = (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveMutation.mutate(updated);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveMutation.mutate(updated);
  };

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  return {
    entries: sortedEntries,
    isLoading: entriesQuery.isLoading,
    addEntry,
    deleteEntry,
  };
});
