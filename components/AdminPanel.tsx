
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Trash2, Edit3, X, Save, ShieldCheck, Briefcase, 
  Loader2, AlertTriangle, RefreshCw, CreditCard, Copy, CheckCircle, Key, Lock, LogOut, Menu, Trash
} from 'lucide-react';
import { dbService, WEBHOOK_URL } from '../services/databaseService';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'jobs' | 'bookings' | 'payments'>('stats');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Тестовые ключи ЮKassa
  const [yooClientId, setYooClientId] = useState('7FFA0AFF2179B320174CD0076329D5379F14ABE9A40BB331A386C72776D64E65');
  const [yooClientSecret, setYooClientSecret] = useState('C4EEDEF4C4E25089102DC4D13FE3868A54159EC4236DBA4D149E8B05A446AE6F8737B3E3815A5B4693C59157460AF9347D713BDD18682F25D7F0EE38FEBCD7F6');
  
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

  // Исправленная функция удаления
  const handleDelete = async (type: string, id: string, email?: string) => {
    const confirmMsg = `ВНИМАНИЕ: Удалить ${type} навсегда? Это действие невозможно отменить.`;
    if (!confirm(confirmMsg)) return;
    
    setIsDeleting(id);
    try {
      let res;
      // Используем email для удаления пользователя, id для всего остального
      if (type === 'user') {
        res = await dbService.postAction({ action: 'delete_user', email: email || id });
      } else if (type === 'service') {
        res = await dbService.deleteService(id);
      } else if (type === 'job') {
        res = await dbService.deleteJob(id);
      } else if (type === 'booking') {
        // Пробуем вызвать прямое удаление из БД
        res = await dbService.postAction({ action: 'delete_booking', id: id });
        // Если прямого удаления нет в скрипте, помечаем как отмененное
        if (res.result !== 'success') {
          res = await dbService.updateBookingStatus(id, 'cancelled');
        }
      }

      if (res?.result === 'success') {
        await fetchAdminData();
      } else {
        alert("Ошибка удаления: " + (res?.message || "Неизвестная ошибка"));
      }
    } catch (e) {
      alert("Ошибка сети или бэкенда при удалении");
    } finally {
      setIsDeleting(null);
    }
  };

  // Функция массовой очистки
  const handleClearAll = async () => {
    const type = activeView === 'services' ? 'services' : (activeView === 'jobs' ? 'jobs' : (activeView === 'bookings' ? 'bookings' : null));
    if (!type) return;

    if (!confirm(`ОПАСНО: Вы уверены, что хотите УДАЛИТЬ ВСЕ записи в разделе ${type}?`)) return;
    
    setLoading(true);
    try {
      const res = await dbService.clearAll(type as any);
      if (res.result === 'success') {
        await fetchAdminData();
      } else {
        alert("Ошибка при очистке");
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

  if (loading) return (
    <div className="h-full min-h-screen flex items-center justify-center bg-[#050505] p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-t-2 border-indigo-600 rounded-full animate-spin"></div>
          <ShieldCheck className="absolute inset-0 m-auto w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
        </div>
        <p className="text-indigo-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] animate-pulse">Инициализация Root-доступа...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
      {/* Mobile Menu Button */}
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

      {/* Sidebar */}
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
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 text-center">v2.6 Mobile Ready</span>
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
              className={`w-full flex items-center gap-4 p-4 lg:p-5 rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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

      {/* Main Content */}
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
                  <Trash className="w-3.5 h-3.5" /> Очистить всё
                </button>
              )}
              <button onClick={fetchAdminData} className="flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Обновить
              </button>
            </div>
          </header>

          {activeView === 'stats' && (
            <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <StatBox label="Участников" value={data.dynamicMentors?.length} color="indigo" />
                  <StatBox label="Всего ШАГов" value={data.services?.length} color="violet" />
                  <StatBox label="Миссий" value={data.jobs?.length} color="pink" />
                  <StatBox label="Встреч" value={data.bookings?.length} color="emerald" />
               </div>
               
               <div className="p-6 lg:p-10 bg-white/[0.02] border border-white/5 rounded-[32px] lg:rounded-[48px] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div className="space-y-2">
                    <h3 className="text-lg lg:text-xl font-black uppercase font-syne">Системный отчет</h3>
                    <p className="text-slate-500 text-[9px] lg:text-[10px] font-medium uppercase tracking-widest">Google Sheets API активен</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black border border-emerald-500/20">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> ONLINE
                  </div>
               </div>
            </div>
          )}

          {activeView === 'payments' && (
            <div className="space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-indigo-600/5 border-2 border-indigo-500/10 p-6 lg:p-12 rounded-[40px] lg:rounded-[56px] space-y-8 lg:space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-600 text-white rounded-2xl lg:rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                        <CreditCard className="w-6 h-6 lg:w-8 lg:h-8" />
                     </div>
                     <div>
                        <h3 className="text-xl lg:text-3xl font-black font-syne uppercase tracking-tight">ЮKassa API</h3>
                        <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mt-1">Конфигурация шлюза</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 lg:gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Notification URI (Вставьте в ЮKassa)</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                           <div className="flex-1 bg-white/5 p-4 lg:p-6 rounded-2xl font-mono text-[9px] lg:text-[11px] text-indigo-400 break-all border border-indigo-500/20 shadow-inner overflow-hidden">
                              {WEBHOOK_URL}
                           </div>
                           <button onClick={() => copyToClipboard(WEBHOOK_URL)} className="bg-white text-black py-4 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shrink-0 font-black uppercase text-[10px]">
                              {copied ? 'ГОТОВО' : 'КОПИРОВАТЬ'}
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-6 border-t border-white/5">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Client ID</label>
                           <div className="relative">
                              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input 
                                value={yooClientId}
                                onChange={e => setYooClientId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] text-slate-300 font-mono outline-none focus:border-indigo-600"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Client Secret</label>
                           <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input 
                                type="password"
                                value={yooClientSecret}
                                onChange={e => setYooClientSecret(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] text-slate-300 font-mono outline-none focus:border-indigo-600"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="p-6 lg:p-8 bg-indigo-600/10 rounded-[28px] lg:rounded-[32px] border border-indigo-500/20 flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
                        <AlertTriangle className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                        <div className="space-y-2">
                           <p className="text-xs font-black text-indigo-100 uppercase tracking-widest">Инструкция:</p>
                           <p className="text-[10px] lg:text-[11px] text-indigo-300/80 leading-relaxed font-medium">
                              Ваши ключи успешно привязаны. Обязательно вставьте <b>Notification URI</b> в настройках Личного Кабинета ЮKassa в поле "Notification URI", чтобы статусы оплат обновлялись автоматически.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView !== 'stats' && activeView !== 'payments' && (
             <div className="bg-[#0a0a0b] border border-white/5 rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl">
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center gap-4 lg:gap-6">
                   <Search className="w-5 h-5 text-slate-600" />
                   <input 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Поиск..." 
                     className="bg-transparent text-sm outline-none flex-1 text-white font-bold placeholder:text-slate-700" 
                   />
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-[10px] lg:text-[11px] min-w-[600px]">
                     <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="p-6 lg:p-8 font-black uppercase text-slate-500 tracking-widest">Название</th>
                          <th className="p-6 lg:p-8 font-black uppercase text-slate-500 tracking-widest">Категория</th>
                          <th className="p-6 lg:p-8 font-black uppercase text-slate-500 tracking-widest">Статус</th>
                          <th className="p-6 lg:p-8 text-right font-black uppercase text-slate-500 tracking-widest">Действие</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredData().map((item: any) => {
                          const type = activeView.slice(0, -1);
                          return (
                            <tr key={item.id || item.email} className="hover:bg-white/[0.02] transition-colors group">
                               <td className="p-6 lg:p-8">
                                  <p className="font-black text-white uppercase text-xs lg:text-sm tracking-tight">{item.title || item.name || '—'}</p>
                                  <p className="text-[8px] lg:text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-widest">{item.email || item.id}</p>
                               </td>
                               <td className="p-6 lg:p-8">
                                  <p className="font-black text-slate-400 uppercase tracking-widest">{item.role || item.mentorName || 'SYSTEM'}</p>
                               </td>
                               <td className="p-6 lg:p-8">
                                  <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'text-emerald-500 border-emerald-500/20' : 'text-slate-400'}`}>
                                    {item.status || 'Active'}
                                  </span>
                               </td>
                               <td className="p-6 lg:p-8 text-right">
                                  <div className="flex justify-end gap-2 lg:gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => setEditingItem({ type, data: {...item} })} className="p-3 lg:p-4 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                        <Edit3 className="w-4 h-4" />
                                     </button>
                                     <button 
                                       disabled={isDeleting === item.id}
                                       onClick={() => handleDelete(type, item.id, item.email)} 
                                       className="p-3 lg:p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                                     >
                                        {isDeleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0a0a0b] lg:border border-white/10 p-8 lg:p-12 rounded-[40px] lg:rounded-[56px] space-y-8 lg:space-y-10 shadow-3xl overflow-y-auto max-h-[95vh] no-scrollbar">
             <div className="flex items-center justify-between">
                <h3 className="text-xl lg:text-2xl font-black font-syne uppercase">Правка {editingItem.type}</h3>
                <button onClick={() => setEditingItem(null)} className="p-3 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6 lg:w-8 lg:h-8" /></button>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Название/Имя</label>
                   <input 
                     value={editingItem.data.title || editingItem.data.name || ''} 
                     onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.title ? 'title' : 'name']: e.target.value}})}
                     className="w-full bg-white/5 border border-white/10 p-5 lg:p-6 rounded-2xl text-white font-bold outline-none focus:border-indigo-600" 
                   />
                </div>
                {editingItem.data.status && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Статус</label>
                    <select 
                      value={editingItem.data.status}
                      onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, status: e.target.value}})}
                      className="w-full bg-white/5 border border-white/10 p-5 lg:p-6 rounded-2xl text-white font-bold outline-none focus:border-indigo-600 appearance-none"
                    >
                      <option value="pending">Ожидает оплаты</option>
                      <option value="confirmed">Подтверждено</option>
                      <option value="cancelled">Отменено</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </div>
                )}
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setEditingItem(null)} className="flex-1 py-5 lg:py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all">Отмена</button>
                <button onClick={handleUpdate} className="flex-[2] bg-indigo-600 text-white py-5 lg:py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3">
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                   Сохранить
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
    <div className={`border p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] space-y-2 lg:space-y-4 shadow-xl shadow-black/20 ${colorClasses[color]}`}>
       <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
       <p className="text-4xl lg:text-7xl font-black text-white font-syne tracking-tighter leading-none">{value || 0}</p>
    </div>
  );
};
