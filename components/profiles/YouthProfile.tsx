
import React, { useState } from 'react';
import { UserSession, Booking } from '../../types';
import { 
  Sparkles, User, Calendar, MapPin, Phone, Mail, 
  Camera, Link as LinkIcon, LogOut, Zap, Save, Loader2, Clock
} from 'lucide-react';

interface YouthProfileProps {
  session: UserSession;
  onCatalogClick: () => void;
  onLogout: () => void;
  onUpdateAvatar: (url: string) => void;
  onSessionUpdate: (session: UserSession) => void;
  onSaveProfile: () => void;
  isSavingProfile: boolean;
  bookings?: Booking[];
}

export const YouthProfile: React.FC<YouthProfileProps> = ({ 
  session, 
  onCatalogClick, 
  onLogout,
  onUpdateAvatar,
  onSessionUpdate,
  onSaveProfile,
  isSavingProfile,
  bookings = []
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

  const myBookings = bookings.filter(b => b.userEmail === session.email);
  const activeBookingsCount = myBookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date()).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
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
              <button onClick={() => setShowPhotoInput(!showPhotoInput)} className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-4 rounded-2xl shadow-xl hover:bg-violet-700 transition-all z-10"><Camera className="w-6 h-6" /></button>
              {showPhotoInput && (
                <div className="absolute top-full mt-4 left-0 w-72 bg-[#121214] p-5 rounded-3xl border border-white/5 z-20">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-3 font-syne">Ссылка на фото</p>
                  <div className="flex gap-2">
                    <input value={tempPhotoUrl} onChange={(e) => setTempPhotoUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-white/5 p-3 rounded-xl text-xs text-white outline-none" />
                    <button onClick={handleAvatarSubmit} className="bg-violet-600 text-white p-3 rounded-xl"><LinkIcon className="w-4 h-4"/></button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <span className="px-5 py-2 bg-violet-500/10 text-violet-400 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                <Zap className="w-3 h-3" /> Молодой талант
              </span>
              <input 
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-white outline-none focus:text-violet-400 font-syne"
                value={session?.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-xs uppercase mx-auto md:mx-0"><LogOut className="w-4 h-4" /> Выйти</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <YouthField label="Город" icon={MapPin} value={session?.city || ''} onChange={v => handleChange('city', v)} />
            <YouthField label="Телефон" icon={Phone} value={session?.phone || ''} onChange={v => handleChange('phone', v)} />
            <div className="md:col-span-2 space-y-3">
               <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase font-syne tracking-widest">Цель развития на платформе</label>
               <textarea value={session?.focusGoal || ''} onChange={e => handleChange('focusGoal', e.target.value)} className="w-full bg-white/5 p-5 rounded-2xl text-white font-medium outline-none focus:border-violet-500 border border-transparent h-32" />
            </div>
          </div>
          
          <div className="mt-16 flex justify-end">
             <button onClick={onSaveProfile} disabled={isSavingProfile} className="bg-white text-black px-12 py-6 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center gap-3">
                {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Обновить
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#0a0a0b] p-8 rounded-[40px] border border-white/5 flex items-center gap-5">
           <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-400">
              <Clock size={24} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Будущие ШАГи</p>
              <p className="text-3xl font-black text-white font-syne">{activeBookingsCount}</p>
           </div>
        </div>

        <div className="bg-violet-600 p-10 rounded-[48px] shadow-3xl text-white space-y-8 relative overflow-hidden h-fit group">
          <Sparkles className="absolute top-0 right-0 p-8 opacity-10 w-40 h-40 group-hover:scale-110 transition-transform" />
          <h4 className="text-3xl font-black font-syne">Твой успех</h4>
          <p className="font-medium text-violet-100 text-lg">Забирай миссии, учись у лучших и становись частью сильного сообщества!</p>
          <button onClick={onCatalogClick} className="w-full bg-white text-violet-600 py-6 rounded-[24px] font-black uppercase text-sm tracking-widest shadow-2xl relative z-10">Найти ментора</button>
        </div>
      </div>
    </div>
  );
};

const YouthField = ({ label, icon: Icon, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest font-syne">
      <Icon className="w-3 h-3" /> {label}
    </label>
    <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-violet-500 border border-transparent transition-all" />
  </div>
);
