
import React from 'react';
import { Service } from '../types';
import { ArrowRight, Zap, ShieldCheck, Heart } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        onClick(service);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(service);
      }}
      className="group relative bg-[#0d0d0f] rounded-[48px] border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/30 active:scale-[0.98] transition-all duration-300 flex flex-col h-[520px] shadow-2xl select-none touch-manipulation"
    >
      {/* Media Header (Charity Lot Style) */}
      <div className="h-2/3 relative overflow-hidden shrink-0 pointer-events-none">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover grayscale-[0.5] md:group-hover:grayscale-0 md:group-hover:scale-110 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1d23] to-black flex items-center justify-center">
             <span className="text-white/5 font-black text-6xl font-syne tracking-tighter uppercase">ЛОТ</span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent opacity-80" />
        
        {/* Tags */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-col gap-2 md:gap-3">
           <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl w-fit">
             {service.category}
           </span>
           <span className="px-4 py-2 bg-black/80 backdrop-blur-xl text-white rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 w-fit">
             {service.duration}
           </span>
        </div>

        {/* Floating Verified Badge */}
        <div className="absolute bottom-6 left-6 md:left-8 flex items-center gap-3">
           <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
           </div>
           <div className="space-y-0.5">
              <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Лот</p>
              <p className="text-[10px] font-bold text-white uppercase tracking-tight">Верифицирован</p>
           </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-xl md:text-2xl font-black text-white leading-[1.1] uppercase font-syne tracking-tight md:group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-500 text-[11px] md:text-xs font-medium leading-relaxed italic line-clamp-2">
            «{service.description}»
          </p>
        </div>

        <div className="flex items-end justify-between pt-4 md:pt-6 border-t border-white/5">
           <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Энергообмен</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-black text-white font-syne tracking-tighter">{service.price.toLocaleString()}</span>
                <span className="text-xs font-bold text-white/20 uppercase">₽</span>
              </div>
           </div>

           <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-black shadow-2xl transform transition-all duration-300 md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
           </div>
        </div>
      </div>
    </div>
  );
};
