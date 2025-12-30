
import React from 'react';
import { UserRole } from '../types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ShagLogo } from '../App';
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

  if (regStep === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-violet-900/20" />
        <div className="max-w-4xl w-full relative z-10 space-y-12 animate-in fade-in duration-700">
          <div className="flex justify-center mb-8"><ShagLogo className="w-24 h-24" /></div>
          <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[64px] backdrop-blur-xl shadow-3xl space-y-10">
            <h2 className={`text-4xl md:text-6xl font-black text-white tracking-tighter leading-none ${isEnt ? 'text-indigo-400' : 'text-violet-400'}`}>
              {isEnt ? 'Путь предпринимателя на платформе ШАГ' : 'Твой ШАГ к успеху'}
            </h2>
            <div className="space-y-6 text-slate-300 text-xl leading-relaxed font-medium">
              {isEnt ? (
                <>
                  <p>Стань наставником и найди таланты. Мы продумали всё, чтобы твой опыт приносил максимум пользы.</p>
                  <p className="text-white font-black">Что от тебя потребуется:</p>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>Рассказать о своем бизнесе и достижениях.</li>
                    <li>Обозначить свой запрос: кого ты ищешь и что ценишь в людях.</li>
                    <li>Записать короткую видео-визитку.</li>
                    <li>Выбрать удобные слоты в календаре для встреч.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p>Получи доступ к знаниям топовых предпринимателей. Твоя анкета — это твой входной билет.</p>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>Честно расскажи о своих целях и фокусе.</li>
                    <li>Опиши, чем ты можешь быть реально полезен наставнику.</li>
                    <li>Сделай ШАГ навстречу своему масштабному будущему.</li>
                  </ol>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setRegStep(1)} 
                className={`w-full py-8 rounded-[32px] font-black uppercase text-sm tracking-[0.2em] text-white shadow-3xl transition-all hover:scale-[1.02] ${isEnt ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-violet-600 shadow-violet-600/20'}`}
              >
                Начать заполнение
              </button>
              <button onClick={onCancel} className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pt-2 hover:text-white transition-colors">Вернуться к выбору роли</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#121214] border border-white/10 p-12 md:p-16 rounded-[64px] max-h-[92vh] overflow-y-auto no-scrollbar relative shadow-3xl">
        <button 
          onClick={() => setRegStep(regStep - 1)} 
          className="absolute top-10 left-10 text-slate-500 hover:text-white flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Назад
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 pt-6">
          <div>
            <h2 className="text-4xl font-black text-white leading-none tracking-tight">Анкета {isEnt ? 'Наставника' : 'Таланта'}</h2>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-3 ${isEnt ? 'text-indigo-500' : 'text-violet-500'}`}>ШАГ {regStep} из 3</p>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-14 h-1.5 rounded-full transition-all duration-500 ${i <= regStep ? (isEnt ? 'bg-indigo-600' : 'bg-violet-600') : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-8">
          {isEnt ? (
            <EntrepreneurRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
          ) : (
            <YouthRegForm regStep={regStep} regData={regData} setRegData={setRegData} />
          )}

          <button 
            disabled={isAuthLoading} 
            className={`w-full py-6 rounded-[32px] font-black uppercase text-xs tracking-widest text-white shadow-3xl transition-all ${isEnt ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20'}`}
          >
            {isAuthLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (regStep === 3 ? 'Создать ШАГ-аккаунт' : 'Продолжить')}
          </button>
        </form>
      </div>
    </div>
  );
};
