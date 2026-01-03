
import React from 'react';
import { Sparkles, User, Calendar, MapPin, Phone, Mail, Key, Target, Heart, Rocket, Smile, Zap } from 'lucide-react';

interface YouthRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const GeometricInput = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2">
        <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" /> {label}
      </label>
    </div>
    <div className="relative">
      <input 
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#2d323c]/30 border border-white/10 p-3.5 md:p-5 rounded-tr-xl md:rounded-tr-2xl rounded-bl-xl md:rounded-bl-2xl text-white text-xs md:text-sm font-bold outline-none focus:border-violet-500/50 focus:bg-[#2d323c]/50 transition-all placeholder:text-white/10"
      />
      <div className="absolute bottom-0 right-0 w-0 h-px bg-violet-500 transition-all duration-500 group-focus-within:w-full" />
    </div>
  </div>
);

const GeometricTextArea = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-1.5 md:gap-2">
        <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" /> {label}
      </label>
    </div>
    <textarea 
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#2d323c]/30 border border-white/10 p-4 md:p-6 rounded-tl-2xl md:rounded-tl-3xl rounded-br-2xl md:rounded-br-3xl text-white text-xs md:text-sm font-medium outline-none focus:border-violet-500/50 focus:bg-[#2d323c]/50 transition-all placeholder:text-white/10 h-28 md:h-40 resize-none break-words"
    />
  </div>
);

export const YouthRegForm: React.FC<YouthRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <div className="space-y-6 md:space-y-12">
      {regStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 md:gap-y-10">
          <div className="md:col-span-2">
            <GeometricInput label="ФИО" icon={User} placeholder="ВАШЕ_ИМЯ" value={regData.name} onChange={(v: string) => setRegData({...regData, name: v})} required />
          </div>
          <GeometricInput label="Дата рождения" icon={Calendar} type="date" value={regData.birthDate} onChange={(v: string) => setRegData({...regData, birthDate: v})} required />
          <GeometricInput label="Город" icon={MapPin} placeholder="МОСКВА" value={regData.city} onChange={(v: string) => setRegData({...regData, city: v})} required />
          <div className="md:col-span-2">
            <GeometricInput label="Контакт в Telegram" icon={Phone} placeholder="@USERNAME" value={regData.phone} onChange={(v: string) => setRegData({...regData, phone: v})} required />
          </div>

          <div className="md:col-span-2 mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 p-5 md:p-8 bg-white/5 rounded-tr-2xl md:rounded-tr-[40px] rounded-bl-2xl md:rounded-bl-[40px] border border-white/10 relative">
            <div className="absolute -top-3 left-6 md:left-8 px-3 md:px-4 py-1 bg-[#1a1d23] border border-white/10 rounded-full text-[6px] md:text-[7px] font-black text-violet-400 uppercase tracking-widest whitespace-nowrap">
              Шлюз_Доступа
            </div>
            <GeometricInput label="Email" icon={Mail} type="email" placeholder="ME@DOMAIN.COM" value={regData.email} onChange={(v: string) => setRegData({...regData, email: v})} required />
            <GeometricInput label="Пароль" icon={Key} type="password" placeholder="********" value={regData.password} onChange={(v: string) => setRegData({...regData, password: v})} required />
          </div>
        </div>
      )}

      {regStep === 2 && (
        <div className="space-y-5 md:space-y-10">
          <GeometricTextArea label="Основной фокус" icon={Target} placeholder="ВАША ЦЕЛЬ НА ГОД" value={regData.focusGoal} onChange={(v: string) => setRegData({...regData, focusGoal: v})} required />
          <GeometricTextArea label="Ожидания от ментора" icon={Sparkles} placeholder="ЧЕМУ ВЫ ХОТИТЕ НАУЧИТЬСЯ?" value={regData.expectations} onChange={(v: string) => setRegData({...regData, expectations: v})} required />
          <GeometricTextArea label="Ваш вклад" icon={Heart} placeholder="ЧЕМ ВЫ МОЖЕТЕ БЫТЬ ПОЛЕЗНЫ?" value={regData.mutualHelp} onChange={(v: string) => setRegData({...regData, mutualHelp: v})} required />
        </div>
      )}

      {regStep === 3 && (
        <div className="py-8 md:py-20 flex flex-col items-center justify-center text-center">
          <div className="relative group">
             <div className="absolute inset-0 bg-violet-600 blur-[30px] md:blur-[60px] opacity-10 group-hover:opacity-20 transition-all" />
             <div className="w-24 h-24 md:w-56 md:h-56 bg-[#252930] border border-white/10 rounded-tr-[32px] md:rounded-tr-[60px] rounded-bl-[32px] md:rounded-bl-[60px] flex items-center justify-center relative z-10 mx-auto group-hover:scale-105 transition-transform shadow-2xl">
               <Rocket className="w-8 h-8 md:w-24 md:h-24 text-violet-400" />
             </div>
             <div className="absolute -bottom-1 -right-1 md:-bottom-4 md:-right-4 w-12 h-12 md:w-20 md:h-20 bg-[#1a1d23] border border-white/10 rounded-full flex items-center justify-center shadow-2xl z-20">
                <Zap className="w-4 h-4 md:w-10 md:h-10 text-emerald-400" />
             </div>
          </div>

          <div className="mt-8 md:mt-16 space-y-3 md:space-y-6 max-w-lg mx-auto px-4">
            <h3 className="text-2xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-tight md:leading-none">
              ГОТОВ_<br/><span className="text-white/20 italic">К_СТАРТУ</span>
            </h3>
            <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
              Система инициализирована. Ожидание деплоя.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
