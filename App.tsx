
import React, { useState, useEffect } from 'react';
import { UserRole, UserSession, Service, Job } from './types';
import { dbService } from './services/databaseService';
import { useShagData } from './hooks/useShagData';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { RegistrationFlow } from './components/RegistrationFlow';
import { Loader2, Star, Zap, AlertTriangle, Clock, RefreshCcw, Lock } from 'lucide-react';
import { Footer } from './components/Footer';

export const ShagLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
    <div className="relative w-full h-full bg-transparent flex items-center justify-center overflow-hidden">
      <img 
        src="https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png" 
        alt="ШАГ Logo" 
        className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(108,117,125,0.4)]"
      />
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
    expectations: '', mutualHelp: '', businessClubs: '', lifestyle: ''
  });
  const [isAppLoading, setIsAppLoading] = useState(true);

  const { 
    allMentors, services, jobs, bookings, transactions, mentorProfile,
    syncUserData, saveService, deleteService, saveJob, deleteJob, updateProfile,
    setMentorProfile
  } = useShagData();

  useEffect(() => {
    const initApp = async () => {
      const saved = localStorage.getItem('shag_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const cleanEmail = parsed.email;
          const data = await dbService.syncData(cleanEmail);
          const currentUser = data.dynamicMentors.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
          
          if (currentUser) {
            setSession({ ...currentUser, isLoggedIn: true });
            await syncUserData(cleanEmail, { ...currentUser, isLoggedIn: true }, setSession);
          } else {
            localStorage.removeItem('shag_session');
          }
        } catch (e) {
          localStorage.removeItem('shag_session');
        }
      }
      setIsAppLoading(false);
    };
    initApp();
  }, [syncUserData]);

  useEffect(() => {
    if (session && session.isLoggedIn) {
      localStorage.setItem('shag_session', JSON.stringify(session));
    } else if (!isAppLoading) {
      localStorage.removeItem('shag_session');
    }
  }, [session, isAppLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setErrorMsg(null);
    try {
      const cleanEmail = loginEmail.toLowerCase().trim();
      const cleanPass = loginPassword.trim();

      const userData = await dbService.login({ email: cleanEmail, password: cleanPass });
      const sess = { ...userData, isLoggedIn: true } as UserSession;
      
      setSession(sess);
      await syncUserData(sess.email, sess, setSession);
      setAuthMode(null);
      setErrorMsg(null);
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
    setErrorMsg(null);
    
    const newUser = { 
      role: tempRole, 
      ...regData, 
      slots: JSON.stringify(regData.slots), 
      balance: 0,
    };
    
    try {
      const res = await dbService.register(newUser);
      if (res.result === 'success') {
        const sess = { ...res.user, isLoggedIn: true } as UserSession;
        setSession(sess);
        await syncUserData(newUser.email, sess, setSession);
        setAuthMode(null);
      } else { 
        setErrorMsg(res.message || 'Ошибка регистрации'); 
      }
    } catch (e) { 
      setErrorMsg('Ошибка соединения с сервером'); 
    } finally { 
      setIsAuthLoading(false); 
    }
  };

  const logout = () => {
    setSession(null);
    setAuthMode(null);
    setLoginEmail('');
    setLoginPassword('');
    localStorage.removeItem('shag_session');
  };

  if (isAppLoading) return (
    <div className="min-h-screen bg-[#1a1d23] flex flex-col items-center justify-center space-y-6">
      <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Загрузка системы...</p>
    </div>
  );

  if (session?.isLoggedIn) {
    if (session.role === UserRole.ENTREPRENEUR && session.status === 'pending') {
      return (
        <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-[#2d323c] border border-white/10 p-12 md:p-16 rounded-[48px] text-center space-y-10 shadow-2xl">
             <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto text-amber-500">
                <Clock className="w-12 h-12 animate-pulse" />
             </div>
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase font-syne tracking-tighter">МОДЕРАЦИЯ</h2>
                <p className="text-slate-400">Ваш профиль ментора проверяется администратором.</p>
             </div>
             <button onClick={() => syncUserData(session.email, session, setSession)} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3">
                <RefreshCcw size={16} /> Проверить статус
             </button>
             <button onClick={logout} className="text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Выйти</button>
          </div>
        </div>
      );
    }

    return (
      <MainDashboard 
        session={session} 
        allMentors={allMentors} 
        services={services} 
        jobs={jobs} 
        bookings={bookings} 
        mentorProfile={mentorProfile}
        transactions={transactions}
        onLogout={logout}
        onUpdateMentorProfile={setMentorProfile}
        onSaveProfile={(updates) => updateProfile(session.email, updates || session)}
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
    <div className="min-h-screen bg-[#1a1d23] flex flex-col items-center">
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        {authMode === 'login' ? (
          <div className="w-full max-w-md bg-[#2d323c] border border-white/10 p-12 rounded-[48px] space-y-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-white uppercase font-syne text-center">Вход в ШАГ</h2>
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex gap-3 text-xs font-bold items-center">
                <AlertTriangle className="w-4 h-4 shrink-0"/>{errorMsg}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <input required type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="EMAIL ИЛИ ЛОГИН" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 uppercase font-bold" />
              <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold" />
              <button disabled={isAuthLoading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-xl flex items-center justify-center">
                {isAuthLoading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Войти'}
              </button>
            </form>
            <button onClick={() => { setAuthMode(null); setErrorMsg(null); }} className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest">Вернуться на главную</button>
            <div className="text-center pt-4 opacity-30">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin: admin / admin123</p>
            </div>
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
          <div className="text-center space-y-12 md:space-y-20 animate-in fade-in duration-1000">
             <h1 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter uppercase font-syne leading-none">ШАГ</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                <button onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setAuthMode('register'); setRegStep(1); }} className="p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[40px] md:rounded-[48px] hover:border-indigo-600 transition-all text-left space-y-6 md:space-y-8 group">
                   <Zap className="text-indigo-600 w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
                   <h3 className="text-2xl md:text-3xl font-black text-white font-syne uppercase">МЕНТОР</h3>
                   <p className="text-slate-400 text-sm">Поделитесь опытом с молодежью</p>
                </button>
                <button onClick={() => { setTempRole(UserRole.YOUTH); setAuthMode('register'); setRegStep(1); }} className="p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[40px] md:rounded-[48px] hover:border-violet-500 transition-all text-left space-y-6 md:space-y-8 group">
                   <Star className="text-violet-500 w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
                   <h3 className="text-2xl md:text-3xl font-black text-white font-syne uppercase">УЧАСТНИК</h3>
                   <p className="text-slate-400 text-sm">Найдите наставника для роста</p>
                </button>
             </div>
             
             <div className="flex flex-col items-center gap-6">
                <button onClick={() => setAuthMode('login')} className="text-white border-2 border-white/40 hover:border-indigo-500 uppercase tracking-[0.4em] font-black text-[11px] py-5 px-10 rounded-full transition-all">Уже в ШАГе? Войти</button>
                
                <button 
                  onClick={() => { setAuthMode('login'); }} 
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-500 transition-all font-black uppercase text-[9px] tracking-[0.3em] group"
                >
                  <Lock size={12} className="group-hover:scale-110 transition-transform" /> 
                  Вход для персонала
                </button>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
