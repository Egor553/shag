
import React, { useState } from 'react';
import { UserSession, Mentor, Transaction } from '../../types';
import { 
  Briefcase, Calendar as CalendarIcon, Save, Loader2, 
  User, MapPin, Building, LogOut, Camera, 
  Link as LinkIcon, Star, PieChart, Heart, Zap
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
  transactions?: Transaction[];
}

export const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({
  session,
  mentorProfile,
  isSavingProfile,
  onSaveProfile,
  onUpdateMentorProfile,
  onLogout,
  onUpdateAvatar,
  onSessionUpdate,
  transactions = []
}) => {
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(session?.paymentUrl || '');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'impact'>('profile');

  const handleChange = (field: keyof UserSession, value: any) => {
    onSessionUpdate({ ...session, [field]: value });
  };

  const handleAvatarSubmit = () => {
    onUpdateAvatar(tempPhotoUrl);
    setShowPhotoInput(false);
  };

  const totalImpact = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Sub Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white/5 p-2 rounded-[32px] w-fit border border-white/10">
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeSubTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
        >
          <User className="w-4 h-4" /> Профиль
        </button>
        <button 
          onClick={() => setActiveSubTab('impact')}
          className={`px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeSubTab === 'impact' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
        >
          <Heart className="w-4 h-4" /> Мой Вклад
        </button>
      </div>

      {activeSubTab === 'profile' && (
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
                  <button onClick={() => setShowPhotoInput(!showPhotoInput)} className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all z-10"><Camera className="w-6 h-6" /></button>
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
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Предприниматель / Волонтер ШАГа
                    </span>
                    <span className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-amber-500/20">
                      <Star className="w-3 h-3 fill-current" /> {session.rating || '5.0'}
                    </span>
                  </div>
                  <input className="w-full bg-transparent text-4xl md:text-5xl font-black text-white tracking-tighter leading-none outline-none focus:text-indigo-400 transition-colors font-syne uppercase" value={session?.name} onChange={e => handleChange('name', e.target.value)} />
                  <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors mx-auto md:mx-0"><LogOut className="w-4 h-4" /> Выйти</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <ProfileField label="Проект / Компания" icon={Building} value={session?.companyName || ''} onChange={(v: string) => handleChange('companyName', v)} />
                <ProfileField label="Оборот / Уровень млн." icon={PieChart} value={session?.turnover || ''} onChange={(v: string) => handleChange('turnover', v)} />
                <ProfileField label="Город" icon={MapPin} value={session?.city || ''} onChange={(v: string) => handleChange('city', v)} />
                <ProfileField label="Лимит встреч ч/мес" icon={CalendarIcon} value={session?.timeLimit || ''} onChange={(v: string) => handleChange('timeLimit', v)} />
                <div className="md:col-span-2 space-y-3">
                   <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest font-syne"><Briefcase className="w-3 h-3" /> Моя ниша экспертизы</label>
                   <input value={session?.direction || ''} onChange={e => handleChange('direction', e.target.value)} className="w-full bg-white/5 p-5 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 border border-transparent" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
               <button onClick={onSaveProfile} disabled={isSavingProfile} className="bg-white text-black px-12 py-6 rounded-[24px] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3">
                  {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Обновить анкету
               </button>
            </div>
          </div>

          <div className="space-y-10">
            {mentorProfile && (
              <div className="bg-[#0a0a0b] p-8 rounded-[48px] shadow-3xl space-y-8 border border-white/5">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <CalendarIcon className="w-6 h-6 text-indigo-500" />
                  <h3 className="text-2xl font-black text-white font-syne">Свободные окна</h3>
                </div>
                <SlotCalendar selectedSlots={JSON.parse(mentorProfile.slots || "{}")} onChange={slots => onUpdateMentorProfile({...mentorProfile, slots: JSON.stringify(slots)})} accentColor="indigo" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'impact' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[48px] p-12 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                    <Heart className="w-64 h-64" />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-100">Привлечено в копилку платформы</p>
                    <h2 className="text-6xl md:text-8xl font-black font-syne tracking-tighter leading-none">
                      {totalImpact} <span className="text-2xl opacity-50">₽</span>
                    </h2>
                 </div>
                 <div className="pt-12 relative z-10">
                    <p className="text-lg font-medium text-indigo-100 max-w-md">Вы провели {transactions.length} встреч, помогая молодым талантам расти. Все средства направлены на развитие образовательных инициатив ШАГа.</p>
                 </div>
              </div>

              <div className="bg-[#0a0a0b] border border-white/5 rounded-[48px] p-10 flex flex-col justify-center space-y-8 text-center">
                 <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-500">
                    <Zap className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase font-syne">Энергообмен</h3>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">Ваше время — это самый ценный ресурс, который вы вкладываете в будущее.</p>
              </div>
           </div>

           <div className="bg-[#0a0a0b] border border-white/5 rounded-[48px] p-10 space-y-10">
              <h3 className="text-xl font-black text-white uppercase font-syne">История ваших ШАГов</h3>
              <div className="space-y-4">
                 {transactions.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                       <CalendarIcon className="w-12 h-12 mx-auto" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Встреч пока не было</p>
                    </div>
                 ) : (
                    transactions.map(tx => (
                       <div key={tx.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Zap className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-white font-bold">{tx.description}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-black text-white">{tx.amount} ₽</p>
                             <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Передано платформе</span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}
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
