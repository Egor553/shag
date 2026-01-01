
import React, { useState } from 'react';
import { ArrowRight, Filter, LayoutGrid, Sparkles, UserX, Zap, Star } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';
import { AISearchModal } from '../AISearchModal';

interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  onServiceClick: (service: Service) => void;
  onSelectMentorFromSearch?: (mentor: Mentor) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, onServiceClick, onSelectMentorFromSearch }) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);

  // Фильтрация: Категория + Проверка на заполненность
  const availableServices = services.filter(s => {
    const isCategoryMatch = activeCategory === 'Все' || s.category === activeCategory;
    const isNotFull = (s.maxParticipants || 1) > (s.currentParticipants || 0);
    return isCategoryMatch && isNotFull;
  });

  const categories = ['Все', ...new Set(services.map(s => s.category).filter(Boolean))];

  // Топ менторы (для горизонтального скролла)
  const topMentors = mentors.slice(0, 5);

  return (
    <div className="space-y-12 md:space-y-24 animate-in fade-in duration-1000 pb-20">
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-indigo-500/50" />
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]">Gallery of steps</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-[8.5rem] font-black text-white tracking-tighter leading-[0.85] uppercase font-syne">
            ВСТРЕЧИ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">ШАГОВ</span>
          </h1>
        </div>

        {/* Featured Mentors Horizontal Scroll */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Менторы недели</span>
           </div>
           <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
              {topMentors.map(mentor => (
                <button 
                  key={mentor.id}
                  onClick={() => onSelectMentorFromSearch?.(mentor)}
                  className="shrink-0 flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-3xl hover:border-indigo-500/50 transition-all group"
                >
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                      <img src={mentor.paymentUrl || mentor.avatarUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={mentor.name} />
                   </div>
                   <div className="text-left pr-4">
                      <p className="text-white font-black text-sm uppercase font-syne truncate w-32">{mentor.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{mentor.direction || mentor.industry}</p>
                   </div>
                </button>
              ))}
           </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 -mx-2 px-2">
           {categories.map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)} 
               className={`whitespace-nowrap px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-white text-black border-white shadow-2xl shadow-white/10 scale-105' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {availableServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {availableServices.map((service, idx) => (
            <div key={service.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <ServiceCard service={service} onClick={onServiceClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[64px]">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
             <UserX className="w-12 h-12" />
           </div>
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">Мест пока нет</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">В категории "{activeCategory}" сейчас все окна забронированы. Менторы скоро обновят расписание!</p>
           </div>
        </div>
      )}

      {/* AI Search CTA Block */}
      <div className="p-10 md:p-24 rounded-[64px] bg-gradient-to-br from-indigo-950/40 to-black border border-white/5 relative overflow-hidden group shadow-3xl mt-12">
        <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <Zap className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left">
           <div className="space-y-4">
             <div className="flex items-center justify-center lg:justify-start gap-3 text-indigo-400 mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em]">AI Assistant Matching</span>
             </div>
             <h2 className="text-4xl md:text-7xl font-black text-white uppercase font-syne leading-none tracking-tighter">НАЙТИ ПАРТНЕРА<br/>ПО ЭНЕРГИИ</h2>
             <p className="text-slate-400 text-lg max-w-lg font-medium italic opacity-80">Опиши свою задачу, и искусственный интеллект подберет ментора с максимально подходящим опытом.</p>
           </div>
           <button 
             onClick={() => setIsAISearchOpen(true)} 
             className="px-12 py-7 bg-indigo-600 text-white rounded-[28px] font-black uppercase text-xs tracking-widest flex items-center gap-4 transition-all hover:scale-105 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 active:scale-95"
           >
             Запустить AI Поиск <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      {isAISearchOpen && (
        <AISearchModal 
          mentors={mentors} 
          onClose={() => setIsAISearchOpen(false)} 
          onSelectMentor={(m) => { 
            setIsAISearchOpen(false); 
            if (onSelectMentorFromSearch) onSelectMentorFromSearch(m); 
          }} 
        />
      )}
    </div>
  );
};
