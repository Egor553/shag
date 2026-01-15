
import React, { useState, useEffect } from 'react';
import { Layers, Activity, Sparkles } from 'lucide-react';
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
    setPulseValue(total + 2450000);
  }, [bookings]);

  const filteredServices = services.filter(s => activeCategory === 'Все' || s.category === activeCategory);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-1000 pb-32">
      <div className="relative pt-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between border-b border-white/5 pb-16">
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-4 text-white/40">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">ПУЛЬС_ПЛАТФОРМЫ_LIVE</span>
            </div>
            <h1 className="text-[10vw] md:text-[8rem] font-black text-white tracking-tighter leading-[0.8] uppercase font-syne">
              ВИТРИНА<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-violet-500 italic">ОПЫТА</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Выбирайте ментора и формат взаимодействия. Прямой доступ к лучшим предпринимателям сообщества.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:mb-4">
            <button
              onClick={() => setShowAIModal(true)}
              className="group relative p-6 md:p-8 bg-indigo-600 rounded-[40px] shadow-2xl overflow-hidden hover:scale-105 transition-all duration-500 w-full"
            >
              <div className="relative z-10 flex flex-col items-start gap-4 text-left">
                <Sparkles className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-black text-xl uppercase font-syne leading-none">ИИ-РЕЗОНАНС</p>
                  <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">Подбор ментора</p>
                </div>
              </div>
            </button>

            <div className="p-6 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-4 w-full">
              <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Объем энергообмена</p>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-syne tracking-tighter break-all">{pulseValue.toLocaleString()}</span>
                <span className="text-lg font-bold text-white/30">₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sticky top-0 z-50 py-6 bg-[#1a1d23]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {INDUSTRIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-4">
          <Layers className="text-indigo-500" />
          <h2 className="text-3xl font-black text-white uppercase font-syne tracking-tight">ДОСТУПНЫЕ ШАГИ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const mentor = mentors.find(m => m.id === service.mentorId);
              return (
                <div key={service.id} className="animate-in slide-in-from-bottom-8 duration-700">
                  <ServiceCard service={service} mentorName={mentor?.name} onClick={() => onServiceClick(service)} />
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
              <Layers className="w-16 h-16" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">В этой категории еще нет предложений</p>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};
