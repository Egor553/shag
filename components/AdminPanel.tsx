
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Trash2, Edit3, X, Save, ShieldCheck, Briefcase, 
  Loader2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { dbService } from '../services/databaseService';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings'>('stats');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

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
    if (!confirm(`ВНИМАНИЕ: Удалить ${type} навсегда? Данные будут стерты из базы.`)) return;
    
    // Мгновенное удаление из интерфейса (Optimistic Update)
    const prevData = { ...data };
    if (type === 'service') setData({ ...data, services: data.services.filter((s: any) => s.id !== id) });
    if (type === 'job') setData({ ...data, jobs: data.jobs.filter((j: any) => j.id !== id) });
    if (type === 'booking') setData({ ...data, bookings: data.bookings.filter((b: any) => b.id !== id) });

    try {
      let res;
      if (type === 'service') res = await dbService.deleteService(id);
      else if (type === 'job') res = await dbService.deleteJob(id);
      else if (type === 'booking') res = await dbService.updateBookingStatus(id, 'cancelled');

      if (!res || res.result !== 'success') {
        alert("Ошибка на сервере. Синхронизируем базу...");
        fetchAdminData();
      }
    } catch (e) {
      setData(prevData);
      alert("Ошибка сети при удалении");
    }
  };

  const handleClearAll = async (type: 'services' | 'jobs' | 'bookings') => {
    const label = type === 'services' ? 'ШАГи' : (type === 'jobs' ? 'Миссии' : 'Записи');
    if (!confirm(`ВЫ СОБИРАЕТЕСЬ УДАЛИТЬ ВСЕ ${label.toUpperCase()} ИЗ БАЗЫ! Это действие нельзя отменить.`)) return;
    if (!confirm(`ПОДТВЕРДИТЕ ЕЩЕ РАЗ: Точно очистить всю таблицу ${label}?`)) return;

    setIsBulkLoading(true);
    try {
      const res = await dbService.clearAll(type);
      if (res && res.result === 'success') {
        alert(`Все ${label} успешно удалены`);
        await fetchAdminData();
      } else {
        alert("Ошибка сервера при очистке");
      }
    } catch (e) {
      alert("Ошибка связи с сервером");
    } finally {
      setIsBulkLoading(false);
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

  if (loading) return (
    <div className="h-full min-h-[400px] flex items-center justify-center bg-[#0a0a0b]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Вход в Root-панель...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col lg:flex-row bg-[#0a0a0b] text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#111114] border-r border-white/5 flex flex-col p-6 space-y-2">
        <div className="flex items-center gap-3 mb-10 px-2">
           <ShieldCheck className="w-6 h-6 text-indigo-500" />
           <span className="font-black text-sm tracking-tight uppercase">Root / Альбина</span>
        </div>
        {[
          { id: 'stats', label: 'Обзор', icon: TrendingUp },
          { id: 'users', label: 'Пользователи', icon: Users },
          { id: 'services', label: 'Все ШАГи', icon: Layers },
          { id: 'jobs', label: 'Все Миссии', icon: Briefcase },
          { id: 'bookings', label: 'Все Встречи', icon: Calendar },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl text-xs font-bold transition-all ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        <div className="mt-auto space-y-4">
           {isBulkLoading && (
             <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center gap-3">
               <Loader2 className="w-4 h-4 animate-spin text-red-500" />
               <span className="text-[8px] font-black uppercase text-red-500">Удаление данных...</span>
             </div>
           )}
           <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 text-red-500 text-xs font-bold hover:bg-red-500/10 rounded-2xl transition-all">
             <Trash2 className="w-4 h-4" /> Выйти
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
             <h1 className="text-4xl font-black font-syne uppercase tracking-tighter">
               {activeView === 'stats' ? 'ПУЛЬС БАЗЫ' : (activeView === 'users' ? 'УЧАСТНИКИ' : (activeView === 'services' ? 'ШАГИ (Услуги)' : (activeView === 'jobs' ? 'МИССИИ (Работа)' : 'ЖУРНАЛ')))}
             </h1>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Управление данными платформы</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
             {(activeView === 'services' || activeView === 'jobs') && (
               <button 
                 disabled={isBulkLoading}
                 onClick={() => handleClearAll(activeView as any)}
                 className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg"
               >
                 <AlertTriangle className="w-4 h-4" /> Очистить всё в базе
               </button>
             )}
             <div className="relative flex-1 md:flex-none md:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Найти..." 
                 className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-xl text-white text-xs outline-none focus:border-indigo-600 font-bold"
               />
             </div>
          </div>
        </header>

        {activeView === 'stats' && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
             <StatBox label="Участников" value={data.dynamicMentors?.length} />
             <StatBox label="Услуг (ШАГи)" value={data.services?.length} />
             <StatBox label="Подработок" value={data.jobs?.length} />
             <StatBox label="Встреч" value={data.bookings?.length} />
             
             <div className="sm:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 p-10 rounded-[40px] mt-8 flex items-center justify-between">
                <div className="space-y-4">
                   <h3 className="text-2xl font-black font-syne uppercase">Синхронизация Google Таблиц</h3>
                   <p className="text-slate-500 text-sm font-medium">Обновите локальные данные, если вносили правки напрямую в таблицу.</p>
                </div>
                <button 
                  onClick={fetchAdminData}
                  disabled={loading}
                  className="p-6 bg-indigo-600 text-white rounded-3xl hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                </button>
             </div>
          </div>
        )}

        {activeView !== 'stats' && (
          <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                   <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="p-6 font-black uppercase text-slate-500">Объект / ID</th>
                        <th className="p-6 font-black uppercase text-slate-500">Владелец</th>
                        <th className="p-6 font-black uppercase text-slate-500">Статус / Роль</th>
                        <th className="p-6 text-right font-black uppercase text-slate-500">Действие</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {filteredData().map((item: any) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="p-6">
                              <p className="font-black text-white uppercase truncate max-w-[200px]">{item.title || item.name || 'Без названия'}</p>
                              <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">ID: {item.id}</p>
                           </td>
                           <td className="p-6">
                              <p className="font-bold text-slate-300">{item.mentorName || item.userEmail || item.email || '—'}</p>
                           </td>
                           <td className="p-6">
                              <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase`}>
                                {item.status || item.role || item.category || 'Активен'}
                              </span>
                           </td>
                           <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                 <button onClick={() => setEditingItem({ type: activeView.slice(0, -1), data: {...item} })} className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                 </button>
                                 <button onClick={() => handleDelete(activeView.slice(0, -1), item.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                      {filteredData().length === 0 && (
                        <tr><td colSpan={4} className="p-20 text-center opacity-30 uppercase font-black text-xs">Нет данных</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
           <div className="bg-[#0a0a0b] w-full max-w-2xl rounded-[48px] border border-white/10 p-12 relative shadow-3xl">
              <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X className="w-10 h-10"/></button>
              <div className="space-y-10">
                 <h2 className="text-3xl font-black font-syne uppercase">Правка {editingItem.type}</h2>
                 <div className="space-y-6 max-h-[50vh] overflow-y-auto no-scrollbar">
                    <AdminField label="Заголовок / Имя" value={editingItem.data.title || editingItem.data.name} onChange={(v: string) => setEditingItem({...editingItem, data: {...editingItem.data, title: v, name: v}})} />
                    {editingItem.type === 'service' && (
                      <>
                        <AdminField label="Цена (₽)" type="number" value={editingItem.data.price} onChange={(v: any) => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(v)}})} />
                        <AdminField label="Описание" isTextArea value={editingItem.data.description} onChange={(v: string) => setEditingItem({...editingItem, data: {...editingItem.data, description: v}})} />
                      </>
                    )}
                    {editingItem.type === 'job' && (
                      <>
                        <AdminField label="Награда" value={editingItem.data.reward} onChange={(v: string) => setEditingItem({...editingItem, data: {...editingItem.data, reward: v}})} />
                        <AdminField label="Telegram" value={editingItem.data.telegram} onChange={(v: string) => setEditingItem({...editingItem, data: {...editingItem.data, telegram: v}})} />
                        <AdminField label="Описание" isTextArea value={editingItem.data.description} onChange={(v: string) => setEditingItem({...editingItem, data: {...editingItem.data, description: v}})} />
                      </>
                    )}
                 </div>
                 <div className="pt-8 border-t border-white/5 flex gap-4">
                    <button onClick={() => setEditingItem(null)} className="flex-1 py-6 text-slate-500 font-black uppercase text-[10px]">Отмена</button>
                    <button onClick={handleUpdate} disabled={isSaving} className="flex-[2] bg-indigo-600 text-white py-6 rounded-[24px] font-black uppercase text-[10px] flex items-center justify-center gap-3">
                      {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                      Применить
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value }: any) => (
  <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-4 shadow-2xl">
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
     <p className="text-6xl font-black text-white font-syne tracking-tighter">{value || 0}</p>
  </div>
);

const AdminField = ({ label, value, onChange, type = 'text', isTextArea = false }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>
    {isTextArea ? (
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-medium outline-none focus:border-indigo-600 h-32 resize-none" />
    ) : (
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-6 rounded-[24px] text-white font-black outline-none focus:border-indigo-600 uppercase text-xs" />
    )}
  </div>
);
