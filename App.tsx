
import React, { useState, useEffect } from 'react';
import { RegistrationFlow } from './components/RegistrationFlow';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ValueProposition } from './components/ValueProposition';
import { MENTORS as STATIC_MENTORS } from './constants';
import { Mentor, UserRole, UserSession, Service, Booking } from './types';
import { Loader2, ArrowRight, Star, Zap, Briefcase, Target, ShieldCheck } from 'lucide-react';
import { dbService } from './services/databaseService';

export const ShagLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-2xl transition-all duration-700 hover:scale-110 border border-white/10 ring-1 ring-black/5`}>
    <img 
      src="https://s5.iimage.su/s/31/uv0IjJ5xebbusdBYYqUNqgb4tdvIRyDzPFzSVr00.jpg" 
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [regStep, setRegStep] = useState(1); 
  const [dynamicMentors, setDynamicMentors] = useState<Mentor[]>([]);
  const [allMentors, setAllMentors] = useState<Mentor[]>(STATIC_MENTORS);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [showWelcomeValue, setShowWelcomeValue] = useState(false);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);

  const [regData, setRegData] = useState<any>({
    name: '', email: '', password: '', city: '',
    companyName: '', turnover: '', direction: '', qualities: '', requestToYouth: '', videoUrl: '', 
    birthDate: '', phone: '', focusGoal: '', expectations: '', mutualHelp: '',
    timeLimit: '', slots: {}, paymentUrl: '', singlePrice: 1500, groupPrice: 800
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (session?.isLoggedIn) {
      syncUserData(session.email);
    } else {
      loadGlobalData();
    }
  }, [session?.isLoggedIn]);

  useEffect(() => {
    setAllMentors([...STATIC_MENTORS, ...dynamicMentors]);
    if (session?.role === UserRole.ENTREPRENEUR) {
      const myProfile = dynamicMentors.find(m => String(m.ownerEmail).toLowerCase() === String(session.email).toLowerCase());
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
        setServices(data.services || []);
        setBookings(data.bookings || []);
      }
    } catch (e) { console.warn('Global load failed'); }
  };

  const syncUserData = async (email: string) => {
    try {
      const data = await dbService.syncData(email);
      if (data.result === 'success') {
        setDynamicMentors(data.dynamicMentors || []);
        setServices(data.services || []);
        setBookings(data.bookings || []);
        if (data.user && session) {
          const updatedSession = { ...session, ...data.user, isLoggedIn: true };
          setSession(updatedSession);
          localStorage.setItem('shag_session', JSON.stringify(updatedSession));
        }
      }
    } catch (e) { console.warn('Sync failed'); }
  };

  const handleSaveProfile = async () => {
    if (!session) return;
    setIsSavingProfile(true);
    try {
      const updates: any = { ...session };
      if (mentorProfile) {
        updates.slots = mentorProfile.slots;
      }
      await dbService.updateProfile(session.email, updates);
      await syncUserData(session.email);
    } catch (e) {
      alert('Ошибка при сохранении профиля');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!session) return;
    try {
      await dbService.updateAvatar(session.email, url);
      setSession({ ...session, paymentUrl: url });
      localStorage.setItem('shag_session', JSON.stringify({ ...session, paymentUrl: url }));
    } catch (e) { alert('Ошибка загрузки фото'); }
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    if (!session) return;
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      mentorId: session.id || session.email,
      mentorName: session.name,
      ...serviceData
    } as Service;
    try {
      await dbService.saveService(newService);
      setServices([...services, newService]);
    } catch (e) { alert('Ошибка сохранения услуги'); }
  };

  const handleUpdateService = async (id: string, updates: Partial<Service>) => {
    try {
      await dbService.updateService(id, updates);
      setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (e) { alert('Ошибка обновления услуги'); }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Удалить эту услугу?")) return;
    try {
      await dbService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (e) { alert('Ошибка удаления'); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      if (loginEmail === 'admin' && loginPassword === 'admin123') {
        const adminSess: UserSession = { id: 'admin_root', name: 'Administrator', email: 'admin', role: UserRole.ADMIN, isLoggedIn: true };
        setSession(adminSess);
        localStorage.setItem('shag_session', JSON.stringify(adminSess));
        setAuthMode(null);
        return;
      }
      const userData = await dbService.login({ email: loginEmail, password: loginPassword });
      const sess = { ...userData, isLoggedIn: true } as UserSession;
      setSession(sess);
      localStorage.setItem('shag_session', JSON.stringify(sess));
      syncUserData(loginEmail);
      setAuthMode(null);
    } catch (e: any) {
      alert(e.message || 'Ошибка входа');
    } finally { setIsAuthLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 3) { setRegStep(regStep + 1); return; }
    setIsAuthLoading(true);
    const newUser = { id: Math.random().toString(36).substr(2, 9), role: tempRole, isVerified: true, ...regData, slots: JSON.stringify(regData.slots), createdAt: new Date().toISOString() };
    try {
      await dbService.register(newUser);
      const sess = { ...newUser, isLoggedIn: true } as UserSession;
      setSession(sess);
      localStorage.setItem('shag_session', JSON.stringify(sess));
      setAuthMode(null);
      setShowWelcomeValue(true);
    } catch (e) { 
      setSession({ ...newUser, isLoggedIn: true } as UserSession);
      setAuthMode(null);
      setShowWelcomeValue(true);
    } finally { setIsAuthLoading(false); }
  };

  const logout = () => { setSession(null); localStorage.removeItem('shag_session'); window.location.reload(); };

  if (session?.role === UserRole.ADMIN) return <AdminPanel onLogout={logout} />;
  if (showWelcomeValue) return <ValueProposition onStart={() => setShowWelcomeValue(false)} />;

  if (!session && !authMode) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
        <div className="absolute inset-0 opacity-20 transition-transform duration-300 ease-out pointer-events-none" style={{ transform: `translate(${(mousePos.x - window.innerWidth/2) * 0.05}px, ${(mousePos.y - window.innerHeight/2) * 0.05}px)` }}>
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-indigo-600 blur-[150px] rounded-full mix-blend-screen opacity-20" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="relative z-10 w-full max-w-6xl space-y-20 flex flex-col items-center">
          <header className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
             <div className="space-y-4 pt-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                   <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                   <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Эксклюзивная сеть наставничества</span>
                </div>
                <h1 className="text-7xl md:text-[8rem] font-black text-white tracking-tighter leading-none uppercase font-syne">Сделай свой <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">ШАГ</span></h1>
                <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">Платформа, где опыт предпринимателей трансформируется в энергию твоего роста.</p>
             </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setRegStep(1); setAuthMode('register'); }} className="group relative bg-white/[0.02] border border-white/10 p-12 rounded-[48px] cursor-pointer transition-all hover:border-indigo-500/50">
              <div className="relative z-10 space-y-12"><div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white"><Zap className="w-8 h-8" /></div><div className="space-y-4"><h3 className="text-4xl font-black text-white uppercase font-syne">Стать Ментором</h3><p className="text-slate-400 text-lg leading-relaxed font-medium">Для предпринимателей, готовых делиться мудростью.</p></div><div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Начать путь <ArrowRight className="w-4 h-4" /></div></div>
            </div>
            <div onClick={() => { setTempRole(UserRole.YOUTH); setRegStep(1); setAuthMode('register'); }} className="group relative bg-white/[0.02] border border-white/10 p-12 rounded-[48px] cursor-pointer transition-all hover:border-violet-500/50">
              <div className="relative z-10 space-y-12"><div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center text-white"><Star className="w-8 h-8" /></div><div className="space-y-4"><h3 className="text-4xl font-black text-white uppercase font-syne">Найти наставника</h3><p className="text-slate-400 text-lg leading-relaxed font-medium">Для молодых талантов, ищущих твердую опору.</p></div><div className="flex items-center gap-3 text-violet-400 font-black text-[10px] uppercase tracking-[0.3em]">Сделать шаг <ArrowRight className="w-4 h-4" /></div></div>
            </div>
          </div>
          <footer className="pt-10 flex flex-col items-center gap-8"><button onClick={() => setAuthMode('login')} className="text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.5em] py-4 px-10 rounded-full border border-white/5 hover:bg-white/5">Уже есть аккаунт? <span className="text-white">Войти</span></button></footer>
        </div>
      </div>
    );
  }

  if (authMode === 'register') return <RegistrationFlow tempRole={tempRole} regStep={regStep} setRegStep={setRegStep} regData={regData} setRegData={setRegData} isAuthLoading={isAuthLoading} onCancel={() => setAuthMode(null)} onSubmit={handleRegister} />;
  
  if (authMode === 'login') return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#0a0a0b] border border-white/10 p-12 rounded-[48px] space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white uppercase font-syne">Вход</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white font-bold outline-none" />
          <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white font-bold outline-none" />
          <button disabled={isAuthLoading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest">{isAuthLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Войти'}</button>
        </form>
        <button onClick={() => setAuthMode(null)} className="w-full text-slate-500 hover:text-white font-bold text-[10px] uppercase">Назад</button>
      </div>
    </div>
  );

  if (session) return (
    <MainDashboard 
      session={session} allMentors={allMentors} services={services}
      bookings={bookings}
      mentorProfile={mentorProfile} onLogout={logout}
      onUpdateMentorProfile={setMentorProfile} onSaveProfile={handleSaveProfile}
      onSaveService={handleSaveService} onUpdateService={handleUpdateService}
      onDeleteService={handleDeleteService} onUpdateAvatar={handleUpdateAvatar}
      onSessionUpdate={setSession} isSavingProfile={isSavingProfile}
    />
  );
  return null;
};

export default App;
