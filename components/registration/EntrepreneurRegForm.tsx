
import React from 'react';
import { Video, Mail, Building, MapPin, TrendingUp, Clock, Key, User, Briefcase } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';
import { Sparkles, Target, Calendar as CalendarIcon } from 'lucide-react';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const InputWrapper = ({ label, icon: Icon, children, color = 'indigo' }: any) => (
  <div className="space-y-4 group">
    <label className={`flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-${color}-400 transition-colors`}>
      <Icon className="w-3 h-3" /> {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export const EntrepreneurRegForm: React.FC<EntrepreneurRegFormProps> = ({ regStep, regData, setRegData }) => {
  const baseInput = "w-full bg-white/5 border border-white/10 p-7 rounded-[24px] text-white text-lg font-bold outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all placeholder:text-slate-800";

  return (
    <>
      {regStep === 1 && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label="Имя" icon={User}><input required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="АЛЕКСАНДР" className={baseInput} /></InputWrapper>
            <InputWrapper label="Компания / Проект" icon={Building}><input required value={regData.companyName} onChange={e => setRegData({...regData, companyName: e.target.value})} placeholder="ШАГ CORP" className={baseInput} /></InputWrapper>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label="Оборот / Уровень (млн)" icon={TrendingUp}><input required value={regData.turnover} onChange={e => setRegData({...regData, turnover: e.target.value})} placeholder="500" className={baseInput} /></InputWrapper>
            <InputWrapper label="Город" icon={MapPin}><input required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="МОСКВА" className={baseInput} /></InputWrapper>
          </div>
          <InputWrapper label="Экспертность / Индустрия" icon={Briefcase}><input required value={regData.direction} onChange={e => setRegData({...regData, direction: e.target.value})} placeholder="IT / EDTECH / MARKETING" className={baseInput} /></InputWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputWrapper label="Email" icon={Mail}><input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="WORK@SHAG.APP" className={baseInput} /></InputWrapper>
            <InputWrapper label="Пароль" icon={Key}><input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="••••••••" className={baseInput} /></InputWrapper>
          </div>
        </div>
      )}
      {regStep === 2 && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <InputWrapper label="Ценности и Принципы" icon={Sparkles}>
            <textarea required value={regData.qualities} onChange={e => setRegData({...regData, qualities: e.target.value})} placeholder="ЧТО ДЛЯ ВАС ВАЖНО В БИЗНЕСЕ И ЛЮДЯХ?" className={`${baseInput} h-40 resize-none`} />
          </InputWrapper>
          <InputWrapper label="Запрос к талантам" icon={Target}>
            <textarea required value={regData.requestToYouth} onChange={e => setRegData({...regData, requestToYouth: e.target.value})} placeholder="КАКИЕ ТАЛАНТЫ ВАМ ИНТЕРЕСНЫ ДЛЯ ОБМЕНА?" className={`${baseInput} h-40 resize-none`} />
          </InputWrapper>
          <InputWrapper label="Видео-визитка (ссылка)" icon={Video}>
            <input value={regData.videoUrl} onChange={e => setRegData({...regData, videoUrl: e.target.value})} placeholder="YOUTUBE / DRIVE / VIMEO" className={baseInput} />
          </InputWrapper>
        </div>
      )}
      {regStep === 3 && (
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
            <InputWrapper label="Лимит Времени на платформе" icon={Clock}>
              <div className="relative">
                <input required value={regData.timeLimit} onChange={e => setRegData({...regData, timeLimit: e.target.value})} placeholder="ЧАСОВ В МЕСЯЦ" className={`${baseInput} pr-20`} />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 font-black text-[10px] uppercase tracking-widest">HRS</span>
              </div>
            </InputWrapper>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Доступные слоты для энергообмена</h3>
            </div>
            <SlotCalendar selectedSlots={regData.slots} onChange={s => setRegData({...regData, slots: s})} accentColor="indigo" />
          </div>
        </div>
      )}
    </>
  );
};
