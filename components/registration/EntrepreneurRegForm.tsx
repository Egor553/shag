
import React from 'react';
import { Video } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

export const EntrepreneurRegForm: React.FC<EntrepreneurRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <>
      {regStep === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <input required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="Имя Фамилия" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required value={regData.companyName} onChange={e => setRegData({...regData, companyName: e.target.value})} placeholder="Название компании\проекта" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required value={regData.turnover} onChange={e => setRegData({...regData, turnover: e.target.value})} placeholder="Оборот млн\руб." className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="Город" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required value={regData.direction} onChange={e => setRegData({...regData, direction: e.target.value})} placeholder="Направление бизнеса" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="Рабочая почта" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="Придумайте пароль" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
        </div>
      )}
      {regStep === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <textarea required value={regData.qualities} onChange={e => setRegData({...regData, qualities: e.target.value})} placeholder="Какие качества вы цените в людях?" className="w-full bg-white/5 border-2 border-white/5 p-7 rounded-[32px] text-white outline-none focus:border-indigo-600 h-32 text-lg" />
          <textarea required value={regData.requestToYouth} onChange={e => setRegData({...regData, requestToYouth: e.target.value})} placeholder="Ваш запрос к молодому поколению (что ищете?)" className="w-full bg-white/5 border-2 border-white/5 p-7 rounded-[32px] text-white outline-none focus:border-indigo-600 h-32 text-lg" />
          <div className="p-7 bg-indigo-600/10 border-2 border-indigo-600/30 rounded-[32px] flex items-center gap-6 group">
            <Video className="w-8 h-8 text-indigo-500" />
            <input value={regData.videoUrl} onChange={e => setRegData({...regData, videoUrl: e.target.value})} placeholder="Ссылка на видео-визитку (30-90 сек)" className="bg-transparent flex-1 text-white outline-none text-lg" />
          </div>
        </div>
      )}
      {regStep === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
          <input required value={regData.timeLimit} onChange={e => setRegData({...regData, timeLimit: e.target.value})} placeholder="Лимит времени на наставничество в месяц (в часах)" className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-indigo-600 text-lg" />
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] px-6">Ваш календарь слотов</h3>
            <SlotCalendar selectedSlots={regData.slots} onChange={s => setRegData({...regData, slots: s})} accentColor="indigo" />
          </div>
        </div>
      )}
    </>
  );
};
