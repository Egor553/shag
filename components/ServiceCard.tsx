
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
      className="group relative bg-[#0a0a0b] rounded-[40px] border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full shadow-2xl"
    >
      {/* Media Header */}
      <div className="h-60 relative bg-[#0d0d0f] overflow-hidden shrink-0">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-5xl font-syne select-none">ШАГ</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-80" />
        
        {/* Floating Tags */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2 max-w-[calc(100%-40px)]">
           <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-xl">
             {service.category}
           </span>
           <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">
             {service.duration}
           </span>
           {isFull && (
             <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest animate-pulse">
               FULL
             </span>
           )}
        </div>

        <div className="absolute bottom-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl">
            <ArrowRight size={24} />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 flex flex-col flex-1 min-h-0">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-indigo-400">
             <Zap size={12} className="fill-current" />
             <span className="text-[8px] font-black uppercase tracking-[0.3em]">Premium Experience</span>
          </div>
          
          <h3 className="text-2xl font-black text-white leading-none uppercase font-syne break-words group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          
          <p className="text-slate-500 text-[13px] font-medium leading-relaxed italic line-clamp-3 break-words">
            «{service.description}»
          </p>
        </div>

        {/* Meta Info */}
        <div className="mt-auto space-y-6">
          <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-all">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Mentor</p>
              <p className="text-sm font-bold text-slate-200 truncate uppercase font-syne">{service.mentorName}</p>
            </div>
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
          </div>

          <div className="pt-6 border-t border-white/5 flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Exchange</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tighter leading-none">{service.price.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-600 uppercase">₽</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 text-slate-500">
               <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest">{service.format}</span>
                  <Globe size={12} />
               </div>
               <span className={`text-[7px] font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-emerald-500/60'}`}>
                 {isFull ? 'Booking Closed' : 'Slots Available'}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
