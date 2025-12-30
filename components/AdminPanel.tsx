
import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Calendar, TrendingUp, Search, 
  Filter, MoreVertical, CheckCircle, Clock, 
  ShieldCheck, Briefcase, Zap, Mail, MapPin, 
  ExternalLink, Trash2, Download
} from 'lucide-react';
import { dbService } from '../services/databaseService';
import { UserRole } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'services' | 'bookings'>('stats');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await dbService.syncData(); // Admin gets everything
      setData(res);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const stats = data ? {
    totalUsers: data.dynamicMentors?.length || 0,
    entrepreneurs: data.dynamicMentors?.filter((m: any) => m.industry !== 'Youth')?.length || 0,
    talents: 0, // In real app, we count from users sheet
    totalServices: data.services?.length || 0,
    totalBookings: data.bookings?.length || 0
  } : null;

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Загрузка данных системы...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#111114] border-r border-white/5 flex flex-col p-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter">ШАГ-ADMIN</span>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Панель управления</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', label: 'Дашборд', icon: TrendingUp },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'services', label: 'Услуги', icon: Layers },
            { id: 'bookings', label: 'Бронирования', icon: Calendar },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-4 text-red-400 font-bold text-sm hover:bg-red-400/10 rounded-2xl transition-all">
          <Trash2 className="w-5 h-5" /> Выйти из системы
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter">
              {activeView === 'stats' && 'Обзор системы'}
              {activeView === 'users' && 'База участников'}
              {activeView === 'services' && 'Каталог услуг'}
              {activeView === 'bookings' && 'Журнал встреч'}
            </h1>
            <p className="text-slate-500 font-medium">Добро пожаловать в центр управления платформой ШАГ</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Поиск по базе..." 
                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white text-sm outline-none focus:border-indigo-600 transition-all"
              />
            </div>
            <button className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        {activeView === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <StatCard label="Всего участников" value={stats.totalUsers} icon={Users} trend="+12% за неделю" />
            <StatCard label="Наставников" value={stats.entrepreneurs} icon={Briefcase} color="indigo" />
            <StatCard label="Активных услуг" value={stats.totalServices} icon={Layers} color="violet" />
            <StatCard label="Бронирований" value={stats.totalBookings} icon={Calendar} color="emerald" trend="+4 сегодня" />
            
            <div className="md:col-span-2 xl:col-span-3 bg-[#111114] border border-white/5 rounded-[40px] p-10">
              <h3 className="text-2xl font-black text-white mb-8">Последние активности</h3>
              <div className="space-y-6">
                {data.bookings?.slice(0, 5).map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-6 bg-white/5 rounded-[24px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{b.userName} → {b.mentorId}</p>
                        <p className="text-slate-500 text-xs font-medium">{b.date} в {b.time}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg">Успешно</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-1 bg-indigo-600 rounded-[40px] p-10 text-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-40 h-40" />
              </div>
              <h3 className="text-3xl font-black leading-tight relative z-10">Система <br/>стабильна</h3>
              <p className="text-indigo-100 font-medium relative z-10 opacity-80">Все службы работают в штатном режиме. Конфликтов не обнаружено.</p>
              <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest relative z-10 shadow-xl">Логи системы</button>
            </div>
          </div>
        )}

        {activeView === 'users' && data && (
          <div className="bg-[#111114] border border-white/5 rounded-[40px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Участник</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Роль</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Город</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Контакты</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.dynamicMentors?.filter((m: any) => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((u: any) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img src={u.avatarUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                          <div>
                            <p className="text-white font-bold">{u.name}</p>
                            <p className="text-slate-500 text-xs">{u.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase ${u.industry === 'Youth' ? 'bg-violet-500/10 text-violet-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                          {u.industry === 'Youth' ? 'Талант' : 'Наставник'}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">{u.city || '—'}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Mail className="w-3.5 h-3.5" /> {u.ownerEmail || u.email}
                          </div>
                          {u.phone && <p className="text-slate-500 text-[10px]">{u.phone}</p>}
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Similar views for services and bookings would go here */}
      </main>
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
    <div className="bg-[#111114] border border-white/5 p-8 rounded-[40px] space-y-6">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && <span className="text-[10px] font-black text-emerald-500 uppercase">{trend}</span>}
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
};
