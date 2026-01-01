
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
import { AppTab, UserRole, UserSession, Mentor, Service, Booking, Job, Transaction } from '../../types';
import { Calendar as CalendarIcon, Users, LayoutGrid, UserCircle, Briefcase, Info, Heart, Zap, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { dbService } from '../../services/databaseService';
import { ShagLogo } from '../../App';

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
  onSaveProfile: () => void;
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

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

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

  const handleReschedule = (booking: Booking) => {
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
  const isAdmin = session.role === UserRole.ADMIN || session.email === 'admin@shag.app';
  const accentColor = isEnt ? 'indigo' : (isAdmin ? 'emerald' : 'violet');

  const totalGlobalImpact = localBookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalMeetingsCount = localBookings.filter(b => b.status === 'confirmed').length;

  const mobileNavItems = [
    { id: AppTab.CATALOG, icon: Users, label: 'ШАГи' },
    { id: AppTab.JOBS, icon: Briefcase, label: 'Миссии' },
    { id: AppTab.MEETINGS, icon: CalendarIcon, label: 'События' },
    { id: AppTab.PROFILE, icon: UserCircle, label: 'ЛК' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex font-['Inter'] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-${accentColor}-900/10 blur-[150px] rounded-full animate-pulse`} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-white/5 blur-[120px] rounded-full" />
      </div>
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        session={session} 
        onLogout={onLogout}
      />

      <main className={`flex-1 transition-all duration-700 relative z-10 w-full min-w-0 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-28'}`}>
        <div className="px-5 md:px-16 pt-8 pb-32 md:py-20 max-w-7xl mx-auto">
          
          {(activeTab === AppTab.CATALOG || activeTab === AppTab.MISSION) && (
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
               <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 flex flex-wrap items-center justify-between gap-8 backdrop-blur-xl">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <TrendingUp className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Пульс сообщества</p>
                        <p className="text-white font-black text-xl font-syne uppercase">Энергообмен в действии</p>
                     </div>
                  </div>
                  <div className="flex gap-12">
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Проведено встреч</p>
                        <p className="text-2xl font-black text-white font-syne">{totalMeetingsCount}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Вклад в миссию</p>
                        <p className="text-2xl font-black text-indigo-400 font-syne">{totalGlobalImpact} ₽</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          <div className="animate-in fade-in duration-500">
            {activeTab === AppTab.CATALOG && (
              <CatalogView services={services} mentors={allMentors} onServiceClick={handleServiceClick} />
            )}

            {activeTab === AppTab.JOBS && (
              <JobsView jobs={jobs} session={session} onSaveJob={onSaveJob} onDeleteJob={onDeleteJob} />
            )}

            {activeTab === AppTab.MEETINGS && (
              <MeetingsListView 
                bookings={localBookings} 
                session={session} 
                onPay={handlePayFromList} 
                onReschedule={handleReschedule}
                onRefresh={onRefresh}
              />
            )}

            {activeTab === AppTab.MISSION && (
              <MissionView />
            )}

            {activeTab === AppTab.ADMIN && isAdmin && (
              <div className="bg-[#0a0a0b] rounded-[48px] border border-white/5 overflow-hidden min-h-[80vh]">
                <AdminPanel onLogout={onLogout} />
              </div>
            )}

            {activeTab === AppTab.PROFILE && (
              <div className="animate-in slide-in-from-bottom-4 duration-700">
                {isEnt ? (
                  <EntrepreneurProfile 
                    session={session} 
                    mentorProfile={mentorProfile} 
                    isSavingProfile={isSavingProfile} 
                    onSaveProfile={onSaveProfile} 
                    onUpdateMentorProfile={onUpdateMentorProfile} 
                    onLogout={onLogout} 
                    onUpdateAvatar={onUpdateAvatar} 
                    onSessionUpdate={onSessionUpdate}
                    transactions={transactions}
                  />
                ) : (
                  <YouthProfile 
                    session={session} 
                    onCatalogClick={() => { setActiveTab(AppTab.CATALOG); }} 
                    onLogout={onLogout} 
                    onUpdateAvatar={onUpdateAvatar} 
                    onSessionUpdate={onSessionUpdate} 
                    onSaveProfile={onSaveProfile} 
                    isSavingProfile={isSavingProfile} 
                  />
                )}
              </div>
            )}

            {activeTab === AppTab.SERVICES && isEnt && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.02] p-10 md:p-16 rounded-[64px] border border-white/5 relative overflow-hidden group shadow-3xl">
                  <div className={`absolute inset-0 bg-gradient-to-r from-${accentColor}-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                  <div className="space-y-6 relative z-10 text-center md:text-left mb-8 md:mb-0">
                    <div className={`flex items-center justify-center md:justify-start gap-4 text-${accentColor}-500 mb-2`}>
                      <LayoutGrid className="w-6 h-6" />
                      <span className="font-black text-[11px] uppercase tracking-[0.6em]">System Management</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter leading-none">МОИ ШАГИ</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-md">Ваше личное пространство для создания и масштабирования экспертизы.</p>
                  </div>
                  <div className="relative z-10 scale-125 md:scale-[2] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-[2.2] flex items-center justify-center">
                    <ShagLogo className="w-24 h-24 md:w-32 md:h-32" />
                  </div>
                </div>
                <div className="pt-8">
                  <ServiceBuilder 
                    services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId).toLowerCase() === String(session.email).toLowerCase())} 
                    onSave={onSaveService} 
                    onUpdate={onUpdateService} 
                    onDelete={onDeleteService} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-3xl border-t border-white/5 z-[100] flex md:hidden items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-full ${isActive ? `text-${accentColor}-400` : 'text-slate-500'}`}
            >
              <div className={`relative ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}>
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-${accentColor}-500 animate-ping`} />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showBooking && activeMentor && (
        <BookingModal 
          mentor={activeMentor} 
          service={selectedService || undefined} 
          bookings={localBookings} 
          session={session} // Передаем сессию
          existingBooking={pendingPaymentBooking || undefined}
          onClose={() => { setShowBooking(false); setSelectedService(null); setPendingPaymentBooking(null); }} 
          onComplete={async (data) => {
            if (onRefresh) onRefresh();
            setShowBooking(false);
          }} 
        />
      )}
    </div>
  );
};
