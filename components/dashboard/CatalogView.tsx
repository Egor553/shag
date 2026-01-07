
import React, { useState } from 'react';
import { UserX, Zap, Layers, ChevronDown, X, Filter, Sparkles, TrendingUp, Heart, AlertCircle, Search, Quote } from 'lucide-react';
import { Mentor, Service } from '../../types';
import { ServiceCard } from '../ServiceCard';
import { INDUSTRIES } from '../../constants';
import { AISearchModal } from '../AISearchModal';

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
  const [showAIModal, setShowAIModal] = useState(false);

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
          <div className="absolute -top-10 left-0 hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
             <Heart size={12} className="text-indigo-500 fill-current" />
             <span className="text-[9px] font-black text-white uppercase tracking-widest">Принцип Meet for Charity</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h1 className="text-[12vw] sm:text-8xl md:text-[9.5rem] font-black text-white tracking-tighter leading-[0.85] uppercase font-syne">
              ЭНЕРГО<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10 italic">ОБМЕН ШАГ</span>
            </h1>
            
            <button 
              onClick={() => setShowAIModal(true)}
              className="lg:mb-4 px-10 py-8 bg-indigo-600 rounded-tr-[40px] rounded-bl-[40px] text-white flex items-center gap-6 group hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
            >
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">ИНТЕЛЛЕКТУАЛЬНЫЙ</p>
                <p className="text-xl font-black uppercase font-syne">ПОДБОР ЛОТА</p>
              </div>
              <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
          
          <div className="mt-6 md:mt-10 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
             <div className="w-12 h-px bg-white/10" />
             ВЫБЕРИТЕ ВСТРЕЧУ И СДЕЛАЙТЕ СВОЙ ВКЛАД В ФОНД
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
      </div>

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
              <p className="text-white/40 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto">В категории "{activeCategory}" ещё не опубликовано ни одного лота.</p>
           </div>
        </div>
      )}

      {showAIModal && (
        <AISearchModal 
          mentors={mentors} 
          onClose={() => setShowAIModal(false)} 
          onSelectMentor={(mentor) => {
            const firstService = services.find(s => s.mentorId === mentor.id || s.mentorId === mentor.email);
            if (firstService) onServiceClick(firstService);
            setShowAIModal(false);
          }}
        />
      )}
    </div>
  );
};
