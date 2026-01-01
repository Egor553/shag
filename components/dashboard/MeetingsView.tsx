
import React from 'react';
import { Booking, UserSession, UserRole } from '../../types';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Timer, CreditCard, ExternalLink, MessageSquare } from 'lucide-react';

interface MeetingsViewProps {
  bookings: Booking[];
  session: UserSession;
  onOpenChat: (booking: Booking) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ bookings, session, onOpenChat }) => {
  const isEnt = session.role === UserRole.ENTREPRENEUR;
  
  const myBookings = bookings.filter(b => 
    isEnt ? (String(b.mentorId) === String(session.id) || String(b.mentorId) === String(session.email))
          : (String(b.userEmail).toLowerCase() === String(session.email).toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (myBookings.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center text-slate-700">
          <CalendarIcon className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">ГРАФИК ПУСТ</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">Здесь появятся ваши подтвержденные ШАГи и новые запросы на энергообмен.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-emerald-500" />
          <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-[0.4em]">Schedule & Logs</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase font-syne">
          ВАШИ<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">ВСТРЕЧИ</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myBookings.map((booking, idx) => (
          <div 
            key={booking.id} 
            className="group bg-[#0a0a0b] border border-white/5 p-8 md:p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-500/30 transition-all duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[28px] flex flex-col items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{booking.date.split('-')[1]}</span>
                <span className="text-3xl font-black font-syne leading-none">{booking.date.split('-')[2]}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-500'}`}>
                    {booking.status === 'confirmed' ? 'Подтверждено' : 'Ожидает оплаты'}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                    <Clock className="w-3 h-3" /> {booking.time}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase font-syne">{booking.serviceTitle}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">{isEnt ? `От: ${booking.userName}` : `Ментор: ${booking.mentorId}`}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="text-center md:text-right space-y-1 min-w-[120px]">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Сумма ШАГа</span>
                <p className="text-2xl font-black text-white font-syne">{booking.price} <span className="text-xs text-slate-600">₽</span></p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => onOpenChat(booking)}
                    className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
                  >
                    Чат <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                {booking.status === 'pending' && !isEnt && (
                  <button className="flex-1 sm:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                    Оплатить <CreditCard className="w-4 h-4" />
                  </button>
                )}
                <button className="flex-1 sm:flex-none bg-white/5 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10">
                  Детали <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
