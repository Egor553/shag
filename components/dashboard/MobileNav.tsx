
import React from 'react';
import { LayoutGrid, UserPlus, Briefcase, Calendar as CalendarIcon, Target, UserCircle, ShieldCheck } from 'lucide-react';
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
    <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/[0.08] backdrop-blur-3xl border border-white/20 z-[100] md:hidden flex items-center justify-around rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.7)] px-2">
      {mobileNavItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all relative ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
          >
            <item.icon size={18} className={`${isActive ? 'scale-110 opacity-100' : 'opacity-60'}`} />
            <span className={`text-[6px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 h-0 overflow-hidden'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-white absolute -bottom-1 shadow-[0_0_8px_#ffffff] animate-in fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
