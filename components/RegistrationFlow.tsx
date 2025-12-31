
import React from 'react';
import { UserRole } from '../types';
import { ArrowLeft, Loader2, Zap, ArrowRight, Check } from 'lucide-react';
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

  // В этой итерации мы убрали regStep === 0, переход идет сразу к форме.
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-12 overflow-y-auto font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-3xl bg-[#0a0a0b] border border-white/10 p-8 md:p-20 rounded-[48px] md:rounded-[64px] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Декоративный элемент фона */}
        <div className={`absolute top-[-50px] right-[-50px] w-64 h-64 bg-${accentColor}-600/10 blur-[100px] rounded-full`} />
        
        <button 
          onClick={() => regStep === 1 ? onCancel() : setRegStep(regStep - 1)} 
          className="absolute top-8 left-8 md:top-12 md:left-12 text-slate-500 hover:text-white flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all group z-20"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Назад
        </button>

        <div className="relative z-10">
          <header className="mb-16 space-y-6">
             <div className="flex items-center justify-between">
                <span className={`text-${accentColor}-500 font-black uppercase text-[10px] tracking-[0.5em]`}>ЭТАП 0{regStep}</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1 rounded-full transition-all duration-700 ${s === regStep ? `w-10 bg-${accentColor}-500` : (s < regStep ? `w-4 bg-${accentColor}-500/40` : 'w-4 bg-white/10')}`} />
                  ))}
                </div>
             </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              {isEnt ? 'АНКЕТА' : 'ТВОЙ'}<br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500`}>
                {isEnt ? 'МЕНТОРА' : 'ПРОФИЛЬ'}
              </span>
            </h2>
          </header>

          <form onSubmit={onSubmit} className="space-y-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isEnt ? (
                <EntrepreneurRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              ) : (
                <YouthRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              )}
            </div>

            <div className="pt-8">
              <button 
                disabled={isAuthLoading} 
                className={`w-full py-8 md:py-10 rounded-[32px] font-black uppercase text-xs tracking-[0.4em] text-white shadow-2xl transition-all flex items-center justify-center group relative overflow-hidden ${isEnt ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-violet-600 hover:bg-violet-500'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isAuthLoading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <span className="flex items-center gap-4 relative z-10">
                    {regStep === 3 ? 'Готово' : 'Продолжить'} 
                    {regStep === 3 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
