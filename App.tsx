
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, UserSession } from './types';
import { dbService } from './services/databaseService';
import { initDefaultData } from './services/db';
import { useShagData } from './hooks/useShagData';
import { useAuth } from './hooks/useAuth';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AuthScreen } from './components/auth/AuthScreen';
import { Loader2, Clock, RefreshCcw } from 'lucide-react';
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
    syncUserData(email, sess, (updated) => setSession(updated));
  }, [syncUserData]);

  const {
    session, setSession, isAuthLoading, errorMsg, setErrorMsg, login, register, logout
  } = useAuth(handleSyncSuccess);

  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await initDefaultData();

      const saved = localStorage.getItem('shag_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSession(parsed);
          handleSyncSuccess(parsed.email, parsed);
        } catch (e) {
          localStorage.removeItem('shag_session');
        }
      }
      setIsAppLoading(false);
    };
    initApp();
  }, [handleSyncSuccess, setSession]);

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
                Ваш профиль ментора находится в очереди на проверку. <br />
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
        onUpdateAvatar={async (u) => { await dbService.updateAvatar(session.email, u); setSession({ ...session, avatarUrl: u }); }}
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
        <AuthScreen
          login={login}
          register={register}
          isAuthLoading={isAuthLoading}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
