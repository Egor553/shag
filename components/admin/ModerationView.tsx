
import React, { useState } from 'react';
import { UserSession } from '../../types';
import { Check, X, Eye, ShieldCheck, Heart } from 'lucide-react';

interface ModerationViewProps {
  pendingUsers: UserSession[];
  onApprove: (user: UserSession) => Promise<void>;
  onReject: (user: UserSession) => Promise<void>;
  onInspect: (user: UserSession) => void;
}

export const ModerationView: React.FC<ModerationViewProps> = ({ pendingUsers, onApprove, onReject, onInspect }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (user: UserSession, action: 'approve' | 'reject') => {
    setProcessingId(user.id);
    try {
      if (action === 'approve') await onApprove(user);
      else await onReject(user);
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <div className="py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
           <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-white uppercase font-syne">Очередь пуста</h3>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Все заявки предпринимателей обработаны</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {pendingUsers.map((user) => (
        <div key={user.id} className="bg-[#0a0a0b] border border-white/5 p-8 md:p-10 rounded-[48px] flex flex-col lg:flex-row items-center justify-between gap-10 group hover:border-indigo-500/30 transition-all duration-500">
          <div className="flex-1 space-y-8 w-full">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center text-indigo-500 font-black text-3xl uppercase font-syne border border-white/5">
                {user.name[0]}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white uppercase font-syne tracking-tight">{user.name}</h3>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-amber-500/20">На модерации</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Оборот</span>
                  <p className="text-sm font-black text-white uppercase font-syne">{user.turnover} млн ₽</p>
               </div>
               <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Компания</span>
                  <p className="text-sm font-black text-white uppercase font-syne truncate">{user.companyName}</p>
               </div>
               <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Стаж / Ниша</span>
                  <p className="text-sm font-black text-white uppercase font-syne truncate">{user.direction}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
               {user.businessClubs && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/5 text-indigo-400 rounded-xl border border-indigo-500/10 text-[9px] font-black uppercase tracking-widest">
                    <ShieldCheck size={12} /> {user.businessClubs}
                 </div>
               )}
               {user.lifestyle && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/10 text-[9px] font-black uppercase tracking-widest">
                    <Heart size={12} /> {user.lifestyle}
                 </div>
               )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0">
             <button 
               onClick={() => onInspect(user)}
               className="flex-1 p-5 bg-white/5 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5"
             >
                <Eye size={18} /> Анкета
             </button>
             <button 
               disabled={processingId === user.id}
               onClick={() => handleAction(user, 'approve')}
               className="flex-1 p-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
             >
                <Check size={18} /> Одобрить
             </button>
             <button 
               disabled={processingId === user.id}
               onClick={() => handleAction(user, 'reject')}
               className="flex-1 p-5 bg-red-600 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all"
             >
                <X size={18} /> Отказать
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};
