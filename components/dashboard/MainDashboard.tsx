
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
import { MobileNav } from './MobileNav';
import { ShowcaseBanner } from './ShowcaseBanner';
import { AppTab, UserRole, UserSession, Mentor, Service, Booking, Job, Transaction } from '../../types';
import { ShagLogo } from '../../App';
import { Activity, Target } from 'lucide-react';
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
              <div className="mb-8 md:mb-20">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    <div className="col-span-2 md:col-span-1 bg-white/[0.05] border border-white/20 p-4 md:p-8 rounded-tl-[32px] md:rounded-tl-[40px] rounded-br-[32px] md:rounded-br-[40px] backdrop-blur-3xl flex items-center gap-4 md:gap-6 group hover:bg-white/[0.08] transition-all">
                       <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          <Activity size={20} className="md:w-6 md:h-6" />
                       </div>
                       <div>
                          <p className="text-[7px] md:text-[9px] font-black text-white/60 uppercase tracking-[0.4em] mb-0.5 md:mb-1">ПУЛЬС_ПЛАТФОРМЫ</p>
                          <h4 className="text-sm md:text-xl font-black font-syne uppercase text-white leading-none">Энергообмен</h4>
                       </div>
                    </div>
                    
                    <div className="bg-white/[0.03] border border-white/10 p-4 md:p-8 rounded-tl-[16px] md:rounded-tl-[24px] rounded-br-[16px] md:rounded-br-[24px] flex flex-col justify-center">
                       <p className="text-[7px] md:text-[9px] font-black text-white/60 uppercase tracking-widest mb-1 leading-none">Событий</p>
                       <p className="text-xl md:text-3xl font-black font-syne text-white tracking-tighter">{totalMeetingsCount}</p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 p-4 md:p-8 rounded-tr-[16px] md:rounded-tr-[24px] rounded-bl-[16px] md:rounded-bl-[24px] flex flex-col justify-center">
                       <p className="text-[7px] md:text-[9px] font-black text-white/60 uppercase tracking-widest mb-1 leading-none">Вклад</p>
                       <p className="text-xl md:text-3xl font-black font-syne text-white tracking-tighter">{totalGlobalImpact.toLocaleString()} ₽</p>
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
                <div className="space-y-8 md:space-y-12">
                  {/* Fixed Property 'avatarUrl' does not exist on type 'UserSession' by using mentorProfile?.avatarUrl which has the property */}
                  <ShowcaseBanner imageUrl={session.paymentUrl || mentorProfile?.avatarUrl} />
                  <ServiceBuilder services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId).toLowerCase() === String(session.email).toLowerCase())} onSave={onSaveService} onUpdate={onUpdateService} onDelete={onDeleteService} />
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-16">
              <Footer />
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={session.role} />

      {showPlanner && isEnt && <ResourcePlannerModal session={session} mentorProfile={mentorProfile} onSaveProfile={onSaveProfile} onClose={() => setShowPlanner(false)} />}
      {showBooking && activeMentor && <BookingModal mentor={activeMentor} service={selectedService || undefined} bookings={localBookings} session={session} existingBooking={pendingPaymentBooking || undefined} onClose={() => { setShowBooking(false); setSelectedService(null); setPendingPaymentBooking(null); }} onComplete={() => { if (onRefresh) onRefresh(); setShowBooking(false); }} />}
    </div>
  );
};
