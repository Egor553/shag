
import React, { useState } from 'react';
import { UserX, Zap, Layers } from 'lucide-react';
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
    <div className="space-y-16 md:space-y-28 animate-in fade-in duration-1000 pb-20">
      <div className="space-y-12">
        <div className="space-y-8 relative">
          <div className="relative">
            {/* Исправлен leading для предотвращения наезда букв и добавлен чисто белый цвет */}
            <h1 className="text-[14vw] sm:text-8xl md:text-[9.5rem] font-black text-white tracking-tighter leading-[0.95] uppercase font-syne">
              СДЕЛАЙ<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10 italic">СВОЙ ШАГ</span>
            </h1>
            <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block" />
          </div>
        </div>

        {/* Categories Redesign with higher contrast */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-4 -mx-4 px-4">
           {categories.map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)} 
               className={`whitespace-nowrap px-10 py-4 rounded-tr-3xl rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.3em] border transition-all duration-500 ${activeCategory === cat ? 'bg-white text-black border-white shadow-[0_10px_40px_rgba(255,255,255,0.1)]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/30 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
          {filteredServices.map((service, idx) => (
            <div key={service.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
              <ServiceCard service={service} onClick={onServiceClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 md:py-48 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[64px] backdrop-blur-sm">
           <Layers size={64} className="text-white opacity-10" />
           <div className="space-y-3">
              <h3 className="text-2xl font-black text-white uppercase font-syne tracking-tight">NULL_DATA_DETECTED</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Система ожидает новых публикаций</p>
           </div>
        </div>
      )}
    </div>
  );
};
