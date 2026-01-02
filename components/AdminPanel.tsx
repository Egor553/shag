
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Trash2, Edit3, X, Save, ShieldCheck, Briefcase, 
  Loader2, AlertTriangle, RefreshCw, CreditCard, Copy, CheckCircle, Key, Lock, LogOut, Menu, Trash, Eye
} from 'lucide-react';
import { dbService, WEBHOOK_URL } from '../services/databaseService';
import { EntrepreneurProfile } from './profiles/EntrepreneurProfile';
import { YouthProfile } from './profiles/YouthProfile';
import { UserRole, UserSession, Mentor, Service, Job, Booking, Transaction } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  session: UserSession;
  allMentors: Mentor[];
  services: Service[];
  jobs: Job[];
  bookings: Booking[];
  transactions: Transaction[];
  onUpdateMentorProfile: (profile: Mentor) => void;
  onSaveProfile: (updates?: Partial<UserSession>) => void;
  onSaveService: (s: Partial<Service>) => Promise<void>;
  onUpdateService: (id: string, updates: Partial<Service>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onUpdateAvatar: (url: string) => Promise<void>;
  onSessionUpdate: (session: UserSession) => void;
  onRefresh?: () => void;
  onSaveJob: (j: Partial<Job>) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onLogout, session, allMentors, services, jobs, bookings, transactions,
  onUpdateMentorProfile, onSaveProfile, onSaveService, onUpdateService,
  onDeleteService, onUpdateAvatar, onSessionUpdate, onRefresh, onSaveJob, onDeleteJob
}) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings' | 'payments'>('stats');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserSession | null>(null);
  
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await dbService.syncData();
      setData(res);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      if (editingItem.type === 'user') {
        await dbService.updateProfile(editingItem.data.email, editingItem.data);
      } else if (editingItem.type === 'service') {
        await dbService.updateService(editingItem.data.id, editingItem.data);
      } else if (editingItem.type === 'job') {
        await dbService.updateJob(editingItem.data.id, editingItem.data);
      } else if (editingItem.type === 'booking') {
        await dbService.updateBookingStatus(editingItem.data.id, editingItem.data.status);
      }
      await fetchAdminData();
      setEditingItem(null);
    } catch (e) {
      alert("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (type: string, id: string, email?: string) => {
    const displayType = type === 'user' ? 'пользователя' : (type === 'service' ? 'услугу' : (type === 'job' ? 'миссию' : 'встречу'));
    if (!confirm(`Вы уверены, что хотите безвозвратно удалить ${displayType}?`)) return;
    
    const targetId = type === 'user' ? (email || id) : id;
    setIsDeleting(targetId);

    try {
      let res;
      if (type === 'user') {
        res = await dbService.postAction({ action: 'delete_user', email: targetId });
      } else if (type === 'service') {
        res = await dbService.deleteService(targetId);
      } else if (type === 'job') {
        res = await dbService.deleteJob(targetId);
      } else if (type === 'booking') {
        res = await dbService.deleteBooking(targetId);
      }

      if (res && res.result === 'success') {
        await fetchAdminData();
      } else {
        alert("Удаление не удалось.");
      }
    } catch (e) {
      alert("Ошибка сети при удалении");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearAll = async () => {
    const typeMap: any = { services: 'services', jobs: 'jobs', bookings: 'bookings' };
    const type = typeMap[activeView];
    if (!type) return;

    if (!confirm(`ВНИМАНИЕ: Это удалит ВСЕ записи из раздела ${activeView}. Продолжить?`)) return;
    
    setLoading(true);
    try {
      const res = await dbService.clearAll(type);
      if (res.result === 'success') {
        await fetchAdminData();
      } else {
        alert("Ошибка при массовой очистке");
      }
    } catch (e) {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = () => {
    if (!data) return [];
    const term = searchTerm.toLowerCase();
    const safeStr = (v: any) => (v?.toString() || '').toLowerCase();

    switch(activeView) {
      case 'users': return (data.dynamicMentors || []).filter((u: any) => safeStr(u.name).includes(term) || safeStr(u.email).includes(term));
      case 'services': return (data.services || []).filter((s: any) => safeStr(s.title).includes(term) || safeStr(s.mentorName).includes(term));
      case 'jobs': return (data.jobs || []).filter((j: any) => safeStr(j.title).includes(term) || safeStr(j.mentorName).includes(term));
      case 'bookings': return (data.bookings || []).filter((b: any) => safeStr(b.userName).includes(term) || safeStr(b.serviceTitle).includes(term));
      default: return [];
    }
  };

  const showClearAllButton = ['services', 'jobs', 'bookings'].includes(activeView);

  if (inspectingUser) {
    const userRole = inspectingUser.role;
    const isInspectedMentor = userRole === UserRole.ENTREPRENEUR;
    const userMentorProfile = allMentors.find(m => m.email === inspectingUser.email) || null;
    const userServices = services.filter(s => String(s.mentorId) === String(inspectingUser.id) || s.mentorId === inspectingUser.email);
    const userJobs = jobs.filter(j => String(j.mentorId) === String(inspectingUser.id) || j.mentorId === inspectingUser.email);
    const userBookings = bookings.filter(b => b.mentorId === inspectingUser.id || b.mentorId === inspectingUser.email || b.userEmail === inspectingUser.email);
    const userTransactions = transactions.filter(t => t.userId === inspectingUser.id || t.userId === inspectingUser.email);

    return (
      <div className="fixed inset-0 z-[150] bg-[#050505] overflow-y-auto no-scrollbar pb-20">
        <div className="sticky top-0 bg-indigo-600 p-4 flex items-center justify-between z-50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/20 rounded-lg text-white text-[10px] font-black uppercase">Root View</div>
            <p className="text-white font-bold text-sm">Просмотр профиля: {inspectingUser.name}</p>
          </div>
          <button onClick={() => setInspectingUser(null)} className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-black uppercase text-xs">Выйти из режима просмотра</button>
        </div>

        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {isInspectedMentor ? (
            <EntrepreneurProfile 
              session={inspectingUser} 
              mentorProfile={userMentorProfile as Mentor} 
              isSavingProfile={false} 
              onSaveProfile={() => {}} 
              onUpdateMentorProfile={() => {}} 
              onLogout={() => {}} 
              onUpdateAvatar={() => {}} 
              onSessionUpdate={() => {}} 
              transactions={userTransactions}
              bookings={userBookings}
              services={userServices}
              jobs={userJobs}
            />
          ) : (
            <YouthProfile 
              session={inspectingUser} 
              onCatalogClick={() => {}} 
              onLogout={() => {}} 
              onUpdateAvatar={() => {}} 
              onSessionUpdate={() => {}} 
              onSaveProfile={() => {}} 
              isSavingProfile={false}
              bookings={userBookings}
            />
          )}
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="h-full min-h-screen flex items-center justify-center bg-[#050505] p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-indigo-600 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute inset-0 m-auto w-6 h-6 text-indigo-500" />
        </div>
        <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Загрузка данных...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
      <div className="lg:hidden flex items-center justify-between p-6 bg-[#0a0a0b] border-b border-white/5 sticky top-0 z-[110]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-widest">ШАГ ROOT</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
           {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed lg:relative inset-0 z-[100] lg:z-10
        w-full lg:w-72 bg-[#0a0a0b] border-r border-white/5 flex flex-col p-8 space-y-2 shrink-0
        transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex items-center gap-4 mb-12 px-2">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <div>
              <span className="font-black text-xs tracking-tight uppercase block leading-none">ШАГ ROOT</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">v3.0 Profiler</span>
           </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          {[
            { id: 'stats', label: 'Обзор', icon: TrendingUp },
            { id: 'users', label: 'Участники', icon: Users },
            { id: 'services', label: 'ШАГи', icon: Layers },
            { id: 'jobs', label: 'Миссии', icon: Briefcase },
            { id: 'bookings', label: 'Встречи', icon: Calendar },
            { id: 'payments', label: 'ЮKassa', icon: CreditCard },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-white' : 'text-slate-600'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
           <button onClick={onLogout} className="w-full flex items-center gap-4 p-5 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
             <LogOut className="w-4 h-4" /> Выйти
           </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto bg-[#050505] pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
          
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl lg:text-4xl font-black font-syne uppercase tracking-tighter">
              {activeView === 'stats' && 'Обзор платформы'}
              {activeView === 'users' && 'Участники'}
              {activeView === 'services' && 'Каталог ШАГов'}
              {activeView === 'jobs' && 'Миссии'}
              {activeView === 'bookings' && 'Встречи'}
              {activeView === 'payments' && 'ЮKassa'}
            </h2>
            <div className="flex gap-3">
              {showClearAllButton && (
                <button onClick={handleClearAll} className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                  <Trash className="w-3.5 h-3.5" /> Очистить раздел
                </button>
              )}
              <button onClick={fetchAdminData} className="flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Обновить
              </button>
            </div>
          </header>

          {activeView === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
               <StatBox label="Участников" value={data?.dynamicMentors?.length} color="indigo" />
               <StatBox label="Всего ШАГов" value={data?.services?.length} color="violet" />
               <StatBox label="Миссий" value={data?.jobs?.length} color="pink" />
               <StatBox label="Встреч" value={data?.bookings?.length} color="emerald" />
            </div>
          )}

          {activeView !== 'stats' && activeView !== 'payments' && (
             <div className="bg-[#0a0a0b] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                   <Search className="w-5 h-5 text-slate-600" />
                   <input 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Поиск по названию или email..." 
                     className="bg-transparent text-sm outline-none flex-1 text-white font-bold placeholder:text-slate-700" 
                   />
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-[11px] min-w-[600px]">
                     <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="p-6 font-black uppercase text-slate-500 tracking-widest">Объект</th>
                          <th className="p-6 font-black uppercase text-slate-500 tracking-widest">Тип/Категория</th>
                          <th className="p-6 font-black uppercase text-slate-500 tracking-widest">Статус</th>
                          <th className="p-6 text-right font-black uppercase text-slate-500 tracking-widest">Действие</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredData().map((item: any) => {
                          const type = activeView === 'users' ? 'user' : (activeView === 'services' ? 'service' : (activeView === 'jobs' ? 'job' : 'booking'));
                          const itemId = item.id || item.email;
                          const isCurrentlyDeleting = isDeleting === itemId;

                          return (
                            <tr key={itemId} className="hover:bg-white/[0.02] transition-colors group">
                               <td className="p-6">
                                  <p className="font-black text-white uppercase text-xs tracking-tight">{item.title || item.name || 'Без названия'}</p>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{item.email || item.id}</p>
                               </td>
                               <td className="p-6">
                                  <p className="font-black text-slate-400 uppercase tracking-widest">{item.role || item.category || '—'}</p>
                               </td>
                               <td className="p-6">
                                  <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'text-emerald-500 border-emerald-500/20' : 'text-slate-400'}`}>
                                    {item.status || 'Active'}
                                  </span>
                               </td>
                               <td className="p-6 text-right">
                                  <div className="flex justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                     {type === 'user' && (
                                       <button onClick={() => setInspectingUser(item)} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                                          <Eye className="w-4 h-4" /> <span className="text-[8px] font-black uppercase">Профиль</span>
                                       </button>
                                     )}
                                     <button onClick={() => setEditingItem({ type, data: {...item} })} className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                        <Edit3 className="w-4 h-4" />
                                     </button>
                                     <button 
                                       disabled={isCurrentlyDeleting}
                                       onClick={() => handleDelete(type, item.id, item.email)} 
                                       className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                                     >
                                        {isCurrentlyDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </main>

      {editingItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-[#0a0a0b] border border-white/10 p-8 rounded-[40px] space-y-8 shadow-3xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-syne uppercase">Правка {editingItem.type}</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Название</label>
                   <input 
                     value={editingItem.data.title || editingItem.data.name || ''} 
                     onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.title ? 'title' : 'name']: e.target.value}})}
                     className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-indigo-600" 
                   />
                </div>
                {editingItem.type === 'booking' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус</label>
                    <select 
                      value={editingItem.data.status}
                      onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, status: e.target.value}})}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold outline-none"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="confirmed">Подтверждено</option>
                      <option value="cancelled">Отменено</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </div>
                )}
             </div>

             <div className="flex gap-4">
                <button onClick={() => setEditingItem(null)} className="flex-1 py-5 rounded-xl font-black uppercase text-[10px] text-slate-500">Отмена</button>
                <button onClick={handleUpdate} className="flex-[2] bg-indigo-600 text-white py-5 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-3">
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Сохранить
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, color }: any) => {
  const colorClasses: any = {
    indigo: 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5',
    violet: 'border-violet-500/20 text-violet-500 bg-violet-500/5',
    pink: 'border-pink-500/20 text-pink-500 bg-pink-500/5',
    emerald: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5',
  };

  return (
    <div className={`border p-8 rounded-[32px] space-y-2 ${colorClasses[color]}`}>
       <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
       <p className="text-4xl font-black text-white font-syne tracking-tighter leading-none">{value || 0}</p>
    </div>
  );
};
