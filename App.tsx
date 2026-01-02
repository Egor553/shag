
import React, { useState, useEffect } from 'react';
import { UserRole, UserSession, Service, Job } from './types';
import { dbService } from './services/databaseService';
import { useShagData } from './hooks/useShagData';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { RegistrationFlow } from './components/RegistrationFlow';
import { Loader2, Star, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ShagLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-40 rounded-full animate-pulse" />
    <div className="relative w-full h-full bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl">
      Ш
    </div>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [regStep, setRegStep] = useState(1);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [regData, setRegData] = useState<any>({ 
    name: '', email: '', password: '', phone: '', city: '', direction: '',
    companyName: '', turnover: '', qualities: '', requestToYouth: '', 
    videoUrl: '', timeLimit: '', slots: {}, birthDate: '', focusGoal: '',
    expectations: '', mutualHelp: ''
  });
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Используем наш новый хук для всех операций с БД
  const { 
    allMentors, services, jobs, bookings, transactions, mentorProfile,
    syncUserData, saveService, deleteService, saveJob, deleteJob, updateProfile,
    setMentorProfile
  } = useShagData();

  useEffect(() => {
    const initApp = async () => {
      const saved = localStorage.getItem('shag_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSession(parsed);
        await syncUserData(parsed.email, parsed, setSession);
      }
      setIsAppLoading(false);
    };
    initApp();
  }, [syncUserData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setErrorMsg(null);
    try {
      if (loginEmail === 'admin' && loginPassword === 'admin123') {
        const adminSess = { id: 'admin-001', email: 'admin', name: 'Administrator', role: UserRole.ADMIN, isLoggedIn: true } as UserSession;
        setSession(adminSess);
        localStorage.setItem('shag_session', JSON.stringify(adminSess));
        await syncUserData('admin', adminSess, setSession);
        setAuthMode(null);
        return;
      }
      const userData = await dbService.login({ email: loginEmail, password: loginPassword });
      const sess = { ...userData, isLoggedIn: true } as UserSession;
      setSession(sess);
      localStorage.setItem('shag_session', JSON.stringify(sess));
      await syncUserData(loginEmail, sess, setSession);
      setAuthMode(null);
    } catch (e: any) { 
      setErrorMsg(e.message || 'Ошибка входа'); 
    } finally { 
      setIsAuthLoading(false); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 3) { setRegStep(regStep + 1); return; }
    setIsAuthLoading(true);
    const newUser = { id: Math.random().toString(36).substr(2, 9), role: tempRole, ...regData, slots: JSON.stringify(regData.slots), balance: 0 };
    try {
      const res = await dbService.register(newUser);
      if (res.result === 'success') {
        const sess = { ...newUser, isLoggedIn: true } as UserSession;
        setSession(sess);
        localStorage.setItem('shag_session', JSON.stringify(sess));
        await syncUserData(newUser.email, sess, setSession);
        setAuthMode(null);
      } else { 
        setErrorMsg(res.message); 
      }
    } catch (e) { 
      setErrorMsg('Ошибка регистрации'); 
    } finally { 
      setIsAuthLoading(false); 
    }
  };

  if (isAppLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
    </div>
  );

  if (session?.isLoggedIn) {
    return (
      <MainDashboard 
        session={session} 
        allMentors={allMentors} 
        services={services} 
        jobs={jobs} 
        bookings={bookings} 
        mentorProfile={mentorProfile}
        transactions={transactions}
        onLogout={() => { setSession(null); localStorage.removeItem('shag_session'); }}
        onUpdateMentorProfile={setMentorProfile}
        onSaveProfile={() => updateProfile(session.email, session)}
        onSaveService={(s) => saveService(s, session)}
        onUpdateService={(id, u) => saveService({ ...u, id }, session)}
        onDeleteService={(id) => deleteService(id, session.email)}
        onUpdateAvatar={async (u) => { 
          await dbService.updateAvatar(session.email, u); 
          setSession({...session, paymentUrl: u}); 
        }}
        onSessionUpdate={setSession}
        onRefresh={() => syncUserData(session.email, session, setSession)}
        isSavingProfile={false}
        onSaveJob={(j) => saveJob(j, session)}
        onDeleteJob={(id) => deleteJob(id, session.email)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
      {authMode === 'login' ? (
        <div className="w-full max-w-md bg-[#0a0a0b] border border-white/10 p-12 rounded-[48px] space-y-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">Вход</h2>
          </div>
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex gap-3 text-xs font-bold items-center">
              <AlertTriangle className="w-4 h-4 shrink-0"/>{errorMsg}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <input required type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 uppercase font-bold" />
            <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold" />
            <button disabled={isAuthLoading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
              {isAuthLoading ? <Loader2 className="animate-spin mx-auto w-5 h-5"/> : 'Войти'}
            </button>
          </form>
          
          <div className="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10 flex items-center gap-4 text-indigo-400">
             <ShieldCheck size={18} />
             <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Для входа в Root: admin / admin123
             </p>
          </div>

          <button onClick={() => setAuthMode(null)} className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors">Назад</button>
        </div>
      ) : authMode === 'register' ? (
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
      ) : (
        <div className="text-center space-y-20 animate-in fade-in zoom-in duration-1000">
           <h1 className="text-7xl md:text-[8rem] font-black text-white tracking-tighter uppercase font-syne leading-none">СДЕЛАЙ СВОЙ<br/><span className="text-indigo-600">ШАГ</span></h1>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <button onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setAuthMode('register'); setRegStep(1); }} className="group p-12 bg-white/5 border border-white/10 rounded-[48px] hover:border-indigo-600 transition-all text-left space-y-8">
                 <Zap className="text-indigo-600 w-10 h-10" />
                 <h3 className="text-3xl font-black text-white font-syne uppercase">МЕНТОР</h3>
                 <p className="text-slate-400 font-medium">Предприниматель, готовый делиться опытом</p>
              </button>
              <button onClick={() => { setTempRole(UserRole.YOUTH); setAuthMode('register'); setRegStep(1); }} className="group p-12 bg-white/5 border border-white/10 rounded-[48px] hover:border-violet-600 transition-all text-left space-y-8">
                 <Star className="text-violet-600 w-10 h-10" />
                 <h3 className="text-3xl font-black text-white font-syne uppercase">ТАЛАНТ</h3>
                 <p className="text-slate-400 font-medium">Молодой талант, желающий расти</p>
              </button>
           </div>
           <button onClick={() => setAuthMode('login')} className="text-slate-500 hover:text-white uppercase tracking-[0.5em] font-black text-[10px] py-4 px-10 border border-white/5 rounded-full hover:bg-white/5 transition-all">Уже в ШАГе? Войти</button>
        </div>
      )}
    </div>
  );
};

export default App;
