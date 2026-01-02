
import React from 'react';
import { Video, Mail, Building, MapPin, TrendingUp, Clock, Key, User, Briefcase, Sparkles, Target, Calendar as CalendarIcon, Phone, Globe, Heart, ShieldCheck } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="space-y-3 group">
    <label className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 group-focus-within:text-indigo-500 transition-colors">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <input 
      required={required}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-white text-base font-bold outline-none focus:border-indigo-600 focus:bg-white/[0.06] transition-all placeholder:text-white/10"
    />
  </div>
);

const TextAreaField = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="space-y-3 group">
    <label className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 group-focus-within:text-indigo-500 transition-colors">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <textarea 
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-white text-base font-medium outline-none focus:border-indigo-600 focus:bg-white/[0.06] transition-all placeholder:text-white/10 h-32 resize-none"
    />
  </div>
);

export const EntrepreneurRegForm: React.FC<EntrepreneurRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <div className="space-y-12">
      {regStep === 1 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Ваше Имя" icon={User} placeholder="Александр" value={regData.name} onChange={(v: string) => setRegData({...regData, name: v})} required />
            <InputField label="Компания / Проект" icon={Building} placeholder="ШАГ Corp" value={regData.companyName} onChange={(v: string) => setRegData({...regData, companyName: v})} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Годовой оборот (млн ₽)" icon={TrendingUp} placeholder="от 100" value={regData.turnover} onChange={(v: string) => setRegData({...regData, turnover: v})} required />
            <InputField label="Город базирования" icon={MapPin} placeholder="Москва" value={regData.city} onChange={(v: string) => setRegData({...regData, city: v})} required />
          </div>

          <InputField label="Ниша экспертизы (стаж 5+ лет)" icon={Briefcase} placeholder="IT / Маркетинг / Производство" value={regData.direction} onChange={(v: string) => setRegData({...regData, direction: v})} required />

          <div className="p-8 bg-indigo-600/5 rounded-[32px] border border-indigo-500/10 space-y-8 mt-12">
            <div className="flex items-center gap-3">
               <Key className="w-4 h-4 text-indigo-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Безопасность и связь</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Рабочий Email" icon={Mail} placeholder="name@company.com" type="email" value={regData.email} onChange={(v: string) => setRegData({...regData, email: v})} required />
              <InputField label="Пароль" icon={Key} placeholder="••••••••" type="password" value={regData.password} onChange={(v: string) => setRegData({...regData, password: v})} required />
            </div>
          </div>
        </div>
      )}

      {regStep === 2 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextAreaField 
              label="Мировоззрение и ценности" 
              icon={Sparkles} 
              placeholder="Что для вас важно в бизнесе и жизни?" 
              value={regData.qualities} 
              onChange={(v: string) => setRegData({...regData, qualities: v})} 
              required 
            />
            <TextAreaField 
              label="Запрос к новому поколению" 
              icon={Target} 
              placeholder="Что вы ищете в молодых талантах?" 
              value={regData.requestToYouth} 
              onChange={(v: string) => setRegData({...regData, requestToYouth: v})} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
               label="Бизнес-клубы (Атланты, Клуб 500 и др.)" 
               icon={ShieldCheck} 
               placeholder="Ваше резидентство" 
               value={regData.businessClubs} 
               onChange={(v: string) => setRegData({...regData, businessClubs: v})} 
            />
            <InputField 
               label="Спорт / Семейные ценности" 
               icon={Heart} 
               placeholder="Ваши личные достижения" 
               value={regData.lifestyle} 
               onChange={(v: string) => setRegData({...regData, lifestyle: v})} 
            />
          </div>

          <div className="bg-indigo-600/5 p-8 rounded-[32px] border border-indigo-500/10 space-y-4">
             <InputField label="Видео-визитка / Ссылка на соцсети" icon={Video} placeholder="YouTube / LinkedIn / Instagram" value={regData.videoUrl} onChange={(v: string) => setRegData({...regData, videoUrl: v})} />
          </div>
        </div>
      )}

      {regStep === 3 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Clock className="w-5 h-5 text-indigo-500" />
                 <h3 className="text-sm font-black text-white uppercase font-syne tracking-tight">Временной ресурс</h3>
              </div>
              <div className="relative">
                <input 
                  required 
                  value={regData.timeLimit} 
                  onChange={e => setRegData({...regData, timeLimit: e.target.value})} 
                  placeholder="Сколько часов в месяц готовы уделить?" 
                  className="w-full bg-white/[0.03] border border-white/5 p-7 rounded-[24px] text-white text-lg font-bold outline-none focus:border-indigo-600" 
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-[10px] uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-xl">ЧАСОВ / МЕС</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase font-syne tracking-tight">График энергообмена</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Выберите окна, когда вы открыты для встреч</p>
              </div>
            </div>
            <div className="bg-[#0c0c0e] rounded-[40px] p-2 border border-white/5">
              <SlotCalendar selectedSlots={regData.slots} onChange={s => setRegData({...regData, slots: s})} accentColor="indigo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
