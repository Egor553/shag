
export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  YOUTH = 'youth',
  ADMIN = 'admin'
}

export enum MeetingFormat {
  ONLINE_1_ON_1 = 'Онлайн 1 на 1',
  OFFLINE_1_ON_1 = 'Оффлайн 1 на 1',
  GROUP_OFFLINE = 'Групповая встреча (до 10 чел)',
  GROUP_ONLINE = 'Групповой онлайн-созвон'
}

export enum AppTab {
  CATALOG = 'catalog',
  JOBS = 'jobs',
  MEETINGS = 'meetings',
  CHATS = 'chats',
  MISSION = 'mission',
  PROFILE = 'profile',
  SERVICES = 'services'
}

export interface Review {
  id: string;
  mentorId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'pending' | 'completed' | 'refunded';
  date: string;
}

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  isLoggedIn: boolean;
  id: string;
  isVerified?: boolean;
  phone?: string;
  city?: string;
  companyName?: string;
  turnover?: string;
  direction?: string;
  paymentUrl?: string; // Используется как Аватар
  rating?: number;
  reviewsCount?: number;
  favorites?: string[]; 
  // Поля анкет
  qualities?: string;
  requestToYouth?: string;
  videoUrl?: string;
  timeLimit?: string;
  slots?: string;
  birthDate?: string;
  focusGoal?: string;
  expectations?: string;
  mutualHelp?: string;
  values?: string[];
  createdAt?: string;
  ownerEmail?: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName?: string;
  userEmail: string;
  userName: string;
  format: MeetingFormat;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  goal: string;
  price?: number;
  serviceId?: string;
  serviceTitle?: string;
}

export interface Mentor extends UserSession {
  industry: string;
  experience?: string;
  description: string;
  achievements?: string[];
  singlePrice: number;
  groupPrice: number;
  avatarUrl: string; // fallback
}

export interface Service {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  description: string;
  price: number;
  groupPrice?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  format: MeetingFormat;
  duration: string;
  category: string;
  slots?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Job {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  description: string;
  reward: string; 
  category: string;
  deadline?: string;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderEmail: string;
  senderName: string;
  text: string;
  timestamp: string;
}
