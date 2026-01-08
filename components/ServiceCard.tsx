
import React from 'react';
import { Service } from '../types';
import { ArrowRight, User, Zap, Globe, ShieldCheck, Heart } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const isFull = (service.maxParticipants || 1) <= (service.currentParticipants || 0);

  return (
    <div 
      onClick={() => onClick(service)}
      className="group relative bg-[#0d0d0f] rounded-[48px] border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all duration-700 flex flex-col h-[520px] shadow-2xl"
    >
      {/* Media Header (Charity Lot Style) */}
      <div className="h-2/3 relative overflow-hidden shrink-0">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1d23] to-black flex items-center justify-center">
             <span className="text-white/5 font-black text-6xl font-syne tracking-tighter">ЛОТ</span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent opacity-80" />
        
        {/* Tags */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
           <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl w-fit">
             {service.category}
           </span>
           <span className="px-4 py-2 bg-black/80 backdrop-blur-xl text-white rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 w-fit">
             {service.duration}
           </span>
        </div>

        {/* Floating Verified Badge */}
        <div className="absolute bottom-6 left-8 flex items-center gap-3">
           <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <div className="space-y-0.5">
              <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Статус лота</p>
              <p className="text-[10px] font-bold text-white uppercase tracking-tight">Верифицирован</p>
           </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-10 flex flex-col justify-between flex-1">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white leading-[1.1] uppercase font-syne tracking-tight group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed italic line-clamp-2">
            «{service.description}»
          </p>
        </div>

        <div className="flex items-end justify-between pt-6 border-t border-white/5">
           <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Энергообмен</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-syne tracking-tighter">{service.price.toLocaleString()}</span>
                <span className="text-xs font-bold text-white/20 uppercase">₽</span>
              </div>
           </div>

           <button className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-black shadow-2xl transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
              <ArrowRight className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
};
