
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
import { ShieldCheck } from 'lucide-react';
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

  const handleServiceClick = (service: Service) => {
    const mentor = allMentors.find(m => 
      String(m.id) === String(service.mentorId) || 
      String(m.email).toLowerCase() === String(service.mentorId).toLowerCase()
    );

    if (mentor) {
      setActiveMentor(mentor);
      setSelectedService(service);
      setPendingPaymentBooking(null);
      setShowBooking(true);
    } else {
      const fallbackMentor: any = {
        id: service.mentorId,
        email: service.mentorId,
        name: service.mentorName || 'Ментор ШАГ',
        role: UserRole.ENTREPRENEUR,
        status: 'active',
        isLoggedIn: false,
        industry: service.category || 'Бизнес',
        description: 'Опытный предприниматель сообщества ШАГ.',
        avatarUrl: service.imageUrl || '',
        singlePrice: service.price,
        groupPrice: service.groupPrice || 0
      };
      setActiveMentor(fallbackMentor);
      setSelectedService(service);
      setPendingPaymentBooking(null);
      setShowBooking(true);
    }
  };

  const handlePayFromList = (booking: Booking) => {
    const mentor = allMentors.find(m => 
      String(m.id) === String(booking.mentorId) || 
      String(m.email).toLowerCase() === String(booking.mentorId).toLowerCase()
    );
    if (mentor) {
      setActiveMentor(mentor);
      setPendingPaymentBooking(booking);
      setShowBooking(true);
    }
  };

  const isEnt = session.role === UserRole.ENTREPRENEUR;
  const isAdmin = session.role === UserRole.ADMIN || session.email === 'admin';

  return (
    <div className="min-h-screen bg-[#1a1d23] text-white flex flex-col font-['Inter'] relative overflow-x-hidden">
      
      <div className="fixed top-6 right-6 z-[100] hidden md:flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
         <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Защищенный Root Протокол</span>
         </div>
      </div>
      
      <div className="flex flex-1 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} session={session} onLogout={onLogout} />

        <main className={`flex-1 transition-all duration-700 relative z-10 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'} pb-32 md:pb-12`}>
          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 pt-10 md:pt-20 min-h-screen flex flex-col">
            
            <div className="flex-1">
              {activeTab === AppTab.CATALOG && <CatalogView services={services} mentors={allMentors} bookings={localBookings} onServiceClick={handleServiceClick} />}
              {activeTab === AppTab.JOBS && <JobsView jobs={jobs} session={session} onSaveJob={onSaveJob} onDeleteJob={onDeleteJob} />}
              {activeTab === AppTab.MEETINGS && <MeetingsListView bookings={localBookings} session={session} onPay={handlePayFromList} onRefresh={onRefresh} />}
              {activeTab === AppTab.MISSION && <MissionView />}
              {activeTab === AppTab.ADMIN && isAdmin && <AdminPanel onLogout={onLogout} session={session} />}
              {activeTab === AppTab.PROFILE && (isAdmin || isEnt ? <EntrepreneurProfile session={session} mentorProfile={mentorProfile} isSavingProfile={isSavingProfile} onSaveProfile={() => onSaveProfile()} onUpdateMentorProfile={onUpdateMentorProfile} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} transactions={transactions} bookings={localBookings} services={services} jobs={jobs} /> : <YouthProfile session={session} onCatalogClick={() => setActiveTab(AppTab.CATALOG)} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate} onSaveProfile={() => onSaveProfile()} isSavingProfile={isSavingProfile} bookings={localBookings} />)}
              {activeTab === AppTab.SERVICES && (isEnt || isAdmin) && (
                <div className="space-y-12">
                  <ShowcaseBanner imageUrl={session.paymentUrl || mentorProfile?.avatarUrl} />
                  <ServiceBuilder services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId).toLowerCase() === String(session.email).toLowerCase())} onSave={onSaveService} onUpdate={onUpdateService} onDelete={onDeleteService} />
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-24 hidden md:block">
              <Footer />
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={session.role} />

      {showPlanner && (isEnt || isAdmin) && <ResourcePlannerModal session={session} mentorProfile={mentorProfile} onSaveProfile={onSaveProfile} onClose={() => setShowPlanner(false)} />}
      {showBooking && activeMentor && <BookingModal mentor={activeMentor} service={selectedService || undefined} bookings={localBookings} session={session} existingBooking={pendingPaymentBooking || undefined} onClose={() => { setShowBooking(false); setSelectedService(null); setPendingPaymentBooking(null); }} onComplete={() => { if (onRefresh) onRefresh(); setShowBooking(false); }} />}
    </div>
  );
};
