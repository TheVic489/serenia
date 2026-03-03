export interface UserProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  joinedDate: string;
  isOnboarded: boolean;
}

export interface Post {
  id: string;
  type: 'article' | 'community';
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  isAnonymous?: boolean;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  image?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  postCount: number;
  color: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'mindfulness' | 'physical' | 'journaling' | 'grounding';
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  image: string;
  color: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  emotion: Emotion;
  sleepQuality: number;
  gratitude?: string;
  createdAt: string;
}

export type Emotion = 'happy' | 'calm' | 'neutral' | 'tired' | 'sad' | 'stressed' | 'anxious';

export interface Reminder {
  id: string;
  title: string;
  message: string;
  time: string;
  isActive: boolean;
  days: string[];
}
