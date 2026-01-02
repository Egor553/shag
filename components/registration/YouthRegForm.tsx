import React from 'react';
import { Sparkles, User, Calendar, MapPin, Phone, Mail, Key, Target, Heart, Rocket, Smile } from 'lucide-react';

interface YouthRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="space-y-3 group">
    <label className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 group-focus-within:text-violet-500 transition-colors">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <input 
      required={required}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-white text-base font-bold outline-none focus:border-violet-600 focus:bg-white/[0.06] transition-all placeholder:text-white/10"
    />
  </div>
);

const TextAreaField = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="space-y-3 group">
    <label className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 group-focus-within:text-violet-500 transition-colors">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <textarea 
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[24px] text-white text-base font-medium outline-none focus:border-violet-600 focus:bg-white/[0.06] transition-all placeholder:text-white/10 h-40 resize-none"
    />
  </div>
);

export const YouthRegForm: React.FC<YouthRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <div className="space-y-12">
      {regStep === 1 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
          <InputField label="Как тебя зовут?" icon={User} placeholder="Иван Иванов" value={regData.name} onChange={(v: string) => setRegData({...regData, name: v})} required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Дата рождения" icon={Calendar} type="date" value={regData.birthDate} onChange={(v: string) => setRegData({...regData, birthDate: v})} required />
            <InputField label="Город проживания" icon={MapPin} placeholder="Москва" value={regData.city} onChange={(v: string) => setRegData({...regData, city: v})} required />
          </div>

          <InputField label="Твой телефон (Telegram)" icon={Phone} placeholder="+7 (999) 000-00-00" value={regData.phone} onChange={(v: string) => setRegData({...regData, phone: v})} required />

          <div className="p-8 bg-violet-600/5 rounded-[32px] border border-violet-500/10 space-y-8 mt-12">
             <div className="flex items-center gap-3">
               <Key className="w-4 h-4 text-violet-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Данные для входа</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Твой Email" icon={Mail} type="email" placeholder="you@example.com" value={regData.email} onChange={(v: string) => setRegData({...regData, email: v})} required />
              <InputField label="Придумай пароль" icon={Key} type="password" placeholder="••••••••" value={regData.password} onChange={(v: string) => setRegData({...regData, password: v})} required />
            </div>
          </div>
        </div>
      )}

      {regStep === 2 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
          <TextAreaField 
            label="На чём сейчас твой главный фокус?" 
            icon={Target} 
            placeholder="Что ты хочешь достичь за ближайший год? В какой точке планируешь оказаться?" 
            value={regData.focusGoal} 
            onChange={(v: string) => setRegData({...regData, focusGoal: v})} 
            required 
          />
          
          <TextAreaField 
            label="Что ты ждешь от наставника?" 
            icon={Sparkles} 
            placeholder="Какой опыт тебе сейчас нужнее всего? Что именно ты хочешь обсудить на ШАГе?" 
            value={regData.expectations} 
            onChange={(v: string) => setRegData({...regData, expectations: v})} 
            required 
          />

          <TextAreaField 
            label="Твой вклад в ментора (Энергообмен)" 
            icon={Heart} 
            placeholder="Чем ты можешь быть полезен? Возможно, это свежий взгляд на продукт, помощь в проекте или просто искренний драйв?" 
            value={regData.mutualHelp} 
            onChange={(v: string) => setRegData({...regData, mutualHelp: v})} 
            required 
          />
        </div>
      )}

      {regStep === 3 && (
        <div className="space-y-12 py-12 text-center animate-in zoom-in duration-1000">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-violet-600 blur-[100px] opacity-30 animate-pulse" />
             <div className="w-40 h-40 rounded-[48px] bg-white/[0.03] border border-white/10 flex items-center justify-center relative z-10 mx-auto shadow-2xl">
               <Rocket className="w-20 h-20 text-violet-400" />
             </div>
             <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl z-20">
                <Smile className="w-6 h-6 text-white" />
             </div>
          </div>

          <div className="space-y-8 max-w-lg mx-auto">
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] font-syne">
              ШАГ ПОЧТИ<br/><span className="text-violet-500">ГОТОВ</span>
            </h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Твой профиль — это твой билет в мир больших возможностей. Проверь данные и жми кнопку ниже, чтобы запустить процесс!
            </p>
            
            <div className="flex items-center justify-center gap-6 pt-6">
              <div className="text-center">
                 <p className="text-white font-black text-2xl font-syne">100%</p>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Анкета</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                 <p className="text-violet-500 font-black text-2xl font-syne">READY</p>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Статус</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};