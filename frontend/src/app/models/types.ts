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
  checks?: number;
  score?: number;
  type: string;
  familyId?: number;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  workload?: number;
  score?: number;
  progress?: number;
  videos?: string[];
  textMaterialIds?: number[];
};

export type TextMaterial = {
  id: number;
  title: string;
  text?: string;
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
  description?: string;
  scoreRequired?: number;
  validUntil?: string;
};