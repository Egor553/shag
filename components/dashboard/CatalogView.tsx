
import React, { useState } from 'react';
import { UserX, Zap, Layers, ChevronDown, X, Filter, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';
import { INDUSTRIES } from '../../constants';

// Define the missing props interface for CatalogView
interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  onServiceClick: (service: Service) => void;
}

const CategoryButton: React.FC<{ cat: string; isActive: boolean; onClick: (cat: string) => void }> = ({ cat, isActive, onClick }) => (
  <button 
    onClick={() => onClick(cat)} 
    className={`
      whitespace-nowrap px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300
      ${isActive 
        ? 'bg-white text-black rounded-tr-[32px] rounded-bl-[32px] shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105 z-10' 
        : 'bg-white/5 text-white/40 border border-white/5 rounded-tr-[32px] rounded-bl-[32px] hover:bg-white/10 hover:text-white'
      }
    `}
  >
    {cat}
  </button>
);

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, onServiceClick }) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainCategories = INDUSTRIES.filter(cat => cat !== 'Все');
  const row1 = mainCategories.slice(0, 5);
  const row2 = mainCategories.slice(5, 8);
  const row3 = mainCategories.slice(8, 9);

  const filteredServices = services.filter(s => {
    return activeCategory === 'Все' || s.category === activeCategory;
  });

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="space-y-10 md:space-y-24 animate-in fade-in duration-1000 pb-20">
      <div className="space-y-10 md:space-y-16">
        <div className="relative">
          {/* Декоративный элемент в духе Charity */}
          <div className="absolute -top-10 left-0 flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
             <Heart size={12} className="text-indigo-500 fill-current" />
             <span className="text-[9px] font-black text-white uppercase tracking-widest">Экосистема Вклада и Роста</span>
          </div>

          <h1 className="text-[12vw] sm:text-8xl md:text-[9.5rem] font-black text-white tracking-tighter leading-[0.95] uppercase font-syne">
            СДЕЛАЙ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10 italic">СВОЙ ШАГ</span>
          </h1>
          
          <div className="mt-6 md:mt-10 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
             <div className="w-12 h-px bg-white/10" />
             ВЫБИРАЙ УЧАСТНИКА ДЛЯ ЭНЕРГООБМЕНА
          </div>
        </div>

        {/* Desktop Categories Pyramid */}
        <div className="hidden md:flex flex-col items-center gap-6">
           <div className="flex justify-center">
              <button 
                onClick={() => handleCategorySelect('Все')}
                className={`px-12 py-5 font-black text-[11px] uppercase tracking-[0.4em] rounded-full transition-all border-2 ${activeCategory === 'Все' ? 'bg-white text-black border-white shadow-2xl' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white'}`}
              >
                ВСЕ КАТЕГОРИИ
              </button>
           </div>
           <div className="flex justify-center gap-4 w-full">
              {row1.map(cat => <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={handleCategorySelect} />)}
           </div>
           <div className="flex justify-center gap-4 w-full">
              {row2.map(cat => <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={handleCategorySelect} />)}
           </div>
           <div className="flex justify-center gap-4 w-full">
              {row3.map(cat => <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={handleCategorySelect} />)}
           </div>
        </div>

        {/* Mobile Category Selector */}
        <div className="md:hidden flex items-center justify-between bg-white/[0.05] border border-white/10 p-5 rounded-[24px] backdrop-blur-xl">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">ВЫБРАНО</p>
              <p className="text-lg font-black text-white uppercase font-syne">{activeCategory}</p>
           </div>
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-xl"
           >
             <Filter size={14} /> КАТЕГОРИЯ
           </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl p-6 flex flex-col animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white uppercase font-syne">ВЫБОР ШАГА</h2>
                 <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-full text-white/60">
                 <X size={24} />
              </button>
           </div>
           <div className="grid grid-cols-1 gap-3 overflow-y-auto no-scrollbar pb-20">
              {INDUSTRIES.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button 
                    key={cat} 
                    onClick={() => handleCategorySelect(cat)} 
                    className={`
                      w-full p-6 font-black text-xs uppercase tracking-[0.2em] transition-all text-left flex items-center justify-between
                      ${isActive 
                        ? 'bg-white text-black rounded-tr-[32px] rounded-bl-[32px]' 
                        : 'bg-white/5 text-white/60 border border-white/5 rounded-tr-[32px] rounded-bl-[32px]'
                      }
                    `}
                  >
                    {cat}
                    {isActive && <Zap size={14} className="fill-current" />}
                  </button>
                );
              })}
           </div>
        </div>
      )}

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
          {filteredServices.map((service, idx) => (
            <div key={service.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
              <ServiceCard service={service} onClick={onServiceClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 md:py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] md:rounded-[64px] backdrop-blur-sm mx-2">
           <div className="relative">
              <Layers size={48} className="text-white opacity-5 md:w-20 md:h-20" />
              <Sparkles className="absolute -top-2 -right-2 text-white/20 animate-pulse" />
           </div>
           <div className="space-y-3">
              <h3 className="text-xl md:text-3xl font-black text-white uppercase font-syne tracking-tight">ТУТ ПОКА ПУСТО</h3>
              <p className="text-white/40 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto">В категории "{activeCategory}" ещё не опубликовано ни одного ШАГа.</p>
           </div>
           <button 
             onClick={() => setActiveCategory('Все')} 
             className="px-8 py-4 bg-white/5 text-white/60 rounded-full font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all border border-white/10"
           >
             Смотреть всё
           </button>
        </div>
      )}
    </div>
  );
};
