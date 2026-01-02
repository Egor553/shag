
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Edit3, X, ShieldCheck, Briefcase, 
  Loader2, RefreshCw, Eye, Check, XCircle, Clock, Trash2
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
      alert("Ошибка загрузки данных админ-панели. Проверьте консоль.");
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
      await loadAdminData(); // Перезагружаем реестр
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Синхронизация глобального реестра...</p>
    </div>
  );

  const pendingCount = registry?.users.filter(u => u.status === 'pending').length || 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] bg-[#050505] rounded-[48px] overflow-hidden border border-white/5 shadow-3xl">
      <aside className="w-full lg:w-64 bg-[#0a0a0b] border-r border-white/5 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-8 px-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
           </div>
           <span className="font-black text-[10px] uppercase tracking-widest text-white">ROOT PANEL</span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { id: 'stats', label: 'Обзор', icon: TrendingUp },
            { id: 'moderation', label: 'Модерация', icon: Clock, badge: pendingCount },
            { id: 'users', label: 'Участники', icon: Users },
            { id: 'services', label: 'ШАГи', icon: Layers },
            { id: 'jobs', label: 'Вакансии', icon: Briefcase },
            { id: 'bookings', label: 'Встречи', icon: Calendar },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as any); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={14} />
              {item.label}
              {item.badge ? <span className="ml-auto bg-amber-500 text-black px-1.5 py-0.5 rounded text-[7px]">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="flex items-center justify-between">
            <h2 className="text-3xl font-black font-syne uppercase tracking-tighter text-white">
              {activeView === 'stats' && 'Общая статистика'}
              {activeView === 'moderation' && 'Заявки на вход'}
              {activeView === 'users' && 'База участников'}
              {activeView === 'services' && 'Все услуги (ШАГи)'}
              {activeView === 'jobs' && 'Все вакансии'}
              {activeView === 'bookings' && 'Все записи'}
            </h2>
            <button onClick={loadAdminData} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
              <RefreshCw size={18} />
            </button>
          </header>

          {activeView === 'stats' && registry && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AdminStatCard label="Всего пользователей" value={registry.users.length} icon={Users} />
              <AdminStatCard label="Активных ШАГов" value={registry.services.length} icon={Layers} />
              <AdminStatCard label="Проведено встреч" value={registry.bookings.length} icon={Calendar} />
              <AdminStatCard label="Всего вакансий" value={registry.jobs.length} icon={Briefcase} />
              <AdminStatCard label="На модерации" value={pendingCount} icon={Clock} highlight={pendingCount > 0} />
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
                  placeholder="Быстрый поиск по базе..."
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-[#0a0a0b] border border-white/5 rounded-[32px] overflow-hidden">
                <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
                  <thead className="bg-white/5 border-b border-white/5 text-slate-500">
                    <tr>
                      <th className="p-5">Наименование / Имя</th>
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
                          <p className="text-[8px] text-slate-500 opacity-60 lowercase">{item.email || item.mentorName || item.category}</p>
                        </td>
                        <td className="p-5 text-slate-400">{item.role || item.format || item.category || '—'}</td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded-md text-[8px] ${item.status === 'active' || item.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                           <button onClick={() => setInspectingUser(item)} className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye size={14} className="text-slate-400" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getFilteredData().length === 0 && (
                   <div className="p-20 text-center opacity-20 uppercase font-black text-[10px] tracking-[0.5em]">Данные отсутствуют</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {inspectingUser && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6">
           <div className="w-full max-w-4xl bg-[#050505] rounded-[48px] border border-white/10 p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <button onClick={() => setInspectingUser(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={32}/></button>
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

const AdminStatCard = ({ label, value, icon: Icon, highlight }: any) => (
  <div className={`p-8 bg-[#0a0a0b] border rounded-[32px] space-y-4 ${highlight ? 'border-amber-500/30' : 'border-white/5'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highlight ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-500'}`}>
      <Icon size={24} />
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-white font-syne tracking-tighter">{value}</p>
    </div>
  </div>
);
