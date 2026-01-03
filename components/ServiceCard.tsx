
import React from 'react';
import { Service } from '../types';
import { ArrowRight, User, Zap, Globe, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const isFull = (service.maxParticipants || 1) <= (service.currentParticipants || 0);

  return (
    <div 
      onClick={() => onClick(service)}
      className="group relative bg-[#0a0a0b] rounded-[32px] md:rounded-[40px] border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full shadow-2xl"
    >
      {/* Media Header */}
      <div className="h-40 md:h-60 relative bg-[#0d0d0f] overflow-hidden shrink-0">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-3xl md:text-5xl font-syne select-none">ШАГ</div>
        )}
        {/* Removed heavy darkening gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/40 via-transparent to-transparent opacity-40" />
        
        {/* Floating Tags */}
        <div className="absolute top-3 md:top-5 left-3 md:left-5 flex flex-wrap gap-1.5 md:gap-2 max-w-[calc(100%-24px)] md:max-w-[calc(100%-40px)]">
           <span className="px-2 md:px-3 py-1 bg-indigo-600 text-white rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-xl">
             {service.category}
           </span>
           <span className="px-2 md:px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest border border-white/10">
             {service.duration}
           </span>
           {isFull && (
             <span className="px-2 md:px-3 py-1 bg-red-600 text-white rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest animate-pulse">
               МЕСТ НЕТ
             </span>
           )}
        </div>

        <div className="absolute bottom-3 md:bottom-5 right-3 md:right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-2xl">
            <ArrowRight size={20} className="md:w-6 md:h-6" />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 md:p-8 flex flex-col flex-1 min-h-0">
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-indigo-400">
             <Zap size={10} className="fill-current" />
             <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em]">Premium Experience</span>
          </div>
          
          <h3 className="text-lg md:text-2xl font-black text-white leading-tight uppercase font-syne break-words group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          
          <p className="text-slate-500 text-[11px] md:text-[13px] font-medium leading-relaxed italic line-clamp-2 md:line-clamp-3 break-words">
            «{service.description}»
          </p>
        </div>

        {/* Meta Info */}
        <div className="mt-auto space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl group-hover:bg-white/[0.04] transition-all">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
              <User size={14} className="md:w-4 md:h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[6px] md:text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-0.5 md:mb-1">Ментор</p>
              <p className="text-xs md:text-sm font-bold text-slate-200 truncate uppercase font-syne">{service.mentorName}</p>
            </div>
            <ShieldCheck size={12} className="text-emerald-500 shrink-0 md:w-3.5 md:h-3.5" />
          </div>

          <div className="pt-4 md:pt-6 border-t border-white/5 flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest block">Обмен</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-3xl font-black text-white tracking-tighter leading-none">{service.price.toLocaleString()}</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase">₽</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 text-slate-500">
               <div className="flex items-center gap-1">
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{service.format.split(' ')[0]}</span>
                  <Globe size={10} className="md:w-3 md:h-3" />
               </div>
               <span className={`text-[6px] md:text-[7px] font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-emerald-500/60'}`}>
                 {isFull ? 'Закрыто' : 'Свободно'}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
