
import React from 'react';
import { 
  Users, Calendar as CalendarIcon, LayoutGrid, 
  UserCircle, LogOut, ChevronLeft, ChevronRight, Briefcase
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
  const accentColor = isEnt ? 'indigo' : 'violet';
  const logoUrl = "https://s5.iimage.su/s/31/uv0IjJ5xebbusdBYYqUNqgb4tdvIRyDzPFzSVr00.jpg";

  const menuItems = [
    { id: 'dashboard', label: 'Статистика', isLogo: true },
    { id: AppTab.CATALOG, label: 'Галерея', icon: Users },
    { id: AppTab.JOBS, label: 'Миссии', icon: Briefcase },
    ...(isEnt ? [{ id: AppTab.SERVICES, label: 'Услуги', icon: LayoutGrid }] : []),
    { id: AppTab.MEETINGS, label: 'Встречи', icon: CalendarIcon },
    { id: AppTab.PROFILE, label: 'Профиль', icon: UserCircle },
  ];

  return (
    <aside 
      className={`fixed left-6 top-6 bottom-6 transition-all duration-700 z-[70] hidden md:flex flex-col rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-24'}`}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <nav className="flex-1 flex flex-col items-center py-12 space-y-6 relative z-10">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-center relative group transition-all duration-500 py-3 ${isActive ? 'text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {isActive && (
                <div className={`absolute inset-y-0 left-3 right-3 bg-${accentColor}-600/20 border border-${accentColor}-500/30 rounded-[24px] z-0 animate-in fade-in zoom-in duration-300`} />
              )}
              
              <div className="relative z-10 flex items-center justify-center">
                {item.isLogo ? (
                  <div className={`w-10 h-10 rounded-[18px] overflow-hidden border-2 border-white/10 transition-all duration-500 ${isActive ? 'scale-110 border-white/40 ring-4 ring-white/5' : 'group-hover:scale-110'}`}>
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : Icon && (
                  <div className={`w-10 h-10 flex items-center justify-center rounded-[18px] transition-all duration-500 ${isActive ? `bg-${accentColor}-500/10` : ''}`}>
                    <Icon className={`w-6 h-6 shrink-0 transition-all duration-500 ${isActive ? `text-${accentColor}-400 scale-110` : 'group-hover:scale-110'}`} />
                  </div>
                )}
                
                {isSidebarOpen && (
                  <span className="ml-4 font-bold text-[10px] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2 duration-500 truncate w-32 text-left">
                    {item.label}
                  </span>
                )}
              </div>

              {isActive && !isSidebarOpen && (
                <div className={`absolute left-0 w-1.5 h-8 bg-${accentColor}-500 rounded-r-full shadow-[0_0_15px_rgba(79,70,229,0.5)]`} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="py-10 flex flex-col items-center border-t border-white/5 relative z-10">
        <button 
          onClick={onLogout} 
          className="p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-[24px] group"
          title="Выход"
        >
          <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-0 translate-y-[-50%] p-2 rounded-l-full text-white/20 hover:text-white transition-colors bg-black/40 border-y border-l border-white/10"
      >
        {isSidebarOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
      </button>
    </aside>
  );
};
