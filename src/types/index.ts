export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  linkedinUrl?: string;
  walletAddress?: string;
  skills: string[];
  avatar?: string;
  location?: string;
  title?: string;
  company?: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  budget?: number;
  postedBy: string;
  postedAt: Date;
  status: 'active' | 'closed';
  applicants: number;
  paymentTx?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  content: string;
  type: 'update' | 'advice' | 'achievement' | 'question';
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface JobMatch {
  job: Job;
  matchScore: number;
  matchReasons: string[];
}

export interface WalletConnection {
  isConnected: boolean;
  address?: string;
  balance?: number;
  network?: string;
}