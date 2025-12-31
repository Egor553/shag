
import React, { useState } from 'react';
import { UserSession, Mentor } from '../../types';
import { 
  Briefcase, Calendar as CalendarIcon, Save, Loader2, 
  User, MapPin, Mail, Clock, TrendingUp, Building, 
  LogOut, Camera, Link as LinkIcon 
} from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurProfileProps {
  session: UserSession;
  mentorProfile: Mentor | null;
  isSavingProfile: boolean;
  onSaveProfile: () => void;
  onUpdateMentorProfile: (profile: Mentor) => void;
  onLogout: () => void;
  onUpdateAvatar: (url: string) => void;
  onSessionUpdate: (session: UserSession) => void;
}

export const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({
  session,
  mentorProfile,
  isSavingProfile,
  onSaveProfile,
  onUpdateMentorProfile,
  onLogout,
  onUpdateAvatar,
  onSessionUpdate
}) => {
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(session?.paymentUrl || '');

  const handleChange = (field: keyof UserSession, value: string) => {
    onSessionUpdate({ ...session, [field]: value });
  };

  const handleAvatarSubmit = () => {
    onUpdateAvatar(tempPhotoUrl);
    setShowPhotoInput(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="bg-[#0a0a0b] p-8 md:p-14 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-14 pb-12 border-b border-white/5">
            <div className="relative group shrink-0">
              <div className="w-44 h-44 bg-slate-900 rounded-[52px] overflow-hidden border-4 border-white/5 shadow-2xl relative">
                {session?.paymentUrl ? (
                  <img src={session.paymentUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-7xl font-black font-syne">
                    {session?.name ? session.name[0] : 'U'}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all z-10"
              >
                <Camera className="w-6 h-6" />
              </button>
              
              {showPhotoInput && (
                <div className="absolute top-full mt-4 left-0 w-72 bg-[#121214] p-5 rounded-3xl shadow-2xl border border-white/5 z-20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 font-syne">Ссылка на аватар</p>
                  <div className="flex gap-2">
                    <input value={tempPhotoUrl} onChange={(e) => setTempPhotoUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-white/5 p-3 rounded-xl text-xs outline-none focus:ring-1 ring-indigo-500 font-bold" />
                    <button onClick={handleAvatarSubmit} className="bg-indigo-600 text-white p-3 rounded-xl"><LinkIcon className="w-4 h-4"/></button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Предприниматель / Эксперт
              </span>
              <input 
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-white tracking-tighter leading-none outline-none focus:text-indigo-400 transition-colors font-syne"
                value={session?.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors mx-auto md:mx-0">
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <ProfileField label="Проект / Компания" icon={Building} value={session?.companyName || ''} onChange={v => handleChange('companyName', v)} />
            <ProfileField label="Оборот / Уровень млн." icon={TrendingUp} value={session?.turnover || ''} onChange={v => handleChange('turnover', v)} />
            <ProfileField label="Город" icon={MapPin} value={session?.city || ''} onChange={v => handleChange('city', v)} />
            <ProfileField label="Лимит ч/мес" icon={Clock} value={session?.timeLimit || ''} onChange={v => handleChange('timeLimit', v)} />
            <div className="md:col-span-2 space-y-3">
               <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest font-syne">
                 <Briefcase className="w-3 h-3" /> Ниша
               </label>
               <input value={session?.direction || ''} onChange={e => handleChange('direction', e.target.value)} className="w-full bg-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 border border-transparent" />
            </div>
          </div>
          
          <div className="mt-16 flex justify-end">
             <button onClick={onSaveProfile} disabled={isSavingProfile} className="bg-white text-black px-12 py-6 rounded-[24px] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3">
                {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Сохранить
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {mentorProfile && (
          <div className="bg-[#0a0a0b] p-8 rounded-[48px] shadow-3xl space-y-8 border border-white/5">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <CalendarIcon className="w-6 h-6 text-indigo-500" />
              <h3 className="text-2xl font-black text-white font-syne">Мои слоты</h3>
            </div>
            <SlotCalendar 
              selectedSlots={JSON.parse(mentorProfile.slots || "{}")} 
              onChange={slots => onUpdateMentorProfile({...mentorProfile, slots: JSON.stringify(slots)})} 
              accentColor="indigo" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, icon: Icon, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest font-syne">
      <Icon className="w-3 h-3" /> {label}
    </label>
    <input 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 border border-transparent transition-all"
    />
  </div>
);
