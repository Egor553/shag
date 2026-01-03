
import React, { useState } from 'react';
import { UserSession, Mentor, Transaction, Booking, Service, Job } from '../../types';
import { 
  Briefcase, Calendar as CalendarIcon, Save, Loader2, 
  User, MapPin, Building, LogOut, Camera, 
  Link as LinkIcon, Star, PieChart, Heart, Zap, CheckCircle, Target, Users
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
  bookings?: Booking[];
  services?: Service[];
  jobs?: Job[];
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
  transactions = [],
  bookings = [],
  services = [],
  jobs = []
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

  const myBookings = bookings.filter(b => b.mentorId === session.id || b.mentorId === session.email);
  const activeBookings = myBookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date());
  const myServices = services.filter(s => s.mentorId === session.id || s.mentorId === session.email);
  const myJobs = jobs.filter(j => j.mentorId === session.id || j.mentorId === session.email);
  const totalImpact = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

  const isScheduleFresh = () => {
    if (!session.lastWeeklyUpdate) return false;
    const last = new Date(session.lastWeeklyUpdate);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return last > oneWeekAgo;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2 rounded-[32px] w-fit border border-white/20 backdrop-blur-3xl shadow-2xl">
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeSubTab === 'profile' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          <User className="w-4 h-4" /> Профиль
        </button>
        <button 
          onClick={() => setActiveSubTab('impact')}
          className={`px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeSubTab === 'impact' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
        >
          <Heart className="w-4 h-4" /> Мой Вклад
        </button>
      </div>

      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-[#0a0a0b] p-8 md:p-16 rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-12 mb-16 pb-14 border-b border-white/10">
                <div className="relative group shrink-0">
                  <div className="w-48 h-48 bg-[#1d2127] rounded-[56px] overflow-hidden border-4 border-white/10 shadow-2xl relative transition-transform hover:scale-105 duration-500">
                    {session?.paymentUrl ? (
                      <img src={session.paymentUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-8xl font-black font-syne">
                        {session?.name ? session.name[0] : 'U'}
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowPhotoInput(!showPhotoInput)} className="absolute -bottom-2 -right-2 bg-white text-black p-4 rounded-2xl shadow-2xl hover:bg-slate-100 transition-all z-10"><Camera className="w-6 h-6" /></button>
                  {showPhotoInput && (
                    <div className="absolute top-full mt-6 left-0 w-80 bg-[#121214] p-6 rounded-[32px] shadow-3xl border border-white/20 z-20 animate-in zoom-in-95">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4 font-syne">Ссылка на аватар</p>
                      <div className="flex gap-3">
                        <input value={tempPhotoUrl} onChange={(e) => setTempPhotoUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-white/10 p-4 rounded-xl text-xs text-white outline-none focus:ring-1 ring-white font-bold" />
                        <button onClick={handleAvatarSubmit} className="bg-white text-black p-4 rounded-xl"><LinkIcon className="w-5 h-5"/></button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-6">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-6 py-2.5 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 border border-white/10">
                      <Briefcase className="w-3.5 h-3.5" /> Участник ШАГа
                    </span>
                    <span className="px-5 py-2.5 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-3 border border-white/10">
                      <Star className="w-3.5 h-3.5 text-white" /> {session.rating || '5.0'}
                    </span>
                  </div>
                  <input className="w-full bg-transparent text-5xl md:text-7xl font-black text-white tracking-tighter leading-none outline-none focus:text-white/80 transition-colors font-syne uppercase" value={session?.name} onChange={e => handleChange('name', e.target.value)} />
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <button onClick={onLogout} className="flex items-center gap-3 text-white/40 hover:text-red-500 font-black text-[11px] uppercase tracking-widest transition-colors"><LogOut className="w-4 h-4" /> Выйти из системы</button>
                    {isScheduleFresh() && (
                      <div className="flex items-center gap-2.5 text-white text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full border border-white/10">
                        <CheckCircle className="w-3.5 h-3.5 shadow-[0_0_5px_white]" /> Расписание Актуально
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
                <ProfileField label="Проект / Компания" icon={Building} value={session?.companyName || ''} onChange={(v: string) => handleChange('companyName', v)} />
                <ProfileField label="Оборот / Уровень" icon={PieChart} value={session?.turnover || ''} onChange={(v: string) => handleChange('turnover', v)} />
                <ProfileField label="Город Базирования" icon={MapPin} value={session?.city || ''} onChange={(v: string) => handleChange('city', v)} />
                <ProfileField label="Лимит встреч / мес" icon={CalendarIcon} value={session?.timeLimit || ''} onChange={(v: string) => handleChange('timeLimit', v)} />
                <div className="md:col-span-2 space-y-4">
                   <label className="flex items-center gap-3 text-[10px] font-black text-white/50 uppercase tracking-[0.5em] font-syne"><Briefcase className="w-4 h-4" /> МОЯ НИША ЭКСПЕРТИЗЫ</label>
                   <input value={session?.direction || ''} onChange={e => handleChange('direction', e.target.value)} className="w-full bg-white/5 p-6 rounded-[28px] text-white font-black text-lg outline-none focus:border-white border border-white/10 transition-all uppercase tracking-tight" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickStat label="Активные ШАГи" value={myServices.length} icon={Zap} />
              <QuickStat label="Открытые Миссии" value={myJobs.length} icon={Target} />
              <QuickStat label="Новые Записи" value={activeBookings.length} icon={Users} />
            </div>

            <div className="flex justify-end pt-4">
               <button onClick={onSaveProfile} disabled={isSavingProfile} className="bg-white text-black px-16 py-8 rounded-[32px] font-black uppercase text-xs tracking-[0.5em] hover:scale-105 transition-all flex items-center gap-5 shadow-2xl">
                  {isSavingProfile ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                  ОБНОВИТЬ_ДАННЫЕ
               </button>
            </div>
          </div>

          <div className="space-y-10">
            {mentorProfile && (
              <div className="bg-[#0a0a0b] p-10 rounded-[64px] shadow-3xl space-y-10 border border-white/10 backdrop-blur-3xl">
                <div className="flex items-center gap-5 border-b border-white/10 pb-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <CalendarIcon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase font-syne tracking-tight">Свободные окна</h3>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">SYNC_STATUS: {session.lastWeeklyUpdate ? new Date(session.lastWeeklyUpdate).toLocaleDateString() : 'WAITING'}</p>
                  </div>
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
              <div className="md:col-span-2 bg-white p-12 md:p-20 rounded-[80px] text-black flex flex-col justify-between relative overflow-hidden group shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                 <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                    <Heart className="w-80 h-80" />
                 </div>
                 <div className="space-y-6 relative z-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-black/50">PLATFORM_CREDITS_TOTAL</p>
                    <h2 className="text-7xl md:text-[10rem] font-black font-syne tracking-tighter leading-none">
                      {totalImpact.toLocaleString()} <span className="text-3xl opacity-30">₽</span>
                    </h2>
                 </div>
                 <div className="pt-16 relative z-10">
                    <p className="text-xl md:text-2xl font-bold text-black/80 max-w-lg leading-snug">Вы провели {transactions.length} встреч, помогая менторам расти. Все средства направлены в развитие экосистемы ШАГа.</p>
                 </div>
              </div>

              <div className="bg-[#0a0a0b] border border-white/10 rounded-[80px] p-12 flex flex-col justify-center space-y-10 text-center shadow-2xl">
                 <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Zap className="w-12 h-12" />
                 </div>
                 <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tight">Энергообмен</h3>
                   <p className="text-white/40 text-base font-medium leading-relaxed italic">«Ваше время — это самый ценный ресурс, который вы вкладываете в будущее.»</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const QuickStat = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 flex items-center gap-6 shadow-xl hover:border-white/20 transition-all">
    <div className="w-14 h-14 bg-white/10 rounded-[24px] flex items-center justify-center text-white shadow-inner">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className="text-3xl font-black text-white font-syne tracking-tighter">{value}</p>
    </div>
  </div>
);

const ProfileField = ({ label, icon: Icon, value, onChange }: any) => (
  <div className="space-y-4">
    <label className="flex items-center gap-3 text-[10px] font-black text-white/50 uppercase tracking-[0.5em] font-syne">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <input 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/[0.04] p-6 rounded-[24px] text-white font-black text-lg outline-none focus:border-white/50 border border-white/10 transition-all shadow-inner"
    />
  </div>
);
