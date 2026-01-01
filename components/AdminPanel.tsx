
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Filter, MoreVertical, CheckCircle, Clock, 
  ShieldCheck, Briefcase, Zap, Mail, MapPin, 
  ExternalLink, Trash2, Download, Edit3, X, Save, 
  AlertCircle, Send, DollarSign, Target, User as UserIcon,
  Loader2
} from 'lucide-react';
import { dbService } from '../services/databaseService';
import { UserRole, Mentor, Service, Job, Booking } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings'>('stats');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояния для редактирования
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

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Вы уверены? Это действие необратимо.")) return;
    try {
      if (type === 'service') await dbService.deleteService(id);
      if (type === 'job') await dbService.deleteJob(id);
      await fetchAdminData();
    } catch (e) {
      alert("Ошибка при удалении");
    }
  };

  const stats = data ? {
    totalUsers: data.dynamicMentors?.length || 0,
    entrepreneurs: data.dynamicMentors?.filter((m: any) => m.role === UserRole.ENTREPRENEUR).length || 0,
    talents: data.dynamicMentors?.filter((m: any) => m.role === UserRole.YOUTH).length || 0, 
    totalServices: data.services?.length || 0,
    totalBookings: data.bookings?.length || 0
  } : null;

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Масштабируем доступ...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#111114] border-r border-white/5 flex flex-col p-8 z-20">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter">ШАГ-ADMIN</span>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Master Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Обзор', icon: TrendingUp },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'services', label: 'Услуги (ШАГи)', icon: Layers },
            { id: 'jobs', label: 'Миссии (Work)', icon: Briefcase },
            { id: 'bookings', label: 'Журнал встреч', icon: Calendar },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-4 text-red-400 font-bold text-sm hover:bg-red-400/10 rounded-2xl transition-all">
          <Trash2 className="w-5 h-5" /> Выйти
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto no-scrollbar relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-syne leading-none">
              {activeView === 'stats' && 'СИСТЕМА'}
              {activeView === 'users' && 'УЧАСТНИКИ'}
              {activeView === 'services' && 'ШАГИ'}
              {activeView === 'jobs' && 'МИССИИ'}
              {activeView === 'bookings' && 'ЖУРНАЛ'}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Управление всеми параметрами платформы
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Поиск по базе..." 
              className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white text-sm outline-none focus:border-indigo-600 transition-all font-bold"
            />
          </div>
        </header>

        {/* View: Stats */}
        {activeView === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            <StatCard label="Участников" value={stats.totalUsers} icon={Users} trend="+12% нов." />
            <StatCard label="Менторов" value={stats.entrepreneurs} icon={Briefcase} color="indigo" />
            <StatCard label="ШАГов" value={stats.totalServices} icon={Layers} color="violet" />
            <StatCard label="Бронирований" value={stats.totalBookings} icon={Calendar} color="emerald" />
            
            <div className="md:col-span-2 xl:col-span-3 bg-[#111114] border border-white/5 rounded-[40px] p-10 space-y-8">
              <h3 className="text-xl font-black text-white uppercase font-syne">Последние события</h3>
              <div className="space-y-4">
                {data.bookings?.slice(0, 5).map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xs uppercase tracking-tight">{b.userName} → {b.serviceTitle || 'ШАГ'}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase">{b.date} • {b.time}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-1 bg-indigo-600 rounded-[40px] p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl">
               <ShieldCheck className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
               <div className="space-y-4 relative z-10">
                 <h3 className="text-3xl font-black font-syne leading-none">ЯДРО<br/>АКТИВНО</h3>
                 <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest leading-relaxed">Все данные синхронизированы с Google Spreadsheet.</p>
               </div>
               <button onClick={fetchAdminData} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Обновить данные</button>
            </div>
          </div>
        )}

        {/* View: Users */}
        {activeView === 'users' && data && (
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Участник</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Роль</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Проект</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Город</th>
                    <th className="p-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.dynamicMentors?.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u: any) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img src={u.paymentUrl || u.avatarUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                          <div>
                            <p className="text-white font-black text-xs uppercase">{u.name}</p>
                            <p className="text-slate-500 text-[10px] font-bold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase ${u.role === UserRole.YOUTH ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20' : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
                          {u.role === UserRole.YOUTH ? 'Талант' : 'Ментор'}
                        </span>
                      </td>
                      <td className="p-8">
                        <p className="text-white font-bold text-xs uppercase truncate max-w-[150px]">{u.companyName || u.direction || '—'}</p>
                      </td>
                      <td className="p-8">
                        <span className="text-slate-400 font-bold text-xs uppercase">{u.city || '—'}</span>
                      </td>
                      <td className="p-8 text-right space-x-2">
                        <button onClick={() => setEditingItem({ type: 'user', data: {...u} })} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => alert("Удаление временно отключено для безопасности")} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View: Services */}
        {activeView === 'services' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in">
            {data.services?.filter((s: any) => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map((s: any) => (
              <div key={s.id} className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{s.category}</span>
                      <h3 className="text-xl font-black text-white uppercase font-syne leading-tight">{s.title}</h3>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ type: 'service', data: {...s} })} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('service', s.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ментор</p>
                   <p className="text-sm font-black text-white uppercase">{s.mentorName}</p>
                </div>
                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{s.price}</span>
                      <span className="text-xs font-bold text-slate-500">₽</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.format}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View: Jobs */}
        {activeView === 'jobs' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
            {data.jobs?.filter((j: any) => j.title.toLowerCase().includes(searchTerm.toLowerCase())).map((j: any) => (
              <div key={j.id} className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-violet-500 uppercase tracking-widest">{j.category}</span>
                    <h3 className="text-xl font-black text-white uppercase font-syne leading-tight">{j.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'job', data: {...j} })} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete('job', j.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/[0.02] rounded-3xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Заказчик</p>
                    <p className="text-xs font-bold text-white uppercase">{j.mentorName}</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] rounded-3xl">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Telegram</p>
                    <p className="text-xs font-bold text-violet-400">{j.telegram}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Награда:</span>
                  <p className="text-lg font-black text-white">{j.reward}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View: Bookings */}
        {activeView === 'bookings' && data && (
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Клиент</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ментор</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">ШАГ</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Дата/Время</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус</th>
                    <th className="p-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Ред.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.bookings?.filter((b: any) => b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || b.mentorId?.toLowerCase().includes(searchTerm.toLowerCase())).map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-8">
                        <p className="text-white font-black text-xs uppercase">{b.userName}</p>
                        <p className="text-slate-500 text-[10px] font-bold">{b.userEmail}</p>
                      </td>
                      <td className="p-8 text-xs font-bold text-slate-400 uppercase">{b.mentorName || b.mentorId}</td>
                      <td className="p-8 text-xs font-black text-indigo-400 uppercase">{b.serviceTitle || 'Индив.'}</td>
                      <td className="p-8 text-xs font-bold text-white uppercase">{b.date} • {b.time}</td>
                      <td className="p-8">
                        <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border ${b.status === 'confirmed' ? 'border-emerald-500/30 text-emerald-500' : 'border-amber-500/30 text-amber-500'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button onClick={() => setEditingItem({ type: 'booking', data: {...b} })} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10"><Edit3 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0a0a0b] w-full max-w-2xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden relative">
            <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-all"><X className="w-8 h-8"/></button>
            <div className="p-10 md:p-14 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase font-syne tracking-tight">Редактирование</h2>
                <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">{editingItem.type} ID: {editingItem.data.id}</p>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 no-scrollbar">
                {editingItem.type === 'user' && (
                  <div className="grid grid-cols-1 gap-6">
                    <AdminInput label="Имя" value={editingItem.data.name} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, name: v}})} />
                    <AdminInput label="Город" value={editingItem.data.city} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, city: v}})} />
                    <AdminInput label="Индустрия / Направление" value={editingItem.data.direction || editingItem.data.industry} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, direction: v, industry: v}})} />
                    <AdminInput label="Компания / Проект" value={editingItem.data.companyName} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, companyName: v}})} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Описание / О себе</label>
                      <textarea value={editingItem.data.description || editingItem.data.qualities} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-medium h-32 resize-none outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                )}

                {editingItem.type === 'service' && (
                  <div className="grid grid-cols-1 gap-6">
                    <AdminInput label="Название ШАГа" value={editingItem.data.title} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} />
                    <div className="grid grid-cols-2 gap-4">
                       <AdminInput label="Цена (₽)" type="number" value={editingItem.data.price} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(v)}})} />
                       <AdminInput label="Категория" value={editingItem.data.category} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, category: v}})} />
                    </div>
                    <AdminInput label="Длительность" value={editingItem.data.duration} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, duration: v}})} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Описание услуги</label>
                      <textarea value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-medium h-32 resize-none outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                )}

                {editingItem.type === 'job' && (
                  <div className="grid grid-cols-1 gap-6">
                    <AdminInput label="Заголовок миссии" value={editingItem.data.title} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} />
                    <div className="grid grid-cols-2 gap-4">
                       <AdminInput label="Награда" value={editingItem.data.reward} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, reward: v}})} />
                       <AdminInput label="Telegram" value={editingItem.data.telegram} onChange={v => setEditingItem({...editingItem, data: {...editingItem.data, telegram: v}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Текст миссии (ТЗ)</label>
                      <textarea value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-medium h-40 resize-none outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                )}

                {editingItem.type === 'booking' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                      <p className="text-white font-bold uppercase text-xs">Информация о встрече</p>
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-500">Клиент: <span className="text-white">{editingItem.data.userName} ({editingItem.data.userEmail})</span></p>
                        <p className="text-slate-500">Наставник: <span className="text-white">{editingItem.data.mentorName || editingItem.data.mentorId}</span></p>
                      </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Статус бронирования</label>
                       <select 
                         value={editingItem.data.status}
                         onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, status: e.target.value}})}
                         className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-xs outline-none focus:border-indigo-500"
                       >
                         <option value="pending" className="bg-[#0a0a0b]">Pending (Ожидает оплаты)</option>
                         <option value="confirmed" className="bg-[#0a0a0b]">Confirmed (Подтверждено)</option>
                         <option value="completed" className="bg-[#0a0a0b]">Completed (Завершено)</option>
                         <option value="cancelled" className="bg-[#0a0a0b]">Cancelled (Отменено)</option>
                         <option value="refunded" className="bg-[#0a0a0b]">Refunded (Возврат)</option>
                       </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4">
                <button onClick={() => setEditingItem(null)} className="flex-1 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all">Отмена</button>
                <button 
                  onClick={handleUpdate} 
                  disabled={isSaving}
                  className="flex-[2] bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color = 'indigo' }: any) => {
  const colorClasses = {
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    violet: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  }[color as 'indigo' | 'violet' | 'emerald'] || 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';

  return (
    <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>}
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-5xl font-black text-white tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
};

const AdminInput = ({ label, value, onChange, type = 'text' }: { label: string; value: any; onChange: (v: string) => void; type?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
    <input 
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 transition-all uppercase text-xs"
    />
  </div>
);
