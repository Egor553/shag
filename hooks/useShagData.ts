
import { useState, useCallback } from 'react';
import { Mentor, Service, Job, Booking, Transaction, UserSession, UserRole } from '../types';
import { dbService } from '../services/databaseService';
import { shagService } from '../services/shagService';
import { missionService } from '../services/missionService';
import { MENTORS } from '../constants';

export const useShagData = () => {
  const [allMentors, setAllMentors] = useState<Mentor[]>(MENTORS);
  const [services, setServices] = useState<Service[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncUserData = useCallback(async (email: string, session?: UserSession, updateSession?: (s: UserSession) => void) => {
    setIsSyncing(true);
    try {
      const data = await dbService.syncData(email);
      
      // Fix: Filter all users for mentors only and cast correctly
      const allUsers = data.dynamicMentors || [];
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
      
      // Ищем любого пользователя в базе по email для обновления сессии
      const currentUser = allUsers.find((u: UserSession) => 
        String(u.email).toLowerCase() === String(email).toLowerCase()
      );

      if (currentUser) {
        // Fix: Cast currentUser to Mentor when the role matches
        if (currentUser.role === UserRole.ENTREPRENEUR) {
          setMentorProfile(currentUser as Mentor);
        }
        
        // Обновляем состояние сессии для любого пользователя
        if (session && updateSession) {
          updateSession({ 
            ...session, 
            ...currentUser, 
            isLoggedIn: true, 
            balance: Number(currentUser.balance) || 0 
          });
        }
      }
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveService = async (s: Partial<Service>, session: UserSession) => {
    const serviceId = s.id || Math.random().toString(36).substr(2, 9);
    const sToSave = { 
      ...s, 
      id: serviceId, 
      mentorId: session.id || session.email, 
      mentorName: session.name 
    } as Service;
    
    if (s.id) {
      await shagService.update(s.id, sToSave);
    } else {
      await shagService.save(sToSave);
    }
    await syncUserData(session.email);
  };

  const deleteService = async (id: string, email: string) => {
    await shagService.delete(id);
    await syncUserData(email);
  };

  const saveJob = async (j: Partial<Job>, session: UserSession) => {
    const jobId = j.id || Math.random().toString(36).substr(2, 9);
    const jToSave = { 
      ...j, 
      id: jobId,
      mentorId: session.id || session.email,
      mentorName: session.name,
      createdAt: new Date().toISOString(),
      status: 'active'
    } as Job;
    
    if (j.id) {
      await missionService.update(j.id, jToSave);
    } else {
      await missionService.save(jToSave); 
    }
    await syncUserData(session.email);
  };

  const deleteJob = async (id: string, email: string) => {
    await missionService.delete(id);
    await syncUserData(email);
  };

  const updateProfile = async (email: string, updates: Partial<UserSession>) => {
    await dbService.updateProfile(email, updates);
    await syncUserData(email);
  };

  return {
    allMentors,
    services,
    jobs,
    bookings,
    transactions,
    mentorProfile,
    isSyncing,
    syncUserData,
    saveService,
    deleteService,
    saveJob,
    deleteJob,
    updateProfile,
    setMentorProfile
  };
};
