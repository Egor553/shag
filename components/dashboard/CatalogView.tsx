
import React, { useState } from 'react';
import { ArrowRight, Filter, LayoutGrid, Sparkles } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';

interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  onServiceClick: (service: Service) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, onServiceClick }) => {
  const [activeCategory, setActiveCategory] = useState('Все');

  // Определяем список категорий динамически на основе имеющихся услуг + стандартные
  const categories = ['Все', ...new Set(services.map(s => s.category).filter(Boolean))];
  
  // Если стандартные категории из макета (Marketing, Tech и т.д.) нужны как дефолтные:
  const displayCategories = categories.length > 1 ? categories : ['Все', 'Маркетинг', 'IT', 'HoReCa', 'Продажи'];

  const filteredServices = activeCategory === 'Все' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-12 md:space-y-24 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-indigo-500 font-bold text-[9px] uppercase tracking-[0.4em]">Marketplace of Steps</span>
          </div>
          <h1 className="text-[12vw] sm:text-7xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.9] uppercase font-syne">
            УСЛУГИ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">ШАГОВ</span>
          </h1>
        </div>

        {/* Filter Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
           {displayCategories.map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)}
               className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shrink-0 transition-all duration-300 border ${
                 activeCategory === cat 
                 ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
                 : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20 hover:text-white'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredServices.map((service, idx) => (
            <div key={service.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: `${idx * 100}ms` }}>
              <ServiceCard 
                service={service} 
                onClick={onServiceClick} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] animate-in fade-in zoom-in duration-500">
           <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700">
              <LayoutGrid className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase font-syne">Пусто в "{activeCategory}"</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">В этой категории пока нет активных предложений. Попробуйте выбрать другое направление.</p>
           </div>
           <button 
             onClick={() => setActiveCategory('Все')}
             className="text-indigo-500 font-black uppercase text-[10px] tracking-widest hover:text-indigo-400 transition-colors"
           >
             Показать все услуги
           </button>
        </div>
      )}

      {/* AI Search CTA */}
      <div className="p-8 md:p-20 rounded-[32px] md:rounded-[48px] bg-indigo-950/20 border border-white/5 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
        <div className="relative z-10 space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
           <div className="space-y-3">
             <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">AI Assistant</span>
             </div>
             <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase font-syne leading-none">УМНЫЙ ПОИСК</h2>
             <p className="text-slate-400 text-sm md:text-lg max-w-sm">Опишите вашу проблему, и наш AI подберет конкретную услугу, которая решит ваш запрос.</p>
           </div>
           <button className="w-full lg:w-auto px-10 py-6 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/30">
             Найти решение <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};
