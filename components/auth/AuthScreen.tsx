
import React, { useState } from 'react';
import { UserRole, UserSession } from '../../types';
import { RegistrationFlow } from '../RegistrationFlow';
import { Loader2, Lock, AlertTriangle, Zap, Star } from 'lucide-react';

interface AuthScreenProps {
  login: (email: string, pass: string) => Promise<boolean>;
  register: (role: UserRole, data: any) => Promise<boolean>;
  isAuthLoading: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  login, register, isAuthLoading, errorMsg, setErrorMsg
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [tempRole, setTempRole] = useState<UserRole | null>(null);
  const [regData, setRegData] = useState<any>({
    name: '', email: '', password: '', phone: '', city: '', direction: '',
    companyName: '', turnover: '', qualities: '', requestToYouth: '',
    videoUrl: '', timeLimit: '', slots: {}, birthDate: '', focusGoal: '',
    expectations: '', mutualHelp: '', businessClubs: '', lifestyle: '',
    experience: '', description: '', singlePrice: 0, groupPrice: 0
  });

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);
  };

  const onRegisterSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    // Если это не последний шаг, просто переключаем на следующий
    if (regStep < 3) {
      setRegStep(prev => prev + 1);
      return;
    }

    // Финальная отправка данных в БД
    const success = await register(tempRole!, regData);
    if (success) {
      // После успешной регистрации App.tsx подхватит сессию
      // Сбрасываем локальное состояние только если нужно
      setAuthMode(null);
      setRegStep(1);
    }
  };

  if (authMode === 'login') {
    return (
      <div className="w-full max-w-md bg-[#2d323c] border border-white/10 p-12 rounded-[48px] space-y-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-3xl font-black text-white uppercase font-syne text-center">Вход в ШАГ</h2>
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold flex gap-3 items-center">
            <AlertTriangle size={16} />{errorMsg}
          </div>
        )}
        <form onSubmit={onLoginSubmit} className="space-y-6">
          <input required type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="ПОЧТА / ЛОГИН" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold uppercase" />
          <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="ПАРОЛЬ" className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-indigo-600 font-bold" />
          <button disabled={isAuthLoading} className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center">
            {isAuthLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Войти'}
          </button>
        </form>
        <button onClick={() => { setAuthMode(null); setErrorMsg(null); }} className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest">Назад к выбору</button>
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
        onSubmit={onRegisterSubmit}
      />
    );
  }

  return (
    <div className="text-center space-y-8 md:space-y-12 animate-in fade-in duration-1000 px-4">
      <div className="relative inline-block mt-8 md:mt-0">
        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white tracking-tighter uppercase font-syne leading-none">ШАГ</h1>
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-indigo-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl">Бета</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl mx-auto">
        <button onClick={() => { setTempRole(UserRole.ENTREPRENEUR); setAuthMode('register'); setRegStep(1); }} className="p-6 sm:p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[32px] md:rounded-[40px] hover:border-indigo-600 transition-all text-left space-y-4 md:space-y-6 group relative overflow-hidden active:scale-95 duration-200">
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
          <Zap className="text-indigo-600 w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-black text-white font-syne uppercase">ПРЕДПРИНИМАТЕЛЬ</h3>
            <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">Делитесь опытом и нанимайте таланты</p>
          </div>
        </button>
        <button onClick={() => { setTempRole(UserRole.YOUTH); setAuthMode('register'); setRegStep(1); }} className="p-6 sm:p-8 md:p-12 bg-[#2d323c] border border-white/5 rounded-[32px] md:rounded-[40px] hover:border-violet-500 transition-all text-left space-y-4 md:space-y-6 group relative overflow-hidden active:scale-95 duration-200">
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Star size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
          <Star className="text-violet-500 w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-black text-white font-syne uppercase">УЧАСТНИК</h3>
            <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">Найдите наставника и работу мечты</p>
          </div>
        </button>
      </div>
      <div className="flex flex-col items-center gap-4 md:gap-6 pb-8">
        <button onClick={() => setAuthMode('login')} className="w-full sm:w-auto text-white border-2 border-white/20 hover:border-indigo-500 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-[10px] md:text-[11px] py-5 md:py-6 px-8 md:px-12 rounded-full transition-all hover:bg-white/5 active:scale-95">Уже в ШАГе? Войти</button>
        <button onClick={() => setAuthMode('login')} className="flex items-center gap-2 text-slate-600 hover:text-indigo-400 transition-all font-black uppercase text-[8px] md:text-[9px] tracking-[0.3em] py-2"><Lock size={12} /> Вход для персонала</button>
      </div>
    </div>
  );
};
