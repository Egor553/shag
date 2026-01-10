
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, UserSession } from './types';
import { dbService } from './services/databaseService';
import { initDefaultData } from './services/db';
import { useShagData } from './hooks/useShagData';
import { useAuth } from './hooks/useAuth';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { RegistrationFlow } from './components/RegistrationFlow';
import { Loader2, Clock, RefreshCcw, Zap, Star, Lock, AlertTriangle } from 'lucide-react';
import { Footer } from './components/Footer';

export const ShagLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
    <img src="https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png" alt="ШАГ" className="w-full h-full object-contain relative z-10" />
  </div>
);

const App: React.FC = () => {
  const { 
    allMentors, services, jobs, bookings, transactions, mentorProfile,
    syncUserData, saveService, deleteService, saveJob, deleteJob, updateProfile, setMentorProfile
  } = useShagData();

  const handleSyncSuccess = useCallback(async (email: string, sess: UserSession) => {
    // Выполняем синхронизацию в фоне, чтобы не блокировать UI
    syncUserData(email, sess, (updated) => setSession(updated));
  }, [syncUserData]);

  const { 
    session, setSession, isAuthLoading, errorMsg, setErrorMsg, login, register, logout 
  } = useAuth(handleSyncSuccess);

  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [regData, setRegData] = useState<any>({ 
    name: '', email: '', password: '', phone: '', city: '', direction: '',
    companyName: '', turnover: '', qualities: '', requestToYouth: '', 
    videoUrl: '', timeLimit: '', slots: {}, birthDate: '', focusGoal: '',
    expectations: '', mutualHelp: '', businessClubs: '', lifestyle: ''
  });
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // Инициализируем БД один раз
      await initDefaultData();
      
      const saved = localStorage.getItem('shag_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSession(parsed);
          // Синхронизируем данные в фоне
          handleSyncSuccess(parsed.email, parsed);
        } catch (e) {
          localStorage.removeItem('shag_session');
        }
      }
      setIsAppLoading(false);
    };
    initApp();
  }, [handleSyncSuccess]);

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) setAuthMode(null);
  };

  const onRegisterSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (regStep < 3) { setRegStep(regStep + 1); return; }
    
    // Регистрация теперь должна сработать очень быстро
    const success = await register(tempRole!, regData);
    if (success) {
      setAuthMode(null);
      setRegStep(1);
    }
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
          <div className="w-full max-w-xl bg-[#2d323c] border border-white/10 p-12 rounded-[48px] text-center space-y-10 shadow-2xl animate-in zoom-in-95 duration-500">
             <div className="relative mx-auto w-20 h-20">
                <Clock className="w-full h-full text-amber-500 animate-pulse" />
                <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20" />
             </div>
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase font-syne tracking-tighter">МОДЕРАЦИЯ</h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Ваш профиль ментора находится в очереди на проверку. <br/>
                  Мы свяжемся с вами в Telegram для подтверждения твёрдости кейсов.
                </p>
             </div>
             <div className="space-y-4">
                <button onClick={() => syncUserData(session.email, session, setSession)} className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all">
                  <RefreshCcw size={16} /> Проверить статус
                </button>
                <button onClick={logout} className="w-full text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest py-2 transition-colors">Выйти из аккаунта</button>
             </div>
          </div>
        </div>
      );
    }

    return (
      <MainDashboard 
        session={session} allMentors={allMentors} services={services} jobs={jobs} bookings={bookings} mentorProfile={mentorProfile}
        transactions={transactions} onLogout={logout} onUpdateMentorProfile={setMentorProfile}
        onSaveProfile={(updates) => updateProfile(session.email, updates || session)}
        onSaveService={(s) => saveService(s, session)}
        onUpdateService={(id, u) => saveService({ ...u, id }, session)}
        onDeleteService={(id) => deleteService(id, session.email)}
        onUpdateAvatar={async (u) => { await dbService.updateAvatar(session.email, u); setSession({...session, paymentUrl: u}); }}
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
          <div className="w-full max-w-md bg-[#2d323c] border border-white/10 p-12 rounded-[48px] space-y-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black text-white uppercase font-syne text-center">Вход в ШАГ</h2>
            {errorMsg && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold flex gap-3 items-center"><AlertTriangle size={16}/>{errorMsg}</div>}
            <form onSubmit={onLoginSubmit} className="space-y-6">
              <input required type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold uppercase" />
              <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold" />
              <button disabled={isAuthLoading} className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center">
                {isAuthLoading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Войти'}
              </button>
            </form>
            <button onClick={() => { setAuthMode(null); setErrorMsg(null); }} className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest">Назад к выбору</button>
          </div>
        ) : authMode === 'register' ? (
          <RegistrationFlow tempRole={tempRole} regStep={regStep} setRegStep={setRegStep} regData={regData} setRegData={setRegData} isAuthLoading={isAuthLoading} onCancel={() => setAuthMode(null)} onSubmit={onRegisterSubmit} />
        ) : (
          <div className="text-center space-y-12 animate-in fade-in duration-1000">
             <div className="relative inline-block">
                <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter uppercase font-syne leading-none">ШАГ</h1>
                <div className="absolute -top-4 -right-4 bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">Beta</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                <button onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setAuthMode('register'); setRegStep(1); }} className="p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[40px] hover:border-indigo-600 transition-all text-left space-y-6 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Zap size={120} />
                   </div>
                   <Zap className="text-indigo-600 w-10 h-10 group-hover:scale-110 transition-transform relative z-10" />
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white font-syne uppercase">МЕНТОР</h3>
                      <p className="text-slate-400 text-sm mt-1">Делитесь опытом и нанимайте таланты</p>
                   </div>
                </button>
                <button onClick={() => { setTempRole(UserRole.YOUTH); setAuthMode('register'); setRegStep(1); }} className="p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[40px] hover:border-violet-500 transition-all text-left space-y-6 group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Star size={120} />
                   </div>
                   <Star className="text-violet-500 w-10 h-10 group-hover:scale-110 transition-transform relative z-10" />
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white font-syne uppercase">УЧАСТНИК</h3>
                      <p className="text-slate-400 text-sm mt-1">Найдите наставника и работу мечты</p>
                   </div>
                </button>
             </div>
             <div className="flex flex-col items-center gap-6">
                <button onClick={() => setAuthMode('login')} className="text-white border-2 border-white/20 hover:border-indigo-500 uppercase tracking-[0.4em] font-black text-[11px] py-6 px-12 rounded-full transition-all hover:bg-white/5">Уже в ШАГе? Войти</button>
                <button onClick={() => setAuthMode('login')} className="flex items-center gap-2 text-slate-600 hover:text-indigo-400 transition-all font-black uppercase text-[9px] tracking-[0.3em]"><Lock size={12} /> Вход для персонала</button>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
