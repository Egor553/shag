
import React from 'react';
import { Mentor } from '../types';
import { MapPin, Star, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onClick: (mentor: Mentor) => void;
}

const getTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'недавно';
  const now = new Date();
  const past = new Date(dateStr);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMins < 1) return 'только что';
  if (diffInMins < 60) return `${diffInMins} мин. назад`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours} ч. назад`;
  return `${Math.floor(diffInHours / 24)} дн. назад`;
};

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mentor)}
      className="group relative bg-white rounded-[44px] overflow-hidden border border-slate-100/80 shadow-2xl shadow-slate-200/40 hover:shadow-indigo-500/10 transition-all duration-700 cursor-pointer flex flex-col h-[560px] hover:-translate-y-2"
    >
      <div className="relative h-[280px] overflow-hidden shrink-0">
        <img 
          src={mentor.avatarUrl} 
          alt={mentor.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl truncate max-w-[150px]">
              {mentor.industry.split(' / ')[0]}
            </span>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold text-white/80">
              <Clock className="w-3 h-3" />
              {getTimeAgo(mentor.createdAt)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-indigo-600 hover:border-indigo-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Premium Mentor</span>
          </div>
          <h3 className="text-3xl font-black leading-none tracking-tight flex items-center gap-2">
            <span className="truncate">{mentor.name}</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/10 shrink-0" />
          </h3>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1 bg-white min-h-0">
        <div className="flex-1 overflow-hidden">
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-4 line-clamp-3 overflow-hidden">
            {mentor.description}
          </p>
        </div>
        
        <div className="mt-4 pt-6 border-t border-slate-50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Доступен за</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter truncate leading-none">
                {mentor.groupPrice} ₽
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50/50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent shrink-0">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{mentor.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
