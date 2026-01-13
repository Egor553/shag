import React from 'react';
import { UserRole } from '../types';
import { ArrowLeft, Loader2, ArrowRight, Layers } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col bg-[#1a1d23] font-['Inter']">
      {/* Header / Nav */}
      <div className="sticky top-0 z-50 bg-[#1a1d23]/80 backdrop-blur-xl p-6 border-b border-white/10 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => regStep === 1 ? onCancel() : setRegStep(regStep - 1)} 
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4" />
          НАЗАД
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all duration-500 ${s === regStep ? `w-8 bg-${accentColor}-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]` : (s < regStep ? 'w-4 bg-emerald-500' : 'w-4 bg-white/10')}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 md:p-12 lg:p-24 overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full space-y-10">
          <div className="space-y-2">
             <p className="text-indigo-500 text-[8px] font-black tracking-[0.4em] uppercase">{roleLabel}</p>
             <h3 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
               {regStep === 3 ? 'ЗАВЕРШЕНИЕ' : `ШАГ_0${regStep}`}<br/>
               <span className="text-white/20 italic">
                 {regStep === 3 ? 'ЗАПУСК' : 'НАСТРОЙКА'}
               </span>
             </h3>
          </div>

          <form onSubmit={onSubmit} className="space-y-10">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {isEnt ? (
                <EntrepreneurRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              ) : (
                <YouthRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
              )}
            </div>

            <div className="pt-6 pb-20">
              <button 
                type="submit"
                disabled={isAuthLoading} 
                className={`w-full py-6 md:py-8 rounded-[24px] md:rounded-tr-[30px] md:rounded-bl-[30px] font-black uppercase text-[11px] md:text-[13px] tracking-[0.4em] text-white transition-all flex items-center justify-center gap-4 group shadow-2xl ${isEnt ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-violet-600 hover:bg-violet-500'}`}
              >
                {isAuthLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    {regStep === 3 ? 'ЗАВЕРШИТЬ РЕГИСТРАЦИЮ' : 'СЛЕДУЮЩИЙ ШАГ'} 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 text-white/20">
                <Layers className="w-3 h-3" />
                <span className="text-[7px] font-bold uppercase tracking-widest">Протокол ШАГ защищен шифрованием</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};