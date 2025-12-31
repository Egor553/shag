
import React from 'react';
import { Sparkles, User, Calendar, MapPin, Phone, Mail, Key, Target, Heart } from 'lucide-react';

interface YouthRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const InputWrapper = ({ label, icon: Icon, children, color = 'violet' }: any) => (
  <div className="space-y-4 group">
    <label className={`flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-${color}-400 transition-colors`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export const YouthRegForm: React.FC<YouthRegFormProps> = ({ regStep, regData, setRegData }) => {
  const baseInput = "w-full bg-white/5 border border-white/10 p-7 rounded-[24px] text-white text-lg font-bold outline-none focus:border-violet-600 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all placeholder:text-slate-800";

  return (
    <>
      {regStep === 1 && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <InputWrapper label="Полное Имя" icon={User}><input required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="ИВАН ИВАНОВ" className={baseInput} /></InputWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label="Дата Рождения" icon={Calendar}><input required type="date" value={regData.birthDate} onChange={e => setRegData({...regData, birthDate: e.target.value})} className={`${baseInput} appearance-none`} /></InputWrapper>
            <InputWrapper label="Город" icon={MapPin}><input required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="МОСКВА" className={baseInput} /></InputWrapper>
          </div>
          <InputWrapper label="Телефон для связи" icon={Phone}><input required value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} placeholder="+7 (___) ___ __ __" className={baseInput} /></InputWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label="Email" icon={Mail}><input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="YOUR@EMAIL.COM" className={baseInput} /></InputWrapper>
            <InputWrapper label="Пароль" icon={Key}><input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="••••••••" className={baseInput} /></InputWrapper>
          </div>
        </div>
      )}
      {regStep === 2 && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <InputWrapper label="Твой Фокус и Цель" icon={Target}>
            <textarea required value={regData.focusGoal} onChange={e => setRegData({...regData, focusGoal: e.target.value})} placeholder="ЧТО ТЫ ХОЧЕШЬ ДОСТИЧЬ ЗА БЛИЖАЙШИЙ ГОД?" className={`${baseInput} h-40 resize-none`} />
          </InputWrapper>
          <InputWrapper label="Ожидания от ментора" icon={Sparkles}>
            <textarea required value={regData.expectations} onChange={e => setRegData({...regData, expectations: e.target.value})} placeholder="КАКОЙ ОПЫТ ТЕБЕ НУЖЕН СЕЙЧАС БОЛЬШЕ ВСЕГО?" className={`${baseInput} h-40 resize-none`} />
          </InputWrapper>
          <InputWrapper label="Твой вклад (Энергообмен)" icon={Heart}>
            <textarea required value={regData.mutualHelp} onChange={e => setRegData({...regData, mutualHelp: e.target.value})} placeholder="ЧЕМ ТЫ МОЖЕШЬ БЫТЬ ПОЛЕЗЕН ПРЕДПРИНИМАТЕЛЮ?" className={`${baseInput} h-40 resize-none`} />
          </InputWrapper>
        </div>
      )}
      {regStep === 3 && (
        <div className="space-y-12 py-12 text-center animate-in zoom-in duration-1000">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-violet-600 blur-[80px] opacity-30 animate-pulse" />
             <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center relative z-10 mx-auto">
               <Sparkles className="w-16 h-16 text-violet-400" />
             </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">ШАГ ПОЧТИ<br/><span className="text-violet-500">СДЕЛАН</span></h3>
            <p className="text-slate-400 text-xl font-medium max-w-sm mx-auto leading-relaxed">
              Твой профиль — это твоя визитка в мире больших возможностей. Проверь данные и жми «Создать».
            </p>
          </div>
        </div>
      )}
    </>
  );
};
