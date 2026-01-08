
import React, { useState, useEffect } from 'react';
import { Layers, Heart, Activity, Search, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Mentor, Service, Booking } from '../../types';
import { ServiceCard } from '../ServiceCard';
import { INDUSTRIES } from '../../constants';
import { AISearchModal } from '../AISearchModal';

interface CatalogViewProps {
  services: Service[];
  mentors: Mentor[];
  bookings: Booking[];
  onServiceClick: (service: Service) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ services, mentors, bookings, onServiceClick }) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [showAIModal, setShowAIModal] = useState(false);
  const [pulseValue, setPulseValue] = useState(0);

  useEffect(() => {
    const total = bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + (b.price || 0), 0);
    setPulseValue(total + 1250000); // Базовая сумма для имитации солидности
  }, [bookings]);

  const filteredServices = services.filter(s => activeCategory === 'Все' || s.category === activeCategory);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-1000 pb-32">
      {/* Platform Pulse Hero */}
      <div className="relative pt-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between border-b border-white/5 pb-16">
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-4 text-indigo-500">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">PLATFORM_PULSE_LIVE</span>
            </div>
            <h1 className="text-[10vw] md:text-[8rem] font-black text-white tracking-tighter leading-[0.8] uppercase font-syne">
              АКТИВНЫЕ<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/10 italic">ЛОТЫ</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Встречи с лидерами рынка. Весь доход направляется на развитие предпринимательской экосистемы и образовательные гранты.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:mb-4">
            <button 
              onClick={() => setShowAIModal(true)}
              className="group relative p-8 bg-indigo-600 rounded-[40px] shadow-2xl overflow-hidden hover:scale-105 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-start gap-4 text-left">
                <Sparkles className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-black text-xl uppercase font-syne leading-none">ИИ-ПОДБОР</p>
                  <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">Найди свой резонанс</p>
                </div>
              </div>
            </button>

            <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-4 min-w-[320px] relative group overflow-hidden">
               <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex justify-between items-start relative z-10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Общий фонд ШАГа</p>
                  <Activity className="w-4 h-4 text-indigo-500" />
               </div>
               <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-white font-syne tracking-tighter">{pulseValue.toLocaleString()}</span>
                  <span className="text-lg font-bold text-white/30">₽</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sticky top-0 z-50 py-6 bg-[#1a1d23]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {INDUSTRIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat 
                ? 'bg-white text-black border-white' 
                : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 px-2">
           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Отображено: {filteredServices.length}</span>
        </div>
      </div>

      {/* Grid of Charity Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="animate-in slide-in-from-bottom-8 duration-700">
              <ServiceCard service={service} onClick={() => onServiceClick(service)} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                <Layers className="w-10 h-10" />
             </div>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">В этой категории пока нет лотов</p>
          </div>
        )}
      </div>

      {/* AI Modal integration */}
      {showAIModal && (
        <AISearchModal 
          mentors={mentors} 
          onClose={() => setShowAIModal(false)} 
          onSelectMentor={(mentor) => {
            const firstService = services.find(s => String(s.mentorId) === String(mentor.id) || String(s.mentorId).toLowerCase() === String(mentor.email).toLowerCase());
            if (firstService) onServiceClick(firstService);
            setShowAIModal(false);
          }}
        />
      )}

      {/* Footer Support Message */}
      <div className="pt-20 border-t border-white/5 flex flex-col items-center text-center space-y-6">
         <Heart className="w-12 h-12 text-white/10" />
         <p className="text-slate-500 text-sm max-w-xl font-medium leading-relaxed italic">
           «Каждый ШАГ на нашей платформе — это инвестиция в будущее. Предприниматели отдают время, вы отдаете энергию. Мы вместе создаем новый стандарт бизнес-образования.»
         </p>
      </div>
    </div>
  );
};
