
import React, { useState } from 'react';
import { ArrowRight, Filter, LayoutGrid, Sparkles, UserX, Zap, Star } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';

interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  onServiceClick: (service: Service) => void;
  onSelectMentorFromSearch?: (mentor: Mentor) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, onServiceClick, onSelectMentorFromSearch }) => {
  const [activeCategory, setActiveCategory] = useState('Все');

  // Фильтрация только по категории, чтобы все видели все услуги
  const filteredServices = services.filter(s => {
    return activeCategory === 'Все' || s.category === activeCategory;
  });

  const categories = ['Все', ...new Set(services.map(s => s.category).filter(Boolean))];

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

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredServices.map((service, idx) => (
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
              <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">Пока пусто</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">В этой категории еще нет опубликованных ШАГов.</p>
           </div>
        </div>
      )}
    </div>
  );
};
