import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Bookmark, UserCircle, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { usePosts } from '@/providers/PostsProvider';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, toggleLike, toggleSave } = usePosts();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Post no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: post.category }} />

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.heroImage} contentFit="cover" />
      )}

      <View style={styles.content}>
        <View style={styles.authorRow}>
          <View style={[styles.avatar, post.isAnonymous && styles.anonymousAvatar]}>
            <UserCircle color={post.isAnonymous ? Colors.textMuted : Colors.primary} size={22} />
          </View>
          <View>
            <Text style={styles.author}>{post.author}</Text>
            {post.authorRole && <Text style={styles.authorRole}>{post.authorRole}</Text>}
          </View>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.content}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleLike(post.id);
            }}
          >
            <Heart
              color={post.isLiked ? Colors.accent : Colors.textMuted}
              size={22}
              fill={post.isLiked ? Colors.accent : 'transparent'}
            />
            <Text style={[styles.actionText, post.isLiked && { color: Colors.accent }]}>{post.likes}</Text>
          </TouchableOpacity>
          <View style={styles.actionBtn}>
            <MessageCircle color={Colors.textMuted} size={22} />
            <Text style={styles.actionText}>{post.comments}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleSave(post.id);
            }}
          >
            <Bookmark
              color={post.isSaved ? Colors.primary : Colors.textMuted}
              size={22}
              fill={post.isSaved ? Colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>
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
    backgroundColor: Colors.background,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousAvatar: {
    backgroundColor: Colors.border,
  },
  author: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  authorRole: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 26,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});
