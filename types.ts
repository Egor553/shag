
export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  YOUTH = 'youth',
  ADMIN = 'admin'
}

export enum MeetingFormat {
  ONLINE_1_ON_1 = 'Онлайн 1 на 1',
  OFFLINE_1_ON_1 = 'Оффлайн 1 на 1',
  GROUP_OFFLINE = 'Групповая встреча (до 10 чел)'
}

export enum AppTab {
  CATALOG = 'catalog',
  MEETINGS = 'meetings',
  PROFILE = 'profile',
  SERVICES = 'services'
}

export interface Service {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  description: string;
  price: number; // Цена за 1-на-1 (базовая)
  groupPrice?: number; // Цена за группу
  format: MeetingFormat;
  duration: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  slots?: string; // JSON строка со слотами конкретно для этой услуги
}

export interface Mentor {
  id: string;
  name: string;
  industry: string;
  city: string;
  description: string;
  videoUrl: string;
  avatarUrl: string;
  singlePrice: number;
  groupPrice: number;
  ownerEmail?: string;
  slots?: string;
  createdAt?: string;
  paymentUrl?: string;
  experience?: string;
  achievements?: string[];
  request?: string;
  values?: string | string[];
}

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  isLoggedIn: boolean;
  id: string;
  isVerified?: boolean;
  birthDate?: string;
  city?: string;
  companyName?: string;
  turnover?: string;
  direction?: string;
  qualities?: string;
  requestToYouth?: string;
  videoUrl?: string;
  timeLimit?: string;
  slots?: string;
  phone?: string;
  focusGoal?: string;
  expectations?: string;
  mutualHelp?: string;
  paymentUrl?: string;
}

// Added serviceId and serviceTitle properties to support service-specific bookings and resolve TS errors
export interface Booking {
  id: string;
  mentorId: string;
  userEmail: string;
  userName: string;
  format: MeetingFormat;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
  goal: string;
  slot?: string;
  price?: number;
  serviceId?: string;
  serviceTitle?: string;
}
