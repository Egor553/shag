
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CatalogView } from './CatalogView';
import { EntrepreneurProfile } from '../profiles/EntrepreneurProfile';
import { YouthProfile } from '../profiles/YouthProfile';
import { ServiceBuilder } from '../ServiceBuilder';
import { BookingModal } from '../BookingModal';
import { AppTab, UserRole, UserSession, Mentor, Service, Booking } from '../../types';
import { Calendar as CalendarIcon, Users, LayoutGrid, UserCircle, ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { dbService } from '../../services/databaseService';
import { ShagLogo } from '../../App';

interface MainDashboardProps {
  session: UserSession;
  allMentors: Mentor[];
  services: Service[];
  bookings: Booking[];
  mentorProfile: Mentor | null;
  onLogout: () => void;
  onUpdateMentorProfile: (profile: Mentor) => void;
  onSaveProfile: () => void;
  onSaveService: (s: Partial<Service>) => Promise<void>;
  onUpdateService: (id: string, updates: Partial<Service>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onUpdateAvatar: (url: string) => Promise<void>;
  onSessionUpdate: (session: UserSession) => void;
  isSavingProfile: boolean;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  session,
  allMentors,
  services,
  bookings,
  mentorProfile,
  onLogout,
  onUpdateMentorProfile,
  onSaveProfile,
  onSaveService,
  onUpdateService,
  onDeleteService,
  onUpdateAvatar,
  onSessionUpdate,
  isSavingProfile
}) => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CATALOG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [viewState, setViewState] = useState<'catalog' | 'mentor-details'>('catalog');

  const handleServiceClick = (service: Service) => {
    const mentor = allMentors.find(m => String(m.id) === String(service.mentorId) || String(m.ownerEmail) === String(service.mentorId));
    if (mentor) {
      setActiveMentor(mentor);
      setSelectedService(service);
      setShowBooking(true);
    } else {
      alert("Информация о менторе временно недоступна");
    }
  };

  const isEnt = session.role === UserRole.ENTREPRENEUR;
  const accentColor = isEnt ? 'indigo' : 'violet';

  const mobileNavItems = [
    { id: AppTab.CATALOG, icon: Users, label: 'Услуги' },
    ...(isEnt ? [{ id: AppTab.SERVICES, icon: LayoutGrid, label: 'Кабинет' }] : []),
    { id: AppTab.MEETINGS, icon: CalendarIcon, label: 'Встречи' },
    { id: AppTab.PROFILE, icon: UserCircle, label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex font-['Inter'] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-${accentColor}-900/10 blur-[120px] rounded-full`} />
      </div>
      
      <Sidebar 
        activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setViewState('catalog'); }}
        isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        session={session} onLogout={onLogout}
      />

      <main className={`flex-1 transition-all duration-500 relative z-10 w-full min-w-0 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-28'}`}>
        <div className="px-5 md:px-16 pt-8 pb-32 md:py-24 max-w-7xl mx-auto">
          
          {activeTab === AppTab.CATALOG && (
            <CatalogView 
              services={services} 
              mentors={allMentors}
              onServiceClick={handleServiceClick} 
            />
          )}

          {activeTab === AppTab.PROFILE && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {isEnt ? (
                <EntrepreneurProfile 
                  session={session} mentorProfile={mentorProfile} 
                  isSavingProfile={isSavingProfile} onSaveProfile={onSaveProfile} 
                  onUpdateMentorProfile={onUpdateMentorProfile} onLogout={onLogout} 
                  onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate}
                />
              ) : (
                <YouthProfile 
                  session={session} onCatalogClick={() => { setActiveTab(AppTab.CATALOG); setViewState('catalog'); }} 
                  onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onSessionUpdate={onSessionUpdate}
                  onSaveProfile={onSaveProfile} isSavingProfile={isSavingProfile}
                />
              )}
            </div>
          )}

          {activeTab === AppTab.SERVICES && isEnt && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.02] p-10 md:p-16 rounded-[64px] border border-white/5 relative overflow-hidden group shadow-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="space-y-6 relative z-10 text-center md:text-left mb-8 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start gap-4 text-indigo-500 mb-2">
                    <LayoutGrid className="w-6 h-6" />
                    <span className="font-black text-[11px] uppercase tracking-[0.6em]">System Management</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter leading-none">МОИ ШАГИ</h2>
                  <p className="text-slate-400 text-lg font-medium max-w-md">Ваше личное пространство для создания и масштабирования экспертизы.</p>
                </div>
                <div className="relative z-10 scale-125 md:scale-[2.2] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-[2.4] flex items-center justify-center">
                  <ShagLogo className="w-24 h-24 md:w-32 md:h-32" />
                </div>
              </div>
              <div className="pt-8">
                <ServiceBuilder 
                  services={services.filter(s => String(s.mentorId) === String(session.id) || String(s.mentorId) === String(session.email))} 
                  onSave={onSaveService} 
                  onUpdate={onUpdateService}
                  onDelete={onDeleteService} 
                />
              </div>
            </div>
          )}

          {activeTab === AppTab.MEETINGS && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.03] border border-white/5 rounded-[40px] backdrop-blur-3xl">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400"><CalendarIcon className="w-8 h-8" /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase font-syne">График ШАГов</h3>
                <p className="text-slate-500 text-sm max-w-[240px] mx-auto">Здесь будут отображаться ваши забронированные встречи.</p>
              </div>
              <button onClick={() => { setActiveTab(AppTab.CATALOG); setViewState('catalog'); }} className="bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest">В галерею</button>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-2xl border-t border-white/5 z-[100] flex md:hidden items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setViewState('catalog'); }} className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-full ${isActive ? `text-${accentColor}-400` : 'text-slate-500'}`}>
              <item.icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`} />
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
              {isActive && <div className={`absolute bottom-2 w-1 h-1 rounded-full bg-${accentColor}-400`} />}
            </button>
          );
        })}
      </nav>

      {showBooking && activeMentor && selectedService && (
        <BookingModal 
          mentor={activeMentor} 
          service={selectedService}
          bookings={bookings}
          onClose={() => { setShowBooking(false); setSelectedService(null); }} 
          onComplete={async (data) => {
            await dbService.createBooking({ 
              ...data, 
              userEmail: session.email, 
              userName: session.name,
              serviceId: selectedService.id,
              serviceTitle: selectedService.title
            });
            setShowBooking(false);
            setSelectedService(null);
          }} 
        />
      )}
    </div>
  );
};
