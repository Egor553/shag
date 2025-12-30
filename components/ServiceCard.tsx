
import React from 'react';
import { Service } from '../types';
import { Clock, Tag, ArrowRight, User } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      onClick={() => onClick(service)}
      className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full relative group"
    >
      <div className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <ArrowRight className="w-6 h-6" />
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{service.category}</span>
          <span className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{service.title}</h3>
        
        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-2xl">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Наставник</p>
            <p className="text-xs font-bold text-slate-700">{service.mentorName}</p>
          </div>
        </div>

        <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8 flex-1">
          {service.description}
        </p>
        
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Энергообмен</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{service.price} ₽</span>
          </div>
          <div className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Записаться</div>
        </div>
      </div>
    </div>
  );
};
