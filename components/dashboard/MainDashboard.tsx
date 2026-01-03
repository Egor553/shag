
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
import { Calendar as CalendarIcon, Users, LayoutGrid, UserCircle, Briefcase, TrendingUp, ShieldCheck, Heart, UserPlus, Activity, Target, Zap } from 'lucide-react';
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
  const textAccentClass = 'text-white';

  const mobileNavItems = [
    { id: AppTab.CATALOG, icon: LayoutGrid, label: 'ШАГи' },
    ...(isEnt ? [{ id: AppTab.SERVICES, icon: UserPlus, label: 'Мои ШАГи' }] : []),
    { id: AppTab.JOBS, icon: Briefcase, label: 'Работа' },
    { id: AppTab.MISSION, icon: Target, label: 'Миссия' },
    { id: AppTab.MEETINGS, icon: CalendarIcon, label: 'Встречи' },
    { id: AppTab.PROFILE, icon: UserCircle, label: 'Кабинет' }
  ];

  const totalGlobalImpact = localBookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalMeetingsCount = localBookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#1a1d23] text-white flex flex-col font-['Inter'] relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="flex flex-1 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} session={session} onLogout={onLogout} />

        <main className={`flex-1 transition-all duration-500 relative z-10 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} pb-32 md:pb-12`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-16 min-h-screen flex flex-col">
            
            {(activeTab === AppTab.CATALOG || activeTab === AppTab.MISSION) && (
              <div className="mb-14 md:mb-20">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="col-span-2 md:col-span-1 bg-white/[0.05] border border-white/20 p-8 rounded-tl-[40px] rounded-br-[40px] backdrop-blur-3xl flex items-center gap-6 group hover:bg-white/[0.08] transition-all">
                       <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          <Activity size={24} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em] mb-1">Pulse_Module</p>
                          <h4 className="text-xl font-black font-syne uppercase text-white leading-none">Энергообмен</h4>
                       </div>
                    </div>
                    
                    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-tl-[24px] rounded-br-[24px] flex flex-col justify-center">
                       <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2 leading-none">Events_Total</p>
                       <p className="text-3xl font-black font-syne text-white tracking-tighter">{totalMeetingsCount}</p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-tr-[24px] rounded-bl-[24px] flex flex-col justify-center">
                       <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2 leading-none">Impact_Total</p>
                       <p className="text-3xl font-black font-syne text-white tracking-tighter">{totalGlobalImpact.toLocaleString()} ₽</p>
                    </div>
                 </div>
              </div>
            )}

            <div className="flex-1">
              {activeTab === AppTab.CATALOG && <CatalogView services={services} mentors={allMentors} onServiceClick={handleServiceClick} />}
              {activeTab === AppTab.JOBS && <JobsView jobs={jobs} session={session} onSaveJob={onSaveJob} onDeleteJob={onDeleteJob} />}
              {activeTab === AppTab.MEETINGS && <MeetingsListView bookings={localBookings} session={session} onPay={handlePayFromList} onRefresh={onRefresh} />}
              {activeTab === AppTab.MISSION && <MissionView />}
              {activeTab === AppTab.ADMIN && isAdmin && <AdminPanel onLogout={onLogout} session={session} />}
              {activeTab === AppTab.PROFILE && (isEnt ? <EntrepreneurProfile session={session} mentorProfile={mentorProfile} isSavingProfile={isSavingProfile} onSaveProfile={() => onSaveProfile()} onUpdateMentorProfile={onUpdateMentorProfile} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} transactions={transactions} bookings={localBookings} services={services} jobs={jobs} /> : <YouthProfile session={session} onCatalogClick={() => setActiveTab(AppTab.CATALOG)} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} onSaveProfile={() => onSaveProfile()} isSavingProfile={isSavingProfile} bookings={localBookings} />)}
              {activeTab === AppTab.SERVICES && isEnt && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.03] p-10 md:p-16 rounded-tr-[80px] rounded-bl-[80px] border border-white/15 shadow-3xl overflow-hidden relative">
                     <div className="relative z-10 space-y-4 text-center md:text-left">
                        <span className="text-white opacity-60 text-[10px] font-black uppercase tracking-[0.5em]">SYSTEM_MODULE_MANAGER</span>
                        <h2 className="text-5xl md:text-8xl font-black uppercase font-syne tracking-tighter leading-[0.9] text-white">ВИТРИНА<br/><span className="text-white/30 italic">ШАГОВ</span></h2>
                     </div>
                     <ShagLogo className="w-32 h-32 md:w-64 md:h-64 opacity-15 absolute -right-12 -bottom-12" />
                  </div>
                  <ServiceBuilder services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId).toLowerCase() === String(session.email).toLowerCase())} onSave={onSaveService} onUpdate={onUpdateService} onDelete={onDeleteService} />
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-24">
              <Footer />
            </div>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/[0.08] backdrop-blur-3xl border border-white/20 z-[100] md:hidden flex items-center justify-around rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <item.icon size={22} className={`${isActive ? 'scale-110 opacity-100' : 'opacity-60'}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 h-0'}`}>{item.label}</span>
              {isActive && <div className={`w-1.5 h-1.5 rounded-full bg-white absolute bottom-2 shadow-[0_0_12px_#ffffff]`} />}
            </button>
          );
        })}
      </nav>

      {showPlanner && isEnt && <ResourcePlannerModal session={session} mentorProfile={mentorProfile} onSaveProfile={onSaveProfile} onClose={() => setShowPlanner(false)} />}
      {showBooking && activeMentor && <BookingModal mentor={activeMentor} service={selectedService || undefined} bookings={localBookings} session={session} existingBooking={pendingPaymentBooking || undefined} onClose={() => { setShowBooking(false); setSelectedService(null); setPendingPaymentBooking(null); }} onComplete={() => { if (onRefresh) onRefresh(); setShowBooking(false); }} />}
    </div>
  );
};
