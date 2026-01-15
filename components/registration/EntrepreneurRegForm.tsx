
import React from 'react';
import { Mail, Building, MapPin, TrendingUp, Clock, Key, User, Briefcase, Sparkles, Target, Calendar as CalendarIcon, Heart, ShieldCheck, Zap, Phone } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const GeometricInput = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2 font-syne">
        <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/40 group-focus-within:text-white" /> {label}
      </label>
      {required && <span className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase hidden sm:inline tracking-widest">Обязательно</span>}
    </div>
    <div className="relative">
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-tl-xl md:rounded-tl-2xl rounded-br-xl md:rounded-br-2xl text-white text-sm md:text-base font-bold outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20"
      />
      <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full" />
    </div>
  </div>
);

const GeometricTextArea = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2 font-syne">
        <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/40 group-focus-within:text-white" /> {label}
      </label>
    </div>
    <textarea
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-tr-2xl md:rounded-tr-3xl rounded-bl-2xl md:rounded-bl-3xl text-white text-sm md:text-base font-medium outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20 h-32 md:h-40 resize-none break-words"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <GeometricTextArea label="Опыт (Биография)" icon={PieChart} placeholder="РАССКАЖИТЕ О ВАШЕМ ПУТИ..." value={regData.experience} onChange={(v: string) => setRegData({ ...regData, experience: v })} required />
            <GeometricTextArea label="О чем будем говорить" icon={Star} placeholder="В ЧЕМ ВЫ МОЖЕТЕ БЫТЬ ПОЛЕЗНЫ?" value={regData.description} onChange={(v: string) => setRegData({ ...regData, description: v })} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <GeometricInput label="Бизнес-клубы" icon={ShieldCheck} placeholder="РЕЗИДЕНТСТВО" value={regData.businessClubs} onChange={(v: string) => setRegData({ ...regData, businessClubs: v })} />
            <GeometricInput label="Лайфстайл / Спорт" icon={Heart} placeholder="ХОББИ И УВЛЕЧЕНИЯ" value={regData.lifestyle} onChange={(v: string) => setRegData({ ...regData, lifestyle: v })} />
          </div>
        </div>
      )}

      {regStep === 3 && (
        <div className="space-y-6 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div className="flex items-center gap-5 md:gap-8 bg-white/[0.04] p-6 md:p-8 rounded-2xl border border-white/15 shadow-inner">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                <Clock className="w-5 h-5 md:w-7 h-7" />
              </div>
              <div className="flex-1">
                <label className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">ЧАСОВ_МЕС</label>
                <input
                  required
                  value={regData.timeLimit}
                  onChange={e => setRegData({ ...regData, timeLimit: e.target.value })}
                  placeholder="0"
                  className="w-full bg-transparent border-b border-white/20 py-1 text-xl md:text-2xl font-black text-white outline-none focus:border-white transition-all font-syne"
                />
              </div>
            </div>

            <div className="flex items-center gap-5 md:gap-8 bg-white/[0.04] p-6 md:p-8 rounded-2xl border border-white/15 shadow-inner">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                <Zap className="w-5 h-5 md:w-7 h-7" />
              </div>
              <div className="flex-1">
                <label className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">ЦЕНА_1_НА_1</label>
                <input
                  required
                  type="number"
                  value={regData.singlePrice}
                  onChange={e => setRegData({ ...regData, singlePrice: Number(e.target.value) })}
                  placeholder="0 ₽"
                  className="w-full bg-transparent border-b border-white/20 py-1 text-xl md:text-2xl font-black text-white outline-none focus:border-white transition-all font-syne"
                />
              </div>
            </div>

            <div className="flex items-center gap-5 md:gap-8 bg-white/[0.04] p-6 md:p-8 rounded-2xl border border-white/15 shadow-inner">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5 md:w-7 h-7" />
              </div>
              <div className="flex-1">
                <label className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">ЦЕНА_ГРУППА</label>
                <input
                  required
                  type="number"
                  value={regData.groupPrice}
                  onChange={e => setRegData({ ...regData, groupPrice: Number(e.target.value) })}
                  placeholder="0 ₽"
                  className="w-full bg-transparent border-b border-white/20 py-1 text-xl md:text-2xl font-black text-white outline-none focus:border-white transition-all font-syne"
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
