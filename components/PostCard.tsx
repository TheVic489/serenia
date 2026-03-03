import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Bookmark, UserCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Post } from '@/types';
import Colors from '@/constants/colors';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
  onSave: () => void;
}

const PostCard = React.memo(({ post, onPress, onLike, onSave }: PostCardProps) => {
  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      testID={`post-card-${post.id}`}
    >
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} contentFit="cover" />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, post.isAnonymous && styles.anonymousAvatar]}>
              <UserCircle color={post.isAnonymous ? Colors.textMuted : Colors.primary} size={20} />
            </View>
            <View>
              <Text style={styles.author}>{post.author}</Text>
              {post.authorRole && (
                <Text style={styles.authorRole}>{post.authorRole}</Text>
              )}
            </View>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: post.type === 'article' ? Colors.primaryLight + '30' : Colors.sage + '30' }]}>
            <Text style={[styles.categoryText, { color: post.type === 'article' ? Colors.primaryDark : Colors.sageDark }]}>
              {post.category}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
        <Text style={styles.preview} numberOfLines={3}>{post.content}</Text>

        <View style={styles.footer}>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
              <Heart
                color={post.isLiked ? Colors.accent : Colors.textMuted}
                size={18}
                fill={post.isLiked ? Colors.accent : 'transparent'}
              />
              <Text style={[styles.actionText, post.isLiked && styles.likedText]}>{post.likes}</Text>
            </TouchableOpacity>
            <View style={styles.actionBtn}>
              <MessageCircle color={Colors.textMuted} size={18} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </View>
          </View>
          <View style={styles.rightActions}>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Bookmark
                color={post.isSaved ? Colors.primary : Colors.textMuted}
                size={18}
                fill={post.isSaved ? Colors.primary : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousAvatar: {
    backgroundColor: Colors.border,
  },
  author: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  authorRole: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  preview: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  likedText: {
    color: Colors.accent,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  saveBtn: {
    padding: 2,
  },
});
