
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
}

export const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({
  session,
  mentorProfile,
  isSavingProfile,
  onSaveProfile,
  onUpdateMentorProfile,
  onLogout,
  onUpdateAvatar
}) => {
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(session?.paymentUrl || '');

  const infoItems = [
    { label: 'Имя Фамилия', value: session?.name, icon: User },
    { label: 'Название компании/проекта', value: session?.companyName, icon: Building },
    { label: 'Оборот млн/руб.', value: session?.turnover ? `${session.turnover} млн/руб` : '—', icon: TrendingUp },
    { label: 'Почта', value: session?.email, icon: Mail },
    { label: 'Город', value: session?.city, icon: MapPin },
    { label: 'Лимит времени', value: session?.timeLimit ? `${session.timeLimit} ч/мес` : '—', icon: Clock },
  ];

  const handleAvatarSubmit = () => {
    onUpdateAvatar(tempPhotoUrl);
    setShowPhotoInput(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="bg-white p-10 md:p-14 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden h-full">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-14 pb-12 border-b border-slate-50">
            <div className="relative group shrink-0">
              <div className="w-44 h-44 bg-slate-900 rounded-[52px] overflow-hidden border-8 border-white shadow-2xl relative transition-all duration-500 group-hover:scale-105">
                {session?.paymentUrl ? (
                  <img src={session.paymentUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-7xl font-black">
                    {session?.name ? session.name[0] : 'U'}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all z-10 hover:scale-110"
              >
                <Camera className="w-6 h-6" />
              </button>
              
              {showPhotoInput && (
                <div className="absolute top-full mt-4 left-0 w-72 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 z-20 animate-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Вставьте ссылку на фото</p>
                  <div className="flex gap-2">
                    <input 
                      value={tempPhotoUrl}
                      onChange={(e) => setTempPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 p-3 rounded-xl text-xs outline-none focus:ring-2 ring-indigo-500 font-bold"
                    />
                    <button onClick={handleAvatarSubmit} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
                      <LinkIcon className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Предприниматель
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                {session?.name}
              </h3>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors mx-auto md:mx-0 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Выйти
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {infoItems.map((item, idx) => (
              <div key={idx} className="space-y-2 group">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900 pl-6 border-l-2 border-transparent group-hover:border-indigo-500 transition-all">
                  {item.value || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {mentorProfile && (
          <div className="bg-slate-900 p-10 rounded-[56px] shadow-3xl space-y-10 border border-white/5 h-full">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl text-indigo-500"><CalendarIcon className="w-6 h-6" /></div>
                <h3 className="text-2xl font-black text-white">Мой график</h3>
              </div>
              <button 
                onClick={onSaveProfile} 
                disabled={isSavingProfile} 
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
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
