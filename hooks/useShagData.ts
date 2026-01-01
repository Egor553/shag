
import { useState, useCallback } from 'react';
import { Mentor, Service, Job, Booking, Transaction, UserSession, UserRole } from '../types';
import { dbService } from '../services/databaseService';
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
      
      const newMentors = data.dynamicMentors || MENTORS;
      setAllMentors(newMentors);
      
      const enrichedServices = (data.services || []).map((s: Service) => ({
        ...s,
        currentParticipants: (data.bookings || []).filter((b: Booking) => b.serviceId === s.id && b.status === 'confirmed').length
      }));

      setServices(enrichedServices);
      setBookings(data.bookings || []);
      setJobs(data.jobs || []);
      setTransactions(data.transactions || []);
      
      const currentMentor = newMentors.find((m: any) => 
        String(m.ownerEmail || m.email).toLowerCase() === String(email).toLowerCase()
      );

      if (currentMentor) {
        setMentorProfile(currentMentor);
        if (session && updateSession) {
          updateSession({ ...session, balance: Number(currentMentor.balance) || 0 });
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
      await dbService.updateService(s.id, sToSave);
    } else {
      await dbService.saveService(sToSave);
    }
    await syncUserData(session.email);
  };

  const deleteService = async (id: string, email: string) => {
    await dbService.deleteService(id);
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
      await dbService.updateJob(j.id, jToSave);
    } else {
      await dbService.saveJob(jToSave); 
    }
    await syncUserData(session.email);
  };

  const deleteJob = async (id: string, email: string) => {
    await dbService.deleteJob(id);
    await syncUserData(email);
  };

  const updateProfile = async (email: string, session: UserSession) => {
    await dbService.updateProfile(email, session);
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
