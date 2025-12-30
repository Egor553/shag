
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MentorCard } from './components/MentorCard';
import { BookingModal } from './components/BookingModal';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ServiceBuilder } from './components/ServiceBuilder';
import { ServiceCard } from './components/ServiceCard';
import { EntrepreneurProfile } from './components/profiles/EntrepreneurProfile';
import { YouthProfile } from './components/profiles/YouthProfile';
import { AdminPanel } from './components/AdminPanel';
import { MENTORS as STATIC_MENTORS } from './constants';
import { Mentor, UserRole, AppTab, UserSession, Booking, Service, MeetingFormat } from './types';
import { 
  Users, Calendar as CalendarIcon, Zap, UserCheck, 
  UserCircle, LogOut, 
  Menu, Loader2,
  Sparkles, Search,
  Check, Briefcase,
  MapPin, Mail, Layers, Phone,
  Target, Key, ArrowRight, ShieldAlert
} from 'lucide-react';
import { dbService } from './services/databaseService';

export const ShagLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100`}>
    <img 
      src="https://s5.iimage.su/s/30/u8HHuUHxW8qCqb824zLWEoj8CDt08FcuIaoM59wf.jpg" 
      alt="ШАГ Лого" 
      className="w-full h-full object-cover"
    />
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('shag_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CATALOG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [regStep, setRegStep] = useState(0); 
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [dynamicMentors, setDynamicMentors] = useState<Mentor[]>([]);
  const [allMentors, setAllMentors] = useState<Mentor[]>(STATIC_MENTORS);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const [regData, setRegData] = useState<any>({
    name: '', email: '', password: '', city: '',
    companyName: '', turnover: '', direction: '', qualities: '', requestToYouth: '', videoUrl: '', 
    birthDate: '', phone: '', focusGoal: '', expectations: '', mutualHelp: '',
    timeLimit: '', slots: {}, paymentUrl: '', singlePrice: 1500, groupPrice: 800
  });

  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);

  useEffect(() => {
    if (session?.isLoggedIn && session.role !== UserRole.ADMIN) {
      syncUserData(session.email);
    } else if (!session) {
      loadGlobalData();
    }
  }, [session?.isLoggedIn]);

  useEffect(() => {
    setAllMentors([...STATIC_MENTORS, ...dynamicMentors]);
    if (session?.role === UserRole.ENTREPRENEUR) {
      const myProfile = dynamicMentors.find(m => m.ownerEmail === session.email);
      if (myProfile) {
        setMentorProfile({
          ...myProfile,
          slots: typeof myProfile.slots === 'string' ? myProfile.slots : JSON.stringify(myProfile.slots || {})
        });
      }
    }
  }, [dynamicMentors, session?.email]);

  const loadGlobalData = async () => {
    try {
      const data = await dbService.syncData();
      if (data.result === 'success') {
        setDynamicMentors(data.dynamicMentors || []);
        if (data.services) setServices(data.services);
      }
    } catch (e) { console.warn('Global load failed'); }
  };

  const syncUserData = async (email: string) => {
    try {
      const data = await dbService.syncData(email);
      if (data.result === 'success') {
        setDynamicMentors(data.dynamicMentors || []);
        if (data.bookings) setBookings(data.bookings);
        if (data.services) setServices(data.services);
        if (data.user && session) {
          const updatedSession = { ...session, ...data.user, isLoggedIn: true };
          setSession(updatedSession);
          localStorage.setItem('shag_session', JSON.stringify(updatedSession));
        }
      }
    } catch (e) { console.warn('Sync failed'); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    // Hardcoded Admin check
    if (loginEmail === 'admin' && loginPassword === 'admin123') {
      const adminSess: UserSession = {
        id: 'admin_root',
        name: 'Administrator',
        email: 'admin',
        role: UserRole.ADMIN,
        isLoggedIn: true
      };
      setSession(adminSess);
      localStorage.setItem('shag_session', JSON.stringify(adminSess));
      setAuthMode(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const userData = await dbService.login({ email: loginEmail, password: loginPassword });
      const sess = { ...userData, isLoggedIn: true } as UserSession;
      setSession(sess);
      localStorage.setItem('shag_session', JSON.stringify(sess));
      setAuthMode(null);
      syncUserData(loginEmail);
    } catch (e: any) {
      alert(e.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!session) return;
    const updatedSession = { ...session, paymentUrl: url };
    setSession(updatedSession);
    localStorage.setItem('shag_session', JSON.stringify(updatedSession));
    if (mentorProfile) setMentorProfile({ ...mentorProfile, avatarUrl: url });
    await dbService.updateAvatar(session.email, url);
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    if (!session) return;
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      mentorId: session.id,
      mentorName: session.name,
      title: serviceData.title || '',
      description: serviceData.description || '',
      price: serviceData.price || 1500,
      format: serviceData.format || MeetingFormat.ONLINE_1_ON_1,
      duration: serviceData.duration || '60 мин',
      category: serviceData.category || 'Консультация'
    };
    setServices([...services, newService]);
    await dbService.saveService(newService);
    loadGlobalData();
  };

  const handleDeleteService = async (id: string) => {
    setServices(services.filter(s => s.id !== id));
    await dbService.deleteService(id);
    loadGlobalData();
  };

  const handleSaveMentorProfile = async () => {
    if (!mentorProfile || !session) return;
    setIsSavingProfile(true);
    try {
      await dbService.saveMentorProfile(mentorProfile, session.email);
      alert('Профиль успешно обновлен!');
      syncUserData(session.email);
    } catch (e) {
      alert('Ошибка при сохранении профиля');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCreateBooking = async (data: any) => {
    if (!session) {
      setAuthMode('login');
      return;
    }
    const booking = {
      ...data,
      userEmail: session.email,
      userName: session.name,
      status: 'pending',
      id: Math.random().toString(36).substr(2, 9),
    };
    await dbService.createBooking(booking);
    syncUserData(session.email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 3) {
      setRegStep(regStep + 1);
      return;
    }
    setIsAuthLoading(true);
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      role: tempRole,
      isVerified: true, 
      ...regData,
      slots: JSON.stringify(regData.slots),
      createdAt: new Date().toISOString()
    };
    try {
      await dbService.register(newUser);
      const sess = { ...newUser, isLoggedIn: true } as UserSession;
      setSession(sess);
      localStorage.setItem('shag_session', JSON.stringify(sess));
      setAuthMode(null);
      loadGlobalData();
    } catch (e) { 
      const sess = { ...newUser, isLoggedIn: true } as UserSession;
      setSession(sess); 
      localStorage.setItem('shag_session', JSON.stringify(sess));
      setAuthMode(null);
    } finally { setIsAuthLoading(false); }
  };

  const logout = () => { setSession(null); localStorage.removeItem('shag_session'); window.location.reload(); };

  if (session?.role === UserRole.ADMIN) {
    return <AdminPanel onLogout={logout} />;
  }

  const Sidebar = () => (
    <aside className={`fixed left-0 top-0 h-full bg-[#0a0a0b] border-r border-white/5 transition-all duration-500 z-[70] hidden md:block ${isSidebarOpen ? 'w-72' : 'w-28'}`}>
      <div className="p-8 flex items-center justify-between mb-12">
        <div className={`flex items-center gap-4 ${!isSidebarOpen && 'hidden'}`}>
          <ShagLogo className="w-14 h-14" />
          <span className="text-2xl font-black text-white tracking-tighter text-nowrap">ШАГ</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-2xl mx-auto">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="px-5 space-y-4">
        {[
          { id: AppTab.CATALOG, label: 'Каталог', icon: Users },
          ...(session?.role === UserRole.ENTREPRENEUR ? [{ id: AppTab.SERVICES, label: 'Мои услуги', icon: Layers }] : []),
          { id: AppTab.MEETINGS, label: 'Встречи', icon: CalendarIcon },
          { id: AppTab.PROFILE, label: 'Профиль', icon: UserCircle },
        ].map((item) => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); }}
            className={`w-full flex items-center gap-5 p-4 rounded-[24px] transition-all duration-300 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5'}`}>
            <item.icon className={`w-6 h-6 shrink-0 ${activeTab === item.id ? 'text-white' : 'group-hover:text-indigo-400'}`} />
            {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>
      {session && (
        <div className="absolute bottom-12 left-0 w-full px-5">
          <button onClick={logout} className="w-full flex items-center gap-5 p-4 text-slate-500 hover:text-red-400 transition-all font-bold text-sm group">
            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span>Выход</span>}
          </button>
        </div>
      )}
    </aside>
  );

  if (authMode === 'login') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-violet-900/20" />
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-12 rounded-[56px] backdrop-blur-xl shadow-3xl space-y-10 relative z-10 animate-in zoom-in-95">
          <div className="text-center space-y-4">
            <div className="flex justify-center"><ShagLogo className="w-20 h-20" /></div>
            <h2 className="text-4xl font-black text-white tracking-tight">Вход в ШАГ</h2>
            <p className="text-slate-500 font-medium text-sm">Введите данные для доступа к кабинету</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email / Логин" className="w-full bg-white/5 border-2 border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 transition-all" />
              </div>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Пароль" className="w-full bg-white/5 border-2 border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 transition-all" />
              </div>
            </div>
            <button disabled={isAuthLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center">
              {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Войти в аккаунт'}
            </button>
          </form>
          <div className="text-center pt-4">
            <button onClick={() => setAuthMode(null)} className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest">Вернуться назад</button>
          </div>
        </div>
      </div>
    );
  }

  if (authMode === 'register') {
    return (
      <RegistrationFlow 
        tempRole={tempRole}
        regStep={regStep}
        setRegStep={setRegStep}
        regData={regData}
        setRegData={setRegData}
        isAuthLoading={isAuthLoading}
        onCancel={() => setAuthMode(null)}
        onSubmit={handleRegister}
      />
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full" />
        <div className="relative z-10 text-center mb-16 space-y-8 animate-in zoom-in duration-1000">
          <div className="flex justify-center"><ShagLogo className="w-36 h-36" /></div>
          <div className="space-y-4">
            <h1 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter leading-none mb-2">ШАГ</h1>
            <p className="text-slate-500 text-2xl md:text-3xl font-medium max-w-2xl mx-auto">Платформа наставничества и энергообмена.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full z-10">
          <button onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setRegStep(0); setAuthMode('register'); }} className="bg-white/5 border border-white/10 p-12 rounded-[56px] text-left hover:bg-white/10 transition-all shadow-2xl group relative overflow-hidden">
            <Briefcase className="w-12 h-12 text-indigo-500 mb-8" />
            <h3 className="text-3xl font-black text-white mb-2">Предприниматель</h3>
            <p className="text-slate-500">Стань наставником и начни передавать опыт.</p>
          </button>
          <button onClick={() => { setTempRole(UserRole.YOUTH); setRegStep(0); setAuthMode('register'); }} className="bg-white/5 border border-white/10 p-12 rounded-[56px] text-left hover:bg-white/10 transition-all shadow-2xl group relative overflow-hidden">
            <Target className="w-12 h-12 text-violet-500 mb-8" />
            <h3 className="text-3xl font-black text-white mb-2">Молодой Талант</h3>
            <p className="text-slate-500">Найди своего ментора и сделай свой ШАГ.</p>
          </button>
        </div>
        <div className="z-10 mt-12 flex items-center gap-6">
          <button onClick={() => setAuthMode('login')} className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-[0.3em] hover:text-indigo-400 transition-colors">
            Уже есть аккаунт? Войти <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row">
      <Sidebar />
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-28'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-24">
          {activeTab === AppTab.CATALOG ? (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative">
                <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-[2px] w-12 bg-indigo-600"></div>
                      <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Маркетплейс опыта</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-6">ШАГ-Услуги</h1>
                    <p className="text-slate-500 text-2xl font-medium max-w-2xl leading-relaxed">Выбирай конкретную услугу и наставника для своего роста.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={(s) => { 
                      const m = allMentors.find(mt => mt.id === s.mentorId || mt.ownerEmail === s.mentorId);
                      setActiveMentor(m || null); 
                      setShowBooking(true); 
                    }} 
                  />
                ))}
                {services.length === 0 && allMentors.map(mentor => (
                  <MentorCard key={mentor.id} mentor={mentor} onClick={(m) => { setActiveMentor(m); setShowBooking(true); }} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeTab === AppTab.SERVICES && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><div className="h-[2px] w-12 bg-indigo-600"></div><span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Конструктор</span></div>
                    <h2 className="text-7xl font-black text-slate-900 tracking-tighter">Управление</h2>
                  </div>
                  <ServiceBuilder 
                    services={services.filter(s => s.mentorId === session.id || s.mentorId === session.email)} 
                    onSave={handleSaveService} 
                    onDelete={handleDeleteService} 
                  />
                </div>
              )}
              {activeTab === AppTab.PROFILE && (
                <div className="max-w-6xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><div className="h-[2px] w-12 bg-indigo-600"></div><span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Личный кабинет</span></div>
                    <h2 className="text-7xl font-black text-slate-900 tracking-tighter">Настройки</h2>
                  </div>
                  {session.role === UserRole.ENTREPRENEUR ? (
                    <EntrepreneurProfile 
                      session={session}
                      mentorProfile={mentorProfile}
                      isSavingProfile={isSavingProfile}
                      onSaveProfile={handleSaveMentorProfile}
                      onUpdateMentorProfile={setMentorProfile}
                      onLogout={logout}
                      onUpdateAvatar={handleUpdateAvatar}
                    />
                  ) : (
                    <YouthProfile 
                      session={session}
                      onCatalogClick={() => setActiveTab(AppTab.CATALOG)}
                      onLogout={logout}
                      onUpdateAvatar={handleUpdateAvatar}
                    />
                  )}
                </div>
              )}
              {activeTab === AppTab.MEETINGS && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><div className="h-[2px] w-12 bg-indigo-600"></div><span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Мои записи</span></div>
                    <h2 className="text-7xl font-black text-slate-900 tracking-tighter">Встречи</h2>
                  </div>
                  <div className="bg-white p-16 rounded-[64px] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
                    <CalendarIcon className="w-20 h-20 text-slate-200" />
                    <p className="text-slate-400 font-bold text-xl">У вас пока нет активных записей</p>
                    <button onClick={() => setActiveTab(AppTab.CATALOG)} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">В каталог услуг</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showBooking && activeMentor && <BookingModal mentor={activeMentor} onClose={() => setShowBooking(false)} onComplete={handleCreateBooking} />}
    </div>
  );
};

export default App;
