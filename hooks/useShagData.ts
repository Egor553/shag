
import { useState, useCallback } from 'react';
import { Mentor, Service, Job, Booking, Transaction, UserSession, UserRole, Auction, Bid } from '../types';
import { dbService } from '../services/databaseService';
import { MENTORS } from '../constants';

export const useShagData = () => {
  const [allMentors, setAllMentors] = useState<Mentor[]>(MENTORS);
  const [services, setServices] = useState<Service[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncUserData = useCallback(async (email: string, currentSession?: UserSession, updateSession?: (s: UserSession) => void) => {
    setIsSyncing(true);
    try {
      const data = await dbService.syncData(email);
      
      const allUsers = data.users || [];
      const mentorsFromDb = allUsers.filter(u => u.role === UserRole.ENTREPRENEUR) as Mentor[];
      setAllMentors(mentorsFromDb.length > 0 ? mentorsFromDb : MENTORS);
      
      const enrichedServices = (data.services || []).map((s: Service) => ({
        ...s,
        currentParticipants: (data.bookings || []).filter((b: Booking) => b.serviceId === s.id && b.status === 'confirmed').length
      }));

      setServices(enrichedServices);
      setBookings(data.bookings || []);
      setJobs(data.jobs || []);
      setTransactions(data.transactions || []);
      setAuctions(data.auctions || []);
      setBids(data.bids || []);
      
      const currentUser = allUsers.find((u: UserSession) => u.email.toLowerCase() === email.toLowerCase());

      if (currentUser) {
        if (currentUser.role === UserRole.ENTREPRENEUR || currentUser.role === UserRole.ADMIN) {
          setMentorProfile(currentUser as Mentor);
        }
        if (currentSession && updateSession) {
          updateSession({ ...currentSession, ...currentUser, isLoggedIn: true });
        }
      }
    } catch (e) {
      console.error("[SYNC] Error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveService = async (s: Partial<Service>, session: UserSession) => {
    const data = { ...s, mentorId: session.id || session.email, mentorName: session.name };
    await dbService.saveService(data);
    await syncUserData(session.email);
  };

  const deleteService = async (id: string, email: string) => {
    await dbService.deleteService(id);
    await syncUserData(email);
  };

  const saveJob = async (j: Partial<Job>, session: UserSession) => {
    const data = { 
      ...j, 
      mentorId: session.id || session.email, 
      mentorName: session.name, 
      createdAt: new Date().toISOString(), 
      status: 'active' 
    };
    await dbService.saveJob(data);
    await syncUserData(session.email);
  };

  const deleteJob = async (id: string, email: string) => {
    await dbService.deleteJob(id);
    await syncUserData(email);
  };

  const updateProfile = async (email: string, updates: Partial<UserSession>) => {
    await dbService.updateProfile(email, updates);
    await syncUserData(email);
  };

  return {
    allMentors, services, jobs, bookings, transactions, auctions, bids, mentorProfile, isSyncing,
    syncUserData, saveService, deleteService, saveJob, deleteJob, updateProfile, setMentorProfile
  };
};
