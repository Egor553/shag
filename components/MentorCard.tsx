import React, { useState } from 'react';
import { Mentor } from '../types';
import { MapPin, Zap, User } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onClick: (mentor: Mentor) => void;
}

const getTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'Active';
  const now = new Date();
  const past = new Date(dateStr);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  if (diffInMins < 60) return `${diffInMins}m`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${Math.floor(diffInHours / 24)}d`;
};

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const photoUrl = mentor.paymentUrl || mentor.avatarUrl;

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onClick(mentor)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(mentor); }}
      className="group relative h-[420px] md:h-[620px] rounded-[32px] md:rounded-[40px] overflow-hidden cursor-pointer bg-[#0a0a0b] border border-white/5 transition-all duration-500 md:hover:shadow-[0_0_50px_rgba(79,70,229,0.15)] active:scale-[0.98] select-none touch-manipulation"
    >
      <div className="absolute inset-0 pointer-events-none">
        {!imgError && photoUrl ? (
          <img 
            src={photoUrl} 
            alt={mentor.name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-black flex items-center justify-center">
            <User className="w-16 md:w-24 h-16 md:h-24 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
      </div>

      <div className="absolute top-4 md:top-5 inset-x-4 md:inset-x-5 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[7px] md:text-[8px] font-black text-white uppercase tracking-widest">
             {(mentor.industry || 'Business').split(' / ')[0]}
          </div>
          <div className="flex items-center gap-1.5 px-1 py-1 text-white/40 text-[7px] font-bold uppercase tracking-widest">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             {getTimeAgo(mentor.createdAt)}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-5 md:inset-x-6 bottom-5 md:bottom-6 space-y-4 md:space-y-5 z-10 pointer-events-none">
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">ТОП МЕНТОР</span>
          </div>
          <h3 className="text-2xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase font-syne">
            {mentor.name.split(' ')[0]}<br/>
            <span className="opacity-40">{mentor.name.split(' ').slice(1).join(' ')}</span>
          </h3>
        </div>

        <div className="pt-4 md:pt-5 border-t border-white/10 flex items-center justify-between">
           <div className="space-y-0.5">
              <span className="text-[6px] md:text-[7px] font-bold text-white/30 uppercase tracking-widest">Энергообмен</span>
              <p className="text-lg md:text-3xl font-black text-white tracking-tighter leading-none font-syne">
                {mentor.groupPrice || mentor.singlePrice} <span className="text-[10px] md:text-xs font-bold text-white/40">₽</span>
              </p>
           </div>
           
           <div className="flex items-center gap-1.5 text-white/60">
             <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
             <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{mentor.city || 'Планета'}</span>
           </div>
        </div>
      </div>
    </div>
  );
};