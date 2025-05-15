export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  score?: number;
  avatar?: string;
  coursesIds?: number[];
  familyIds?: number[];
  challengesCompletedIds?: number[];
  pendingChallengesIds?: number[];
  imagesOfChallenge?: string[];
  couponsIds?: number[];
  posts?: number[];
};

export type Challenge = {
  id: number;
  title: string;
  description: string;
  status: string;
  participantsIds?: number[];
  image?: string;
  imageBanner?:string;
  checks?: number;
  score?: number;
  type: string;
  familyId?: number;
};

;
export type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  workload: number; // in minutes
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  
  // Price and enrollment
  price: number;
  isEnrolled?: boolean;
  enrollmentDate?: Date;
  
  // Content
  modules: CourseModule[];
  
  // Progress tracking
  progress: {
    completed: number;
    total: number;
    percentageCompleted: number;
    lastAccessDate?: Date;
    status: 'not_started' | 'in_progress' | 'completed';
  };
  
  // Points and achievements
  score: {
    current: number;
    total: number;
    achievements: Achievement[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  prerequisites?: string[];
};

export type CourseModule = {
  id: number;
  title: string;
  description: string;
  order: number;
  
  content: {
    videos: Video[];
    textMaterials: TextMaterial[];
    quizzes: Quiz[];
  };
  
  isLocked: boolean;
  progress: number;
};

export type Video = {
  id: number;
  title: string;
  description: string;
  duration: number; // in seconds
  url: string;
  thumbnail?: string;
  isWatched: boolean;
  watchedDuration: number;
  lastWatchedAt?: Date;
};

export type TextMaterial = {
  id: number;
  title: string;
  content: string;
  estimatedReadTime: number; // in minutes
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
};

export type Quiz = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  minimumScore: number;
  attempts: QuizAttempt[];
  isCompleted: boolean;
  bestScore?: number;
};

export type Question = {
  id: number;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options?: string[];
  correctAnswer: string | number;
  points: number;
};

export type QuizAttempt = {
  id: number;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  answers: {
    questionId: number;
    answer: string | number;
    isCorrect: boolean;
  }[];
};

export type Achievement = {
  id: number;
  title: string;
  description: string;
  points: number;
  earnedAt?: Date;
  type: 'completion' | 'perfect_score' | 'streak' | 'speed';
  icon?: string;
};


export type Family = {
  id: number;
  name: string;
  membersIds?: number[];
  postsIds?: number[];
  challengesIds?: number[];
};

export type Post = {
  id: number;
  userId: number;
  familyId?: number;
  caption?: string;
  image?: string;
  likes?: number;
  timestamp?: string;
};

export type Coupon = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  scoreRequired?: number;
  validUntil?: string;
};