
import React from 'react';
import { UserRole } from '../types';
import { ArrowLeft, Loader2, Zap, ArrowRight, Check, ShieldCheck, Star } from 'lucide-react';
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
  const roleLabel = isEnt ? 'МЕНТОР' : 'ТАЛАНТ';

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-12 overflow-y-auto no-scrollbar font-['Inter']">
      <div className="w-full max-w-4xl bg-[#0a0a0b] border border-white/5 p-8 md:p-16 lg:p-24 rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className={`absolute -top-24 -right-24 w-96 h-96 bg-${accentColor}-600/10 blur-[120px] rounded-full opacity-50`} />
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 bg-${accentColor}-600/5 blur-[120px] rounded-full opacity-30`} />
        
        {/* Navigation Top */}
        <div className="absolute top-12 left-12 md:top-16 md:left-16 flex items-center gap-6 z-20">
          <button 
            onClick={() => regStep === 1 ? onCancel() : setRegStep(regStep - 1)} 
            className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group font-black uppercase text-[10px] tracking-widest"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Назад
          </button>
        </div>

        <div className="relative z-10">
          <header className="mb-16 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 animate-pulse`} />
                  <span className={`text-${accentColor}-500 font-black uppercase text-[10px] tracking-[0.4em]`}>
                    ШАГ {regStep} / 3
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div 
                      key={s} 
                      className={`h-1 rounded-full transition-all duration-700 ${s === regStep ? `w-12 bg-${accentColor}-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]` : (s < regStep ? `w-4 bg-${accentColor}-800` : 'w-4 bg-white/5')}`} 
                    />
                  ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-2">
                   {isEnt ? <ShieldCheck className="w-5 h-5 text-indigo-500" /> : <Star className="w-5 h-5 text-violet-500" />}
                   <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{roleLabel} — ENERGY EXCHANGE</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] font-syne">
                  {isEnt ? 'ВАША' : 'ТВОЯ'}<br/>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isEnt ? 'from-indigo-400 to-indigo-700' : 'from-violet-400 to-violet-700'}`}>
                    АНКЕТА
                  </span>
                </h2>
             </div>
          </header>

          <form onSubmit={onSubmit} className="space-y-16">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {isEnt ? (
                <EntrepreneurRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              ) : (
                <YouthRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              )}
            </div>

            <div className="pt-4">
              <button 
                disabled={isAuthLoading} 
                className={`w-full py-10 rounded-[40px] font-black uppercase text-[11px] tracking-[0.4em] text-white shadow-2xl transition-all flex items-center justify-center group relative overflow-hidden ${isEnt ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-violet-600 hover:bg-violet-500'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isAuthLoading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <span className="flex items-center gap-4 relative z-10">
                    {regStep === 3 ? 'Создать аккаунт' : 'Следующий этап'} 
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
