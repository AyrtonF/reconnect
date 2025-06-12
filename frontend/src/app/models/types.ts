// User related types
export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  institutionId?: number;
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

// Institution related types
export type Institution = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  logo?: string;
  description?: string;
  coursesIds?: number[];
  studentsIds?: number[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  socialMedia?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings?: {
    allowEnrollment: boolean;
    requireApproval: boolean;
    maxStudentsPerCourse?: number;
  };
};

// Course related types for institutions
export type InstitutionCourse = {
  id: number;
  institutionId: number;
  name: string;
  description: string;
  image?: string;
  materials: InstitutionMaterial[];
  videos: InstitutionVideo[];
  questions: InstitutionQuestion[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  studentsEnrolled?: number[];
  settings?: {
    allowEnrollment: boolean;
    requireApproval: boolean;
    maxStudents?: number;
  };
};

export type InstitutionMaterial = {
  id: number;
  courseId: number;
  title: string;
  description: string;
  filename: string;
  file?: File;
  type: string;
  size?: number;
  uploadedAt: Date;
  updatedAt?: Date;
};

export type InstitutionVideo = {
  id: number;
  courseId: number;
  title: string;
  description: string;
  filename: string;
  file?: File;
  duration?: number;
  thumbnail?: string;
  url?: string;
  uploadedAt: Date;
  updatedAt?: Date;
};

export type InstitutionQuestion = {
  id: number;
  courseId: number;
  question: string;
  alternatives: string[];
  correctAnswer: number;
  createdAt: Date;
  updatedAt?: Date;
};

// Challenge related types
export type Challenge = {
  id: number;
  title: string;
  description: string;
  status: string;
  participantsIds?: number[];
  image?: string;
  imageBanner?: string;
  checks?: number;
  score?: number;
  type: string;
  familyId?: number;
};

// Family related types
export type Family = {
  id: number;
  name: string;
  membersIds?: number[];
  postsIds?: number[];
  challengesIds?: number[];
};

// Post related types
export type Post = {
  id: number;
  userId: number;
  familyId?: number;
  caption?: string;
  image?: string;
  likes?: number;
  timestamp?: string;
};

// Coupon related types
export type Coupon = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  scoreRequired?: number;
  validUntil?: string;
};

// Student course types (for consuming courses)
export type StudentCourse = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  workload: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  
  price: number;
  isEnrolled?: boolean;
  enrollmentDate?: Date;
  
  modules: CourseModule[];
  
  progress: {
    completed: number;
    total: number;
    percentageCompleted: number;
    lastAccessDate?: Date;
    status: 'not_started' | 'in_progress' | 'completed';
  };
  
  score: {
    current: number;
    total: number;
    achievements: Achievement[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  prerequisites?: string[];
};

// Alias for backwards compatibility
export type Course = StudentCourse;

export type CourseModule = {
  id: number;
  title: string;
  description: string;
  order: number;
  
  content: {
    videos: StudentVideo[];
    textMaterials: TextMaterial[];
    quizzes: Quiz[];
  };
  
  isLocked: boolean;
  progress: number;
};

export type StudentVideo = {
  id: number;
  title: string;
  description: string;
  duration: number;
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
  estimatedReadTime: number;
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
  questions: QuizQuestion[];
  timeLimit?: number;
  minimumScore: number;
  attempts: QuizAttempt[];
  isCompleted: boolean;
  bestScore?: number;
};

export type QuizQuestion = {
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

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type InstitutionUser = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'institution_admin' | 'institution_teacher' | 'institution_staff';
  institutionId: number;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive';
  permissions: {
    canCreateCourses: boolean;
    canEditCourses: boolean;
    canDeleteCourses: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};