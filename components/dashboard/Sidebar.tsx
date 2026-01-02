
import React from 'react';
import { 
  Users, Calendar as CalendarIcon, LayoutGrid, 
  UserCircle, LogOut, ChevronLeft, ChevronRight, Briefcase, Info, ShieldCheck
} from 'lucide-react';
import { AppTab, UserRole, UserSession } from '../../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  session: UserSession | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  session, 
  onLogout 
}) => {
  const isEnt = session?.role === UserRole.ENTREPRENEUR;
  const isAdmin = session?.role === UserRole.ADMIN || session?.email === 'admin';
  const accentColor = isEnt ? 'indigo' : (isAdmin ? 'emerald' : 'violet');
  const logoUrl = "https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png";

  const menuItems = [
    { id: AppTab.CATALOG, label: 'Галерея ШАГов', icon: Users },
    { id: AppTab.JOBS, label: 'Вакансии', icon: Briefcase }, // Переименовано с Миссии
    ...(isEnt ? [{ id: AppTab.SERVICES, label: 'Мои ШАГи', icon: LayoutGrid }] : []),
    { id: AppTab.MEETINGS, label: 'События', icon: CalendarIcon },
    { id: AppTab.MISSION, label: 'Миссия', icon: Info },
    ...(isAdmin ? [{ id: AppTab.ADMIN, label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <aside 
      className={`fixed left-4 top-4 bottom-4 transition-all duration-500 z-[70] hidden md:flex flex-col rounded-[32px] border border-white/5 bg-[#0a0a0b]/80 backdrop-blur-2xl shadow-2xl ${isSidebarOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="py-10 flex flex-col items-center border-b border-white/5">
        <div 
          onClick={() => setActiveTab(AppTab.CATALOG)}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          <div className={`w-10 h-10 rounded-xl overflow-hidden border border-white/10 ${activeTab === AppTab.CATALOG ? `ring-2 ring-${accentColor}-500/50` : ''}`}>
             <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center py-8 space-y-2 px-3 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center group relative transition-all duration-300 py-3.5 px-3.5 rounded-2xl ${isActive ? 'text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {isActive && (
                <div className={`absolute inset-0 bg-${accentColor}-500/10 border border-${accentColor}-500/20 rounded-2xl z-0 animate-in fade-in zoom-in duration-300`} />
              )}
              
              <div className="relative z-10 flex items-center">
                <Icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? `text-${accentColor}-400` : 'group-hover:scale-110'}`} />
                {isSidebarOpen && (
                  <span className="ml-4 font-bold text-[11px] uppercase tracking-[0.15em] animate-in fade-in slide-in-from-left-2 duration-300 truncate">
                    {item.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="py-6 flex flex-col items-center border-t border-white/5 space-y-4 px-3">
        <button 
          onClick={() => setActiveTab(AppTab.PROFILE)}
          className={`w-full flex items-center relative transition-all py-3.5 px-3.5 rounded-2xl ${activeTab === AppTab.PROFILE ? 'text-white' : 'text-slate-500 hover:text-white'}`}
        >
          {activeTab === AppTab.PROFILE && (
            <div className={`absolute inset-0 bg-${accentColor}-500/10 border border-${accentColor}-500/20 rounded-2xl z-0`} />
          )}
          <div className="relative z-10 flex items-center">
             <UserCircle className={`w-5 h-5 shrink-0 ${activeTab === AppTab.PROFILE ? `text-${accentColor}-400` : ''}`} />
             {isSidebarOpen && <span className="ml-4 font-bold text-[11px] uppercase tracking-[0.15em]">Профиль</span>}
          </div>
        </button>

        <button 
          onClick={onLogout} 
          className="p-3.5 text-slate-600 hover:text-red-400 hover:bg-red-400/5 transition-all rounded-2xl group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-3 translate-y-[-50%] w-6 h-12 rounded-r-xl text-white/20 hover:text-white transition-colors bg-[#0a0a0b] border border-white/5 flex items-center justify-center group shadow-xl"
      >
        {isSidebarOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
      </button>
    </aside>
  );
};
