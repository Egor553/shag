
import React from 'react';
import { 
  Users, Calendar as CalendarIcon, LayoutGrid, 
  UserCircle, LogOut, ChevronLeft, ChevronRight, Briefcase, MessageSquare, Info, Star, Heart
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
  const logoUrl = "https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png";

  const menuItems = [
    { id: AppTab.CATALOG, label: 'Галерея ШАГов', icon: Users },
    { id: AppTab.JOBS, label: 'Миссии (Work)', icon: Briefcase },
    { id: AppTab.CHATS, label: 'Сообщения', icon: MessageSquare },
    ...(isEnt ? [{ id: AppTab.SERVICES, label: 'Мои ШАГи', icon: LayoutGrid }] : []),
    { id: AppTab.MEETINGS, label: 'Мои События', icon: CalendarIcon },
    { id: AppTab.MISSION, label: 'Наша Миссия', icon: Info },
  ];

  return (
    <aside 
      className={`fixed left-6 top-6 bottom-6 transition-all duration-700 z-[70] hidden md:flex flex-col rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-24'}`}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Header / Logo */}
      <div className="py-12 flex flex-col items-center">
        <button 
          onClick={() => setActiveTab(AppTab.CATALOG)}
          className={`relative group transition-transform duration-500 hover:scale-110 active:scale-95`}
        >
          <div className={`w-12 h-12 rounded-[22px] overflow-hidden border-2 border-white/10 transition-all duration-500 ${activeTab === AppTab.CATALOG ? `ring-4 ring-${accentColor}-500/20 border-${accentColor}-500/50` : ''}`}>
             <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {isSidebarOpen && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] opacity-40">ШАГ</span>
            </div>
          )}
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center py-6 space-y-4 relative z-10 px-3">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center relative group transition-all duration-500 py-4 px-4 rounded-[24px] ${isActive ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <div className={`absolute inset-0 bg-${accentColor}-600/20 border border-${accentColor}-500/30 rounded-[24px] z-0 animate-in fade-in zoom-in duration-300`} />
              )}
              
              <div className="relative z-10 flex items-center">
                <Icon className={`w-6 h-6 shrink-0 transition-all duration-500 ${isActive ? `text-${accentColor}-400 scale-110` : 'group-hover:scale-110'}`} />
                
                {isSidebarOpen && (
                  <span className="ml-4 font-bold text-[10px] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2 duration-500 truncate w-32 text-left">
                    {item.label}
                  </span>
                )}
              </div>

              {isActive && !isSidebarOpen && (
                <div className={`absolute left-[-12px] w-1.5 h-8 bg-${accentColor}-500 rounded-r-full shadow-[0_0_15px_rgba(79,70,229,0.5)]`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="py-8 flex flex-col items-center border-t border-white/5 relative z-10 space-y-4 px-3">
        <button 
          onClick={() => setActiveTab(AppTab.PROFILE)}
          className={`w-full flex items-center relative group transition-all duration-500 py-4 px-4 rounded-[24px] ${activeTab === AppTab.PROFILE ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          {activeTab === AppTab.PROFILE && (
            <div className={`absolute inset-0 bg-${accentColor}-600/20 border border-${accentColor}-500/30 rounded-[24px] z-0`} />
          )}
          <div className="relative z-10 flex items-center">
             <UserCircle className={`w-6 h-6 shrink-0 transition-all duration-500 ${activeTab === AppTab.PROFILE ? `text-${accentColor}-400 scale-110` : 'group-hover:scale-110'}`} />
             {isSidebarOpen && (
               <span className="ml-4 font-bold text-[10px] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2 duration-500">
                 Кабинет
               </span>
             )}
          </div>
        </button>

        <button 
          onClick={onLogout} 
          className="p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-[24px] group"
          title="Выйти"
        >
          <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-0 translate-y-[-50%] p-2 rounded-l-full text-white/10 hover:text-white transition-colors bg-black/40 border-y border-l border-white/10 group"
      >
        {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
};
