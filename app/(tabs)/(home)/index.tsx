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
        <Animated.View style={[styles.hero, { paddingTop: insets.top + 20, opacity: headerOpacity }]}>
          <Image 
            source={require('../../../assets/images/logo_recortado.jpg')} 
            style={styles.backgroundLogo} 
            resizeMode="contain"
          />
          <View style={styles.logoCircle}>
            <Image source={require('../../../assets/images/logo_recortado.jpg')} style={styles.mainLogo} />
          </View>
          
          <View style={styles.heroCenter}>
            <Text style={styles.greeting}>
              {profile.name ? `Hola, ${profile.name}` : 'Bienvenido a Serenia'}
            </Text>
            <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
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
    paddingBottom: 28,
    backgroundColor: Colors.cream,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  backgroundLogo: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 300,
    height: 300,
    opacity: 0.04,
    transform: [{ rotate: '-10deg' }],
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.white,
    padding: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
    zIndex: 2,
  },
  mainLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  heroCenter: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    opacity: 0.85,
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: '100%',
    zIndex: 1,
  },
  quoteText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
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
