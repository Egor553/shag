
import React from 'react';
import { User, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-[60] bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <img src="https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png" className="w-7 h-7 object-contain" alt="ШАГ" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white font-syne uppercase leading-none">ШАГ</span>
            <span className="text-[8px] font-bold text-indigo-500 tracking-[0.2em] uppercase mt-0.5">платформа</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <button onClick={onHomeClick} className="hover:text-white transition-colors">Лоты</button>
          <a href="#" className="hover:text-white transition-colors">Сообщество</a>
          <a href="#" className="hover:text-white transition-colors">Миссия</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-3 text-white/20 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onProfileClick}
            className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black border border-white/20">
              U
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Кабинет</span>
          </button>
        </div>
      </div>
    </header>
  );
};
