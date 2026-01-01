
import React from 'react';
import { Service } from '../types';
import { Clock, Tag, ArrowRight, User, Zap, Globe, MapPin, Users as UsersIcon, ShieldCheck, AlertCircle } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const isFull = (service.maxParticipants || 1) <= (service.currentParticipants || 0);

  return (
    <div 
      onClick={() => onClick(service)}
      className="group relative bg-[#0a0a0b] rounded-[40px] border border-white/5 overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Media Top */}
      <div className="h-64 relative bg-slate-900 overflow-hidden shrink-0">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-black flex items-center justify-center text-white/5 font-black text-6xl font-syne">ШАГ</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
           <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-xl">
             {service.category}
           </span>
           <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">
             {service.duration}
           </span>
           {isFull && (
             <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest animate-pulse">
               Мест нет
             </span>
           )}
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-xl">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Профи верифицирован</span>
        </div>

        <div className="absolute bottom-5 right-5 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
             <Zap className="w-3 h-3 fill-current" />
             <span className="text-[8px] font-black uppercase tracking-[0.3em]">Premium Experience</span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight uppercase font-syne group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 italic">
            «{service.description}»
          </p>
        </div>

        {/* Mentor Info Small */}
        <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-3xl mt-auto group-hover:bg-white/[0.05] transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Ведущий ШАГа</p>
            <p className="text-sm font-bold text-slate-200 truncate uppercase font-syne">{service.mentorName}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Энергообмен</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tighter leading-none">{service.price}</span>
              <span className="text-xs font-bold text-slate-600">₽</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-slate-500">
            <div className="flex items-center gap-1.5">
               <span className="text-[8px] font-black uppercase tracking-widest">{service.format}</span>
               <Globe className="w-3 h-3" />
            </div>
            {isFull ? (
              <span className="text-[7px] font-black uppercase tracking-widest text-red-500">Запись закрыта</span>
            ) : (
              <span className="text-[7px] font-bold uppercase tracking-widest opacity-40">Места есть</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
