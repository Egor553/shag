import React from 'react';
import { LayoutGrid, UserPlus, Briefcase, Calendar as CalendarIcon, UserCircle, ShieldCheck } from 'lucide-react';
import { AppTab, UserRole } from '../../types';

interface MobileNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const isEnt = userRole === UserRole.ENTREPRENEUR;
  const isAdmin = userRole === UserRole.ADMIN;

  const mobileNavItems = [
    { id: AppTab.CATALOG, icon: LayoutGrid, label: 'ШАГи' },
    ...((isEnt || isAdmin) ? [{ id: AppTab.SERVICES, icon: UserPlus, label: 'Витрина' }] : []),
    { id: AppTab.JOBS, icon: Briefcase, label: 'Миссии' },
    { id: AppTab.MEETINGS, icon: CalendarIcon, label: 'События' },
    { id: AppTab.PROFILE, icon: UserCircle, label: 'Профиль' },
    ...(isAdmin ? [{ id: AppTab.ADMIN, icon: ShieldCheck, label: 'Админ' }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-2xl border-t border-white/10 z-[100] md:hidden flex items-center justify-around px-2 pb-safe">
      {mobileNavItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all relative ${isActive ? 'text-white' : 'text-white/40'}`}
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}>
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[7px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};