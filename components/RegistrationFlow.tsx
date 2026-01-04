
import React from 'react';
import { UserRole } from '../types';
import { ArrowLeft, Loader2, ArrowRight, Check, ShieldCheck, Star, Layers } from 'lucide-react';
import { EntrepreneurRegForm } from './registration/EntrepreneurRegForm';
import { YouthRegForm } from './registration/YouthRegForm';

interface RegistrationFlowProps {
  tempRole: UserRole | null;
  regStep: number;
  setRegStep: (step: number) => void;
  regData: any;
  setRegData: (data: any) => void;
  isAuthLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  tempRole,
  regStep,
  setRegStep,
  regData,
  setRegData,
  isAuthLoading,
  onCancel,
  onSubmit
}) => {
  const isEnt = tempRole === UserRole.ENTREPRENEUR;
  const accentColor = isEnt ? 'indigo' : 'violet';
  const roleLabel = isEnt ? 'ДОСТУП_МЕНТОРА' : 'ДОСТУП_УЧАСТНИКА';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12 font-['Inter'] relative overflow-x-hidden bg-[#1a1d23]">
      {/* Архитектурные линии декора */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ffffff] to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffffff] to-transparent" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row relative z-10 min-h-0">
        
        {/* Левая панель - Навигация и Статус */}
        <div className={`w-full lg:w-80 bg-[#252930] p-6 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 lg:rounded-l-[40px] rounded-t-[32px] lg:rounded-tr-none relative overflow-hidden shrink-0`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent lg:hidden" />
          
          <div className="space-y-8 lg:space-y-12 relative z-10">
            <button 
              onClick={() => regStep === 1 ? onCancel() : setRegStep(regStep - 1)} 
              className="flex items-center gap-3 text-white/40 hover:text-white transition-all group font-black uppercase text-[10px] tracking-[0.3em]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              НАЗАД
            </button>

            <div className="space-y-3 lg:space-y-4">
              <p className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase">{roleLabel}</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white font-syne uppercase tracking-tighter leading-none">
                ШАГ_<br/>0{regStep}
              </h2>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 space-y-6 relative z-10">
            <div className="flex lg:flex-col gap-4 lg:gap-3 justify-center lg:justify-start">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-4 group">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${s === regStep ? `bg-${accentColor}-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-125` : (s < regStep ? 'bg-emerald-500' : 'bg-white/10')}`} />
                  <span className={`hidden lg:inline text-[8px] font-black uppercase tracking-widest ${s === regStep ? 'text-white' : 'text-white/30'}`}>
                    {s === 1 ? 'ЛИЧНОСТЬ' : s === 2 ? 'ОПЫТ' : 'РЕСУРСЫ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Правая панель - Форма (Основной контент) */}
        <div className="flex-1 bg-[#1d2127]/80 backdrop-blur-xl p-6 md:p-12 lg:p-24 lg:rounded-r-[40px] rounded-b-[32px] lg:rounded-bl-none border-t lg:border-t-0 lg:border-l border-white/5 relative">
          <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-[#2d323c] rounded-bl-[60px] lg:rounded-bl-[80px] border-l border-b border-white/5 hidden sm:block" />
          
          <div className="max-w-3xl mx-auto space-y-10 lg:space-y-16">
            <div className="space-y-4 lg:space-y-6">
               <h3 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                 {regStep === 3 ? 'ЗАВЕРШЕНИЕ' : 'СИСТЕМА'}<br/>
                 <span className={`text-white/20 italic`}>
                   {regStep === 3 ? 'ЗАПУСК' : 'НАСТРОЙКА'}
                 </span>
               </h3>
            </div>

            <form onSubmit={onSubmit} className="space-y-12 lg:space-y-16">
              <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                {isEnt ? (
                  <EntrepreneurRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
                ) : (
                  <YouthRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
                )}
              </div>

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="hidden md:flex items-center gap-3 text-white/30">
                  <Layers className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Данные защищены шифрованием</span>
                </div>
                
                <button 
                  disabled={isAuthLoading} 
                  className={`w-full md:w-auto px-10 lg:px-14 py-6 lg:py-8 rounded-tr-[30px] rounded-bl-[30px] font-black uppercase text-[11px] lg:text-[13px] tracking-[0.4em] text-white transition-all flex items-center justify-center gap-6 group overflow-hidden shadow-2xl ${isEnt ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-violet-600 hover:bg-violet-500'}`}
                >
                  {isAuthLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      {regStep === 3 ? 'ЗАВЕРШИТЬ_РЕГИСТРАЦИЮ' : 'СЛЕДУЮЩИЙ_ШАГ'} 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
