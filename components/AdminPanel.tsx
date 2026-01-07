
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Edit3, X, ShieldCheck, Briefcase, 
  Loader2, RefreshCw, Eye, Check, XCircle, Clock, Trash2, ChevronRight, Heart, AlertCircle, Zap
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { EntrepreneurProfile } from './profiles/EntrepreneurProfile';
import { YouthProfile } from './profiles/YouthProfile';
import { ModerationView } from './admin/ModerationView';
import { UserRole, UserSession, Mentor, Service, Job, Booking, Transaction } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  session: UserSession;
}

const AdminStatCard = ({ label, value, icon: Icon, highlight, suffix }: any) => (
  <div className={`p-6 md:p-8 rounded-3xl border transition-all ${highlight ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20 shadow-xl'}`}>
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${highlight ? 'bg-white text-indigo-600' : 'bg-white/10 text-white'}`}>
        <Icon size={24} className="md:w-8 md:h-8" />
      </div>
      <div>
        <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${highlight ? 'text-white/70' : 'text-slate-500'}`}>{label}</p>
        <p className={`text-2xl md:text-4xl font-black font-syne tracking-tighter text-white`}>
          {value.toLocaleString()} {suffix && <span className="text-sm opacity-50">{suffix}</span>}
        </p>
      </div>
    </div>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, session }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings' | 'moderation'>('stats');
  const [registry, setRegistry] = useState<{
    users: UserSession[];
    services: Service[];
    bookings: Booking[];
    jobs: Job[];
    transactions: Transaction[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectingUser, setInspectingUser] = useState<UserSession | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFullRegistry();
      setRegistry(data);
    } catch (e) {
      console.error("Admin Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (user: UserSession, status: 'active' | 'rejected') => {
    try {
      if (status === 'active') {
        const res = await adminService.approveUser(user.email);
        if (res.result !== 'success') throw new Error(res.message);
      } else {
        const res = await adminService.rejectUser(user.email);
        if (res.result !== 'success') throw new Error(res.message);
      }
      await loadAdminData(); 
    } catch (e: any) {
      alert("Не удалось обновить статус: " + e.message);
    }
  };

  const getFilteredData = () => {
    if (!registry) return [];
    const term = searchTerm.toLowerCase();
    
    switch(activeView) {
      case 'users': 
        return registry.users.filter(u => u.status === 'active' && (u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)));
      case 'moderation': 
        return registry.users.filter(u => u.status === 'pending');
      case 'services': 
        return registry.services.filter(s => s.title.toLowerCase().includes(term) || s.mentorName.toLowerCase().includes(term));
      case 'jobs': 
        return registry.jobs.filter(j => j.title.toLowerCase().includes(term) || j.mentorName.toLowerCase().includes(term));
      case 'bookings': 
        return registry.bookings.filter(b => (b.userName?.toLowerCase().includes(term) || b.serviceTitle?.toLowerCase().includes(term) || b.mentorName?.toLowerCase().includes(term)));
      default: return [];
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <ShieldCheck className="absolute inset-0 m-auto w-5 h-5 text-indigo-500" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse text-center">Синхронизация глобального реестра...</p>
    </div>
  );

  const pendingCount = registry?.users.filter(u => u.status === 'pending').length || 0;
  const totalFund = registry?.transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0) || 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] bg-[#050505] rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 shadow-3xl mb-24 md:mb-0">
      <aside className="w-full lg:w-64 bg-[#0a0a0b] border-b lg:border-r lg:border-b-0 border-white/5 p-4 md:p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-4 md:mb-8 px-2 shrink-0">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
           </div>
           <span className="font-black text-[10px] uppercase tracking-widest text-white">ROOT_ACCESS</span>
        </div>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0 lg:space-y-1">
          {[
            { id: 'stats', label: 'Аналитика', icon: TrendingUp },
            { id: 'moderation', label: 'Заявки', icon: Clock, badge: pendingCount },
            { id: 'users', label: 'База', icon: Users },
            { id: 'services', label: 'Витрина', icon: Layers },
            { id: 'jobs', label: 'Вакансии', icon: Briefcase },
            { id: 'bookings', label: 'Встречи', icon: Calendar },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as any); setSearchTerm(''); }}
              className={`flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={14} />
              <span className="inline lg:inline">{item.label}</span>
              {item.badge ? <span className="ml-auto bg-amber-500 text-black px-1.5 py-0.5 rounded text-[7px]">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 px-2">
           <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-colors">
              <XCircle size={14} /> ВЫЙТИ
           </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-10">
          
          <header className="flex items-center justify-between">
            <h2 className="text-xl md:text-3xl font-black font-syne uppercase tracking-tighter text-white">
              {activeView === 'stats' && 'Обзор Системы'}
              {activeView === 'moderation' && 'Модерация Менторов'}
              {activeView === 'users' && 'Реестр Участников'}
              {activeView === 'services' && 'Витрина Опыта'}
              {activeView === 'jobs' && 'Рынок Задач'}
              {activeView === 'bookings' && 'Журнал Встреч'}
            </h2>
            <button onClick={loadAdminData} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400">
              <RefreshCw size={18} />
            </button>
          </header>

          {activeView === 'stats' && registry && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <AdminStatCard label="Фонд Энергообмена" value={totalFund} icon={Heart} highlight suffix="₽" />
              <AdminStatCard label="Пользователей" value={registry.users.length} icon={Users} />
              <AdminStatCard label="Записей" value={registry.bookings.length} icon={Calendar} />
              <AdminStatCard label="На модерации" value={pendingCount} icon={Clock} highlight={pendingCount > 0} />
              <AdminStatCard label="Активных ШАГов" value={registry.services.length} icon={Layers} />
              <AdminStatCard label="Открытых Миссий" value={registry.jobs.length} icon={Briefcase} />
            </div>
          )}

          {activeView === 'moderation' && (
            <ModerationView 
              pendingUsers={getFilteredData() as UserSession[]} 
              onApprove={(u) => handleModeration(u, 'active')}
              onReject={(u) => handleModeration(u, 'rejected')}
              onInspect={(u) => setInspectingUser(u)}
            />
          )}

          {activeView !== 'stats' && activeView !== 'moderation' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Поиск по реестру..."
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest min-w-[600px]">
                    <thead className="bg-white/5 border-b border-white/5 text-slate-500">
                      <tr>
                        <th className="p-5">Наименование</th>
                        <th className="p-5">Тип / Роль</th>
                        <th className="p-5">Статус</th>
                        <th className="p-5 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getFilteredData().map((item: any) => (
                        <tr key={item.id || item.email} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="p-5 text-white">
                            <p className="font-black truncate max-w-[200px]">{item.title || item.name || item.userName}</p>
                            <p className="text-[8px] text-slate-500 opacity-60 lowercase truncate max-w-[200px]">{item.email || item.mentorName || item.category}</p>
                          </td>
                          <td className="p-5 text-slate-400">{item.role || item.format || item.category || '—'}</td>
                          <td className="p-5">
                            <span className={`px-2 py-1 rounded-md text-[8px] ${item.status === 'active' || item.status === 'confirmed' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                              {item.status || 'Active'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                             <button onClick={() => setInspectingUser(item)} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white">
                                <Eye size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {getFilteredData().length === 0 && (
                   <div className="p-16 text-center opacity-20 uppercase font-black text-[10px] tracking-[0.5em]">Данные отсутствуют</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {inspectingUser && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
           <div className="w-full max-w-4xl bg-[#050505] rounded-[40px] md:rounded-[48px] border border-white/10 p-6 md:p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <button onClick={() => setInspectingUser(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
              {inspectingUser.role === UserRole.ENTREPRENEUR ? (
                <EntrepreneurProfile 
                  session={inspectingUser} 
                  mentorProfile={null} 
                  isSavingProfile={false}
                  onSaveProfile={()=>{}}
                  onUpdateMentorProfile={()=>{}}
                  onLogout={()=>{}}
                  onUpdateAvatar={()=>{}}
                  onSessionUpdate={()=>{}}
                  bookings={registry?.bookings || []}
                  services={registry?.services || []}
                />
              ) : (
                <YouthProfile 
                  session={inspectingUser}
                  onCatalogClick={()=>{}}
                  onLogout={()=>{}}
                  onUpdateAvatar={()=>{}}
                  onSessionUpdate={()=>{}}
                  onSaveProfile={()=>{}}
                  isSavingProfile={false}
                  bookings={registry?.bookings || []}
                />
              )}
           </div>
        </div>
      )}
    </div>
  );
};
