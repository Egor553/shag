
import React, { useState } from 'react';
import { UserX } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';

interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  onServiceClick: (service: Service) => void;
  onSelectMentorFromSearch?: (mentor: Mentor) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, onServiceClick }) => {
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredServices = services.filter(s => {
    return activeCategory === 'Все' || s.category === activeCategory;
  });

  const categories = ['Все', ...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div className="space-y-12 md:space-y-24 animate-in fade-in duration-1000 pb-20">
      <div className="space-y-8 md:space-y-10">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 md:w-10 h-px bg-indigo-500/40" />
            <span className="text-indigo-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em]">Selected Experience</span>
          </div>
          <h1 className="text-[12vw] sm:text-7xl md:text-[9.5rem] font-black text-white tracking-tighter leading-[0.8] uppercase font-syne">
            СДЕЛАЙ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/60">СВОЙ ШАГ</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
           {categories.map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)} 
               className={`whitespace-nowrap px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest border transition-all duration-300 ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredServices.map((service, idx) => (
            <div key={service.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <ServiceCard service={service} onClick={onServiceClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 md:py-40 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[32px] md:rounded-[48px]">
           <UserX size={32} className="text-slate-800 md:size-48" />
           <div className="space-y-1 md:space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase font-syne tracking-tight">Ничего не найдено</h3>
              <p className="text-slate-500 text-[10px] md:text-xs max-w-[200px] md:max-w-xs mx-auto font-medium uppercase tracking-widest opacity-60">В этой категории еще нет ШАГов.</p>
           </div>
        </div>
      )}
    </div>
  );
};
