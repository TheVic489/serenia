import { useState, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Post } from '@/types';
import { feedPosts } from '@/mocks/posts';

export const [PostsProvider, usePosts] = createContextHook(() => {
  const [posts, setPosts] = useState<Post[]>(feedPosts);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

  const toggleLike = useCallback((id: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p
      )
    );
  }, []);

  const articlePosts = useMemo(() => posts.filter(p => p.type === 'article'), [posts]);
  const communityPosts = useMemo(() => posts.filter(p => p.type === 'community'), [posts]);
  const savedPosts = useMemo(() => posts.filter(p => savedPostIds.has(p.id)), [posts, savedPostIds]);

  return {
    posts,
    articlePosts,
    communityPosts,
    savedPosts,
    toggleLike,
    toggleSave,
  };
});
