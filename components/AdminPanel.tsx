
import React, { useState, useEffect } from 'react';
import {
  Users, Layers, Calendar, TrendingUp, Search,
  X, ShieldCheck, Briefcase, Star, User,
  Loader2, RefreshCw, Eye, XCircle, Clock, Heart, Menu
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { EntrepreneurProfile } from './profiles/EntrepreneurProfile';
import { YouthProfile } from './profiles/YouthProfile';
import { ModerationView } from './admin/ModerationView';
import { UserRole, UserSession, Service, Job, Booking, Transaction } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  session: UserSession;
}

const AdminStatCard = ({ label, value, icon: Icon, highlight, suffix }: any) => (
  <div className={`p-5 md:p-8 rounded-3xl border transition-all ${highlight ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20 shadow-xl'}`}>
    <div className="flex items-center gap-4 md:gap-5">
      <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${highlight ? 'bg-white text-indigo-600' : 'bg-white/10 text-white'}`}>
        <Icon size={20} className="md:w-8 md:h-8" />
      </div>
      <div>
        <p className={`text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${highlight ? 'text-white/70' : 'text-slate-500'}`}>{label}</p>
        <p className={`text-xl md:text-4xl font-black font-syne tracking-tighter text-white`}>
          {value.toLocaleString()} {suffix && <span className="text-xs opacity-50">{suffix}</span>}
        </p>
      </div>
    </div>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, session }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings' | 'moderation' | 'mentors'>('stats');
  const [registry, setRegistry] = useState<{
    users: UserSession[];
    services: Service[];
    bookings: Booking[];
    jobs: Job[];
    transactions: Transaction[];
    reviews: any[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectingUser, setInspectingUser] = useState<UserSession | null>(null);

  // ... (loadAdminData remains same)

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFullRegistry();
      setRegistry(data as any);
    } catch (e) {
      console.error("Admin Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (user: UserSession, status: 'active' | 'rejected') => {
    try {
      const res = status === 'active'
        ? await adminService.approveUser(user.email)
        : await adminService.rejectUser(user.email);

      if (res.result !== 'success') {
        throw new Error(res.message || `Ошибка модерации: ${status}`);
      }
      await loadAdminData();
    } catch (e: any) {
      alert(e.message || "Ошибка при выполнении операции");
    }
  };

  if (loading || !registry) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Синхронизация Root реестра...</p>
      </div>
    );
  }

  const mentors = registry.users.filter(u => u.role === UserRole.ENTREPRENEUR && u.status === 'active');
  const pendingUsers = registry.users.filter(u => u.status === 'pending');
  const totalRevenue = registry.transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  const getMentorRating = (mentorEmail: string) => {
    const revs = registry.reviews?.filter(r => r.mentor_id === mentorEmail || r.mentorId === mentorEmail) || [];
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / revs.length).toFixed(1);
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">ROOT_ADMIN_TERMINAL</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter leading-none">
            ПАНЕЛЬ<br /><span className="text-white/20 italic">УПРАВЛЕНИЯ</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <button onClick={loadAdminData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
            <RefreshCw size={20} />
          </button>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveView('stats')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'stats' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Статистика
            </button>
            <button
              onClick={() => setActiveView('mentors')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'mentors' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Рейтинги
            </button>
            <button
              onClick={() => setActiveView('moderation')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeView === 'moderation' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Модерация
              {pendingUsers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] text-white border-2 border-[#1a1d23]">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeView === 'stats' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard label="Всего участников" value={registry.users.length} icon={Users} />
            <AdminStatCard label="Активные ШАГи" value={registry.services.length} icon={Layers} />
            <AdminStatCard label="Бизнес-миссии" value={registry.jobs.length} icon={Briefcase} />
            <AdminStatCard label="Общий Оборот" value={totalRevenue} icon={TrendingUp} highlight suffix="₽" />
          </div>

          <div className="bg-[#0a0a0b] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h3 className="text-2xl font-black text-white uppercase font-syne">Последние транзакции</h3>
              <TrendingUp className="text-indigo-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                    <th className="px-10 py-6">Дата</th>
                    <th className="px-10 py-6">Сумма</th>
                    <th className="px-10 py-6">Статус</th>
                    <th className="px-10 py-6">Описание</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registry.transactions.slice(0, 10).map((tx, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6 text-xs text-white/60 font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-10 py-6 text-sm font-black text-white uppercase">
                        {tx.amount.toLocaleString()} ₽
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-xs text-slate-500 italic">
                        {tx.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeView === 'mentors' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-[#0a0a0b] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h3 className="text-2xl font-black text-white uppercase font-syne">Рейтинги Менторов</h3>
              <Heart className="text-indigo-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                    <th className="px-10 py-6">Ментор</th>
                    <th className="px-10 py-6">Специализация</th>
                    <th className="px-10 py-6 text-center">Рейтинг</th>
                    <th className="px-10 py-6">Отзывы</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mentors.map((m, i) => {
                    const rating = getMentorRating(m.email);
                    const mentorReviews = registry.reviews?.filter(r => r.mentor_id === m.email || r.mentorId === m.email) || [];
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                <User size={16} />
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <p className="text-sm font-black text-white uppercase">{m.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-white/60 uppercase tracking-widest">
                            {m.direction || '—'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-lg font-black ${Number(rating) >= 4.5 ? 'text-amber-400' : 'text-white'}`}>
                              {Number(rating) > 0 ? rating : 'NEW'}
                            </span>
                            {Number(rating) > 0 && <Star size={14} className="text-amber-400 fill-amber-400" />}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-xs text-slate-500 italic truncate max-w-xs">
                            {mentorReviews.length > 0
                              ? `"${mentorReviews[0].comment}"`
                              : 'Нет отзывов'}
                            {mentorReviews.length > 1 && <span className="ml-2 text-[10px] text-indigo-500 not-italic">+{mentorReviews.length - 1}</span>}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === 'moderation' && (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <ModerationView
            pendingUsers={pendingUsers}
            onApprove={(u) => handleModeration(u, 'active')}
            onReject={(u) => handleModeration(u, 'rejected')}
            onInspect={(u) => setInspectingUser(u)}
          />
        </div>
      )}

      {inspectingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-5xl h-[90vh] bg-[#1a1d23] rounded-[64px] border border-white/10 shadow-3xl overflow-y-auto no-scrollbar relative p-10 md:p-20">
            <button onClick={() => setInspectingUser(null)} className="absolute top-10 right-10 p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
              <X size={32} />
            </button>

            {inspectingUser.role === UserRole.ENTREPRENEUR ? (
              <EntrepreneurProfile
                session={inspectingUser}
                mentorProfile={inspectingUser as any}
                isSavingProfile={false}
                onSaveProfile={() => { }}
                onUpdateMentorProfile={() => { }}
                onLogout={() => { }}
                onUpdateAvatar={() => { }}
                onSessionUpdate={() => { }}
              />
            ) : (
              <YouthProfile
                session={inspectingUser}
                onCatalogClick={() => { }}
                onLogout={() => { }}
                onUpdateAvatar={() => { }}
                onSessionUpdate={() => { }}
                onSaveProfile={() => { }}
                isSavingProfile={false}
              />
            )}

            <div className="sticky bottom-0 mt-20 pt-10 border-t border-white/10 bg-[#1a1d23] flex gap-6">
              <button
                onClick={() => { handleModeration(inspectingUser, 'active'); setInspectingUser(null); }}
                className="flex-1 bg-emerald-600 text-white py-6 rounded-[32px] font-black uppercase text-sm tracking-widest shadow-2xl"
              >
                Одобрить анкету
              </button>
              <button
                onClick={() => { handleModeration(inspectingUser, 'rejected'); setInspectingUser(null); }}
                className="flex-1 bg-red-600 text-white py-6 rounded-[32px] font-black uppercase text-sm tracking-widest"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
