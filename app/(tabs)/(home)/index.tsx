import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePosts } from '@/providers/PostsProvider';
import { useUser } from '@/providers/UserProvider';
import PostCard from '@/components/PostCard';
import SOSButton from '@/components/SOSButton';

const QUOTES = [
  'Cuidar de ti no es egoísmo, es supervivencia profesional.',
  'Tu bienestar importa tanto como el de quienes acompañas.',
  'Hoy es un buen día para hacer una pausa consciente.',
  'No puedes servir de un vaso vacío. Rellénate primero.',
  'Pequeños actos de autocuidado crean grandes cambios.',
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { posts, articlePosts, communityPosts, toggleLike, toggleSave } = usePosts();
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'community'>('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

  const displayPosts = activeTab === 'all' ? posts : activeTab === 'articles' ? articlePosts : communityPosts;

  const handlePostPress = useCallback((id: string) => {
    router.push({ pathname: '/post-detail', params: { id } });
  }, [router]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <SOSButton />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Animated.View style={[styles.hero, { paddingTop: insets.top + 16, opacity: headerOpacity }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>
                {profile.name ? `Hola, ${profile.name}` : 'Bienvenido a Serenia'}
              </Text>
              <Text style={styles.subtitle}>¿Cómo estás hoy?</Text>
            </View>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/images/logo.jpg')} style={styles.logoImage} />
            </View>
          </View>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>&quot;{quote}&quot;</Text>
          </View>
        </Animated.View>

        <View style={styles.tabRow}>
          {(['all', 'articles', 'community'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              {tab === 'community' && <Users color={activeTab === tab ? Colors.white : Colors.textSecondary} size={14} />}
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'Todo' : tab === 'articles' ? 'Artículos' : 'Comunidad'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {displayPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => handlePostPress(post.id)}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.cream,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  quoteCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 21,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.sand,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
});
