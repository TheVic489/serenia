import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Smartphone, Globe, Headphones, Book, Video, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { resources, ResourceType } from '@/mocks/resources';

const TYPE_CONFIG: Record<ResourceType, { label: string; icon: typeof Smartphone; color: string }> = {
  app: { label: 'Aplicación', icon: Smartphone, color: Colors.success },
  web: { label: 'Sitio web', icon: Globe, color: Colors.primary },
  audio: { label: 'Audio', icon: Headphones, color: Colors.sage },
  book: { label: 'Libro', icon: Book, color: Colors.earth },
  video: { label: 'Video', icon: Video, color: Colors.accent },
};

const FILTERS = ['Todos', 'Sitios web', 'Apps', 'Libros', 'Videos', 'Audio'];
const FILTER_MAP: Record<string, ResourceType | null> = {
  'Todos': null,
  'Sitios web': 'web',
  'Apps': 'app',
  'Libros': 'book',
  'Videos': 'video',
  'Audio': 'audio',
};

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesFilter = activeFilter === 'Todos' || r.type === FILTER_MAP[activeFilter];
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Recursos</Text>
        <Text style={styles.headerSubtitle}>Enlaces, apps y materiales para tu bienestar</Text>
        
        <View style={styles.searchContainer}>
          <Search color={Colors.textMuted} size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar recursos..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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

        <View style={styles.list}>
          {filteredResources.map(resource => {
            const config = TYPE_CONFIG[resource.type];
            const IconComponent = config.icon;

            return (
              <TouchableOpacity
                key={resource.id}
                style={styles.card}
                onPress={() => handlePress(resource.url)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
                    <IconComponent color={config.color} size={12} />
                    <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{resource.title}</Text>
                  <Text style={styles.cardDescription}>{resource.description}</Text>
                </View>
                <View style={styles.linkIconContainer}>
                  <ExternalLink color={Colors.textMuted} size={18} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
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
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkIconContainer: {
    padding: 4,
    marginTop: 4,
  },
});
