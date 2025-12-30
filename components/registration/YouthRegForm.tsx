
import React from 'react';
import { Sparkles } from 'lucide-react';

interface YouthRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

export const YouthRegForm: React.FC<YouthRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <>
      {regStep === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <input required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="Имя Фамилия" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Дата рождения</label>
            <input required type="date" value={regData.birthDate} onChange={e => setRegData({...regData, birthDate: e.target.value})} className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
          </div>
          <input required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="Твой город" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
          <input required value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} placeholder="Номер телефона (TG/WA)" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
          <input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="Почта для связи" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
          <input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="Пароль для входа" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-violet-600 text-lg" />
        </div>
      )}
      {regStep === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <textarea required value={regData.focusGoal} onChange={e => setRegData({...regData, focusGoal: e.target.value})} placeholder="Твой главный фокус и цель на ближайший год?" className="w-full bg-white/5 border-2 border-white/5 p-7 rounded-[32px] text-white outline-none focus:border-violet-600 h-32 text-lg" />
          <textarea required value={regData.expectations} onChange={e => setRegData({...regData, expectations: e.target.value})} placeholder="Чего ты ждешь от встреч с наставниками?" className="w-full bg-white/5 border-2 border-white/5 p-7 rounded-[32px] text-white outline-none focus:border-violet-600 h-32 text-lg" />
          <textarea required value={regData.mutualHelp} onChange={e => setRegData({...regData, mutualHelp: e.target.value})} placeholder="В чем ты реально можешь помочь предпринимателю? (Энергообмен)" className="w-full bg-white/5 border-2 border-white/5 p-7 rounded-[32px] text-white outline-none focus:border-violet-600 h-32 text-lg" />
        </div>
      )}
      {regStep === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 text-center py-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-violet-600 blur-3xl opacity-20 animate-pulse"></div>
            <Sparkles className="w-24 h-24 text-violet-500 mx-auto mb-6 relative z-10" />
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">Ты почти в игре!</h3>
          <p className="text-slate-400 text-xl font-medium max-w-sm mx-auto">Остался последний ШАГ. Жми кнопку ниже, чтобы создать аккаунт и попасть в мир возможностей.</p>
        </div>
      )}
    </>
  );
};
