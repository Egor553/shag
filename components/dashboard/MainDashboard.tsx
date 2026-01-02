
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CatalogView } from './CatalogView';
import { JobsView } from './JobsView';
import { MeetingsListView } from './MeetingsListView';
import { MissionView } from './MissionView';
import { EntrepreneurProfile } from '../profiles/EntrepreneurProfile';
import { YouthProfile } from '../profiles/YouthProfile';
import { ServiceBuilder } from '../ServiceBuilder';
import { BookingModal } from '../BookingModal';
import { AdminPanel } from '../AdminPanel';
import { ResourcePlannerModal } from '../ResourcePlannerModal';
import { AppTab, UserRole, UserSession, Mentor, Service, Booking, Job, Transaction } from '../../types';
import { Calendar as CalendarIcon, Users, LayoutGrid, UserCircle, Briefcase, TrendingUp, Info } from 'lucide-react';
import { ShagLogo } from '../../App';
import { dbService } from '../../services/databaseService';
import { Footer } from '../Footer';

interface MainDashboardProps {
  session: UserSession;
  allMentors: Mentor[];
  services: Service[];
  jobs: Job[];
  bookings: Booking[];
  mentorProfile: Mentor | null;
  transactions?: Transaction[];
  onLogout: () => void;
  onUpdateMentorProfile: (profile: Mentor) => void;
  onSaveProfile: (updates?: Partial<UserSession>) => void;
  onSaveService: (s: Partial<Service>) => Promise<void>;
  onUpdateService: (id: string, updates: Partial<Service>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onUpdateAvatar: (url: string) => Promise<void>;
  onSessionUpdate: (session: UserSession) => void;
  onRefresh?: () => void;
  isSavingProfile: boolean;
  onSaveJob: (j: Partial<Job>) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  session,
  allMentors,
  services,
  jobs,
  bookings,
  mentorProfile,
  transactions = [],
  onLogout,
  onUpdateMentorProfile,
  onSaveProfile,
  onSaveService,
  onUpdateService,
  onDeleteService,
  onUpdateAvatar,
  onSessionUpdate,
  onRefresh,
  isSavingProfile,
  onSaveJob,
  onDeleteJob
}) => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CATALOG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [pendingPaymentBooking, setPendingPaymentBooking] = useState<Booking | null>(null);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);
  const [showPlanner, setShowPlanner] = useState(false);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    if (session.role === UserRole.ENTREPRENEUR) {
      const lastUpdate = session.lastWeeklyUpdate ? new Date(session.lastWeeklyUpdate) : null;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (!lastUpdate || lastUpdate < oneWeekAgo) {
        setShowPlanner(true);
      }
    }
  }, [session.role, session.lastWeeklyUpdate]);

  const handleServiceClick = (service: Service) => {
    const mentor = allMentors.find(m => 
      String(m.id) === String(service.mentorId) || 
      String(m.ownerEmail || m.email).toLowerCase() === String(service.mentorId).toLowerCase()
    );
    if (mentor) {
      setActiveMentor(mentor);
      setSelectedService(service);
      setPendingPaymentBooking(null);
      setShowBooking(true);
    }
  };

  const handlePayFromList = (booking: Booking) => {
    const mentor = allMentors.find(m => 
      String(m.id) === String(booking.mentorId) || 
      String(m.ownerEmail || m.email).toLowerCase() === String(booking.mentorId).toLowerCase()
    );
    if (mentor) {
      setActiveMentor(mentor);
      setPendingPaymentBooking(booking);
      setShowBooking(true);
    }
  };

  const isEnt = session.role === UserRole.ENTREPRENEUR;
  const isAdmin = session.role === UserRole.ADMIN || session.email === 'admin';
  
  const accentColorClass = isEnt ? 'indigo' : (isAdmin ? 'emerald' : 'violet');
  const textAccentClass = isEnt ? 'text-indigo-400' : (isAdmin ? 'text-emerald-400' : 'text-violet-400');
  const bgAccentSoftClass = isEnt ? 'bg-indigo-900/10' : (isAdmin ? 'bg-emerald-900/10' : 'bg-violet-900/10');
  const borderAccentSoftClass = isEnt ? 'border-indigo-500/10' : (isAdmin ? 'border-emerald-500/10' : 'border-violet-500/10');

  const totalGlobalImpact = localBookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalMeetingsCount = localBookings.filter(b => b.status === 'confirmed').length;

  const mobileNavItems = [
    { id: AppTab.CATALOG, icon: Users, label: 'ШАГи' },
    { id: AppTab.JOBS, icon: Briefcase, label: 'Миссии' },
    { id: AppTab.MEETINGS, icon: CalendarIcon, label: 'События' },
    { id: AppTab.MISSION, icon: Info, label: 'Миссия' },
    { id: AppTab.PROFILE, icon: UserCircle, label: 'ЛК' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-['Inter'] selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] ${bgAccentSoftClass} blur-[180px] rounded-full animate-pulse`} />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-white/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="flex flex-1">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          session={session} 
          onLogout={onLogout}
        />

        <main className={`flex-1 transition-all duration-500 relative z-10 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} pb-32 md:pb-12`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-16 min-h-screen">
            
            {(activeTab === AppTab.CATALOG || activeTab === AppTab.MISSION) && (
              <div className="mb-8 md:mb-20">
                 <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
                    <div className="flex items-center gap-5">
                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shrink-0">
                          <TrendingUp size={18} />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Community Pulse</p>
                          <h4 className="text-base md:text-lg font-black font-syne uppercase tracking-tight">Энергообмен</h4>
                       </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16">
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Событий</p>
                          <p className="text-xl md:text-2xl font-black font-syne">{totalMeetingsCount}</p>
                       </div>
                       <div className="space-y-0.5 text-right">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Вклад</p>
                          <p className={`text-xl md:text-2xl font-black font-syne ${textAccentClass}`}>{totalGlobalImpact.toLocaleString()} ₽</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="min-h-[70vh]">
              {activeTab === AppTab.CATALOG && <CatalogView services={services} mentors={allMentors} onServiceClick={handleServiceClick} />}
              {activeTab === AppTab.JOBS && <JobsView jobs={jobs} session={session} onSaveJob={onSaveJob} onDeleteJob={onDeleteJob} />}
              {activeTab === AppTab.MEETINGS && <MeetingsListView bookings={localBookings} session={session} onPay={handlePayFromList} onRefresh={onRefresh} />}
              {activeTab === AppTab.MISSION && <MissionView />}
              {activeTab === AppTab.ADMIN && isAdmin && <AdminPanel onLogout={onLogout} session={session} allMentors={allMentors} services={services} jobs={jobs} bookings={bookings} transactions={transactions} onUpdateMentorProfile={onUpdateMentorProfile} onSaveProfile={onSaveProfile} onSaveService={onSaveService} onUpdateService={onUpdateService} onDeleteService={onDeleteService} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} onRefresh={onRefresh} onSaveJob={onSaveJob} onDeleteJob={onDeleteJob} />}
              {activeTab === AppTab.PROFILE && (isEnt ? <EntrepreneurProfile session={session} mentorProfile={mentorProfile} isSavingProfile={isSavingProfile} onSaveProfile={onSaveProfile} onUpdateMentorProfile={onUpdateMentorProfile} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} transactions={transactions} bookings={localBookings} services={services} jobs={jobs} /> : <YouthProfile session={session} onCatalogClick={() => setActiveTab(AppTab.CATALOG)} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} onSaveProfile={onSaveProfile} isSavingProfile={isSavingProfile} bookings={localBookings} />)}
              {activeTab === AppTab.SERVICES && isEnt && (
                <div className="space-y-8 md:space-y-12">
                  <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.02] p-8 md:p-14 rounded-[40px] md:rounded-[48px] border border-white/5 relative overflow-hidden group shadow-xl">
                     <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
                       <span className={`px-4 py-1.5 ${isEnt ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/10' : 'bg-violet-500/10 text-violet-500 border-violet-500/10'} rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border`}>Management Studio</span>
                       <h2 className="text-4xl md:text-7xl font-black uppercase font-syne tracking-tighter leading-none">ВИТРИНА<br/>ШАГОВ</h2>
                     </div>
                     <div className="relative z-10 opacity-10 md:opacity-20 group-hover:opacity-40 transition-opacity duration-700 mt-6 md:mt-0"><ShagLogo className="w-20 h-20 md:w-40 md:h-40" /></div>
                  </div>
                  <ServiceBuilder services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId).toLowerCase() === String(session.email).toLowerCase())} onSave={onSaveService} onUpdate={onUpdateService} onDelete={onDeleteService} />
                </div>
              )}
            </div>
            
            <div className="mt-20">
              <Footer />
            </div>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 h-20 bg-[#0a0a0b]/95 backdrop-blur-2xl border border-white/10 z-[100] md:hidden flex items-center justify-around px-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all py-2 relative ${isActive ? textAccentClass : 'text-slate-500'}`}>
              <item.icon size={20} className={`${isActive ? 'scale-110' : 'opacity-60'} transition-transform`} />
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              {isActive && <div className={`w-1 h-1 rounded-full ${isEnt ? 'bg-indigo-400' : 'bg-violet-400'} absolute bottom-1`} />}
            </button>
          );
        })}
      </nav>

      {showPlanner && isEnt && <ResourcePlannerModal session={session} mentorProfile={mentorProfile} onSaveProfile={onSaveProfile} onClose={() => setShowPlanner(false)} />}
      {showBooking && activeMentor && <BookingModal mentor={activeMentor} service={selectedService || undefined} bookings={localBookings} session={session} existingBooking={pendingPaymentBooking || undefined} onClose={() => { setShowBooking(false); setSelectedService(null); setPendingPaymentBooking(null); }} onComplete={() => { if (onRefresh) onRefresh(); setShowBooking(false); }} />}
    </div>
  );
};
