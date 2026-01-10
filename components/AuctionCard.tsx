
import React, { useState, useEffect } from 'react';
import { Service, Auction } from '../types';
import { Timer, Gavel, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

interface AuctionCardProps {
  service: Service;
  auction: Auction;
  onClick: (service: Service) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ service, auction, onClick }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(auction.endsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('ЗАВЕРШЕНО');
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}д ${hours}ч ${mins}м ${secs}с`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endsAt]);

  return (
    <div 
      onClick={() => onClick(service)}
      className="group relative bg-[#050505] rounded-[48px] border border-amber-500/20 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all duration-700 flex flex-col h-[620px] shadow-[0_0_40px_rgba(212,175,55,0.05)]"
    >
      {/* Premium Badge */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      <div className="h-3/5 relative overflow-hidden shrink-0">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1d23] to-black flex items-center justify-center">
             <span className="text-amber-500/10 font-black text-8xl font-syne tracking-tighter">LOT</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
        
        {/* Status Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
             <Gavel size={12} /> АУКЦИОН
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-xl text-amber-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/30">
             <Timer size={12} className="animate-pulse" /> {timeLeft}
           </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-amber-500/50 uppercase tracking-[0.3em]">ТЕКУЩАЯ СТАВКА</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-white font-syne tracking-tighter">{auction.currentBid.toLocaleString()}</span>
                 <span className="text-xl font-bold text-amber-500">₽</span>
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Ставок сделано</span>
              <div className="px-3 py-1 bg-white/5 rounded-lg text-white font-black text-xs border border-white/10">
                {auction.bidsCount}
              </div>
           </div>
        </div>
      </div>

      <div className="p-10 flex flex-col justify-between flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500/60">
             <TrendingUp size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">ГОРЯЧИЙ ЛОТ</span>
          </div>
          <h3 className="text-3xl font-black text-white leading-[1] uppercase font-syne tracking-tight group-hover:text-amber-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed italic line-clamp-2">
            «{service.description}»
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                 <ShieldCheck size={18} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Организатор</p>
                 <p className="text-[10px] font-bold text-white uppercase tracking-tight">{service.mentorName}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 text-pink-500/50">
              <Heart size={16} />
              <span className="text-[8px] font-black uppercase tracking-widest">На благотворительность</span>
           </div>
        </div>
      </div>
    </div>
  );
};
