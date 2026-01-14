
import React from 'react';
import { Mail, Building, MapPin, TrendingUp, Clock, Key, User, Briefcase, Sparkles, Target, Calendar as CalendarIcon, Heart, ShieldCheck, Zap } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const GeometricInput = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3 h-3 text-white/40 group-focus-within:text-white" /> {label}
      </label>
      {required && <span className="text-[6px] md:text-[7px] font-bold text-white/30 uppercase hidden sm:inline">Обязательно</span>}
    </div>
    <div className="relative">
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 p-3.5 md:p-5 rounded-tl-xl md:rounded-tl-2xl rounded-br-xl md:rounded-br-2xl text-white text-xs md:text-sm font-bold outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20"
      />
      <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full" />
    </div>
  </div>
);

const GeometricTextArea = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3 h-3 text-white/40 group-focus-within:text-white" /> {label}
      </label>
    </div>
    <textarea
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-tr-2xl md:rounded-tr-3xl rounded-bl-2xl md:rounded-bl-3xl text-white text-xs md:text-sm font-medium outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20 h-28 md:h-40 resize-none break-words"
    />
  </div>
);

export const EntrepreneurRegForm: React.FC<EntrepreneurRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <div className="space-y-6 md:space-y-12">
      {regStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 md:gap-y-10">
          <GeometricInput label="ФИО" icon={User} placeholder="АЛЕКСАНДР_С" value={regData.name} onChange={(v: string) => setRegData({ ...regData, name: v })} required />
          <GeometricInput label="Компания / Проект" icon={Building} placeholder="НАЗВАНИЕ" value={regData.companyName} onChange={(v: string) => setRegData({ ...regData, companyName: v })} required />
          <GeometricInput label="Годовой оборот" icon={TrendingUp} placeholder="В МИЛЛИОНАХ" value={regData.turnover} onChange={(v: string) => setRegData({ ...regData, turnover: v })} required />
          <GeometricInput label="Город базирования" icon={MapPin} placeholder="МОСКВА" value={regData.city} onChange={(v: string) => setRegData({ ...regData, city: v })} required />
          <div className="md:col-span-1">
            <GeometricInput label="Ниша экспертизы" icon={Briefcase} placeholder="IT / МАРКЕТИНГ / ФИНТЕХ" value={regData.direction} onChange={(v: string) => setRegData({ ...regData, direction: v })} required />
          </div>
          <div className="md:col-span-1">
            <GeometricInput label="Контакт в Telegram" icon={Phone} placeholder="@USERNAME" value={regData.phone} onChange={(v: string) => setRegData({ ...regData, phone: v })} required />
          </div>

          <div className="md:col-span-2 mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 p-5 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-[30px] border border-white/10 relative">
            <div className="absolute -top-3 left-6 md:left-8 px-3 md:px-4 py-1 bg-[#1a1d23] border border-white/20 rounded-full text-[6px] md:text-[7px] font-black text-white uppercase tracking-widest whitespace-nowrap">
              Модуль_Безопасности
            </div>
            <GeometricInput label="Рабочий Email" icon={Mail} placeholder="MAIL@DOMAIN.COM" type="email" value={regData.email} onChange={(v: string) => setRegData({ ...regData, email: v })} required />
            <GeometricInput label="Мастер-пароль" icon={Key} placeholder="********" type="password" value={regData.password} onChange={(v: string) => setRegData({ ...regData, password: v })} required />
          </div>
        </div>
      )}

      {regStep === 2 && (
        <div className="space-y-5 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <GeometricTextArea label="Ключевые ценности" icon={Sparkles} placeholder="ЧТО ВАС ДВИЖЕТ ВПЕРЕД?" value={regData.qualities} onChange={(v: string) => setRegData({ ...regData, qualities: v })} required />
            <GeometricTextArea label="Запрос к менторам" icon={Target} placeholder="КОГО ВЫ ИЩЕТЕ ДЛЯ ЭНЕРГООБМЕНА?" value={regData.requestToYouth} onChange={(v: string) => setRegData({ ...regData, requestToYouth: v })} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <GeometricInput label="Бизнес-клубы" icon={ShieldCheck} placeholder="РЕЗИДЕНТСТВО" value={regData.businessClubs} onChange={(v: string) => setRegData({ ...regData, businessClubs: v })} />
            <GeometricInput label="Лайфстайл / Спорт" icon={Heart} placeholder="ХОББИ И УВЛЕЧЕНИЯ" value={regData.lifestyle} onChange={(v: string) => setRegData({ ...regData, lifestyle: v })} />
          </div>
        </div>
      )}

      {regStep === 3 && (
        <div className="space-y-6 md:space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 bg-white/[0.04] p-6 md:p-8 rounded-tr-[32px] md:rounded-tr-[50px] rounded-bl-[32px] md:rounded-bl-[50px] border border-white/15 shadow-inner">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Clock className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div className="flex-1 space-y-1.5 md:space-y-4 w-full">
              <label className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Распределение_Ресурса</label>
              <div className="relative">
                <input
                  required
                  value={regData.timeLimit}
                  onChange={e => setRegData({ ...regData, timeLimit: e.target.value })}
                  placeholder="ЧАСОВ / МЕС"
                  className="w-full bg-transparent border-b border-white/20 py-2 md:py-4 text-2xl md:text-4xl font-black text-white outline-none focus:border-white transition-all font-syne"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              <label className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.4em]">Синхронизация_Календаря</label>
            </div>
            <div className="bg-white/[0.03] rounded-2xl md:rounded-3xl border border-white/10 p-2 md:p-4 shadow-2xl overflow-x-auto no-scrollbar scale-[0.9] md:scale-100 origin-top">
              <SlotCalendar selectedSlots={regData.slots} onChange={s => setRegData({ ...regData, slots: s })} accentColor="indigo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
