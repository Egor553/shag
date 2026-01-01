
import React, { useState } from 'react';
import { Booking, UserSession, UserRole } from '../../types';
import { 
  Calendar as CalendarIcon, Clock, User, 
  CreditCard, Zap, Info, XCircle, AlertCircle, RefreshCcw, ArrowRightLeft
} from 'lucide-react';
import { dbService } from '../../services/databaseService';

interface MeetingsListViewProps {
  bookings: Booking[];
  session: UserSession;
  onPay: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
  onRefresh?: () => void;
}

export const MeetingsListView: React.FC<MeetingsListViewProps> = ({ 
  bookings, 
  session, 
  onPay, 
  onReschedule,
  onRefresh 
}) => {
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const isEnt = session.role === UserRole.ENTREPRENEUR;
  
  const myBookings = [...bookings].filter(b => 
    isEnt ? (String(b.mentorId) === String(session.id) || String(b.mentorId) === String(session.email))
          : (String(b.userEmail).toLowerCase() === String(session.email).toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancel = async (booking: Booking) => {
    const personName = isEnt ? booking.userName : (booking.mentorName || 'ментора');
    if (!confirm(`Вы уверены, что хотите отменить запись ${personName}? Место снова станет доступным.`)) return;
    
    setIsCancelling(booking.id);
    try {
      const res = await dbService.cancelBooking(booking.id, isEnt ? 'Отменено ментором' : 'Отменено талантом');
      if (res.result === 'success') {
        if (onRefresh) onRefresh();
      } else {
        alert('Ошибка при отмене: ' + (res.message || 'попробуйте позже'));
      }
    } catch (e) {
      alert('Ошибка связи с сервером');
    } finally {
      setIsCancelling(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return '—';
      const d = new Date(dateStr);
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } catch { return 'Дата'; }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'refunded': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'completed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      case 'refunded': return 'Возврат';
      case 'completed': return 'Завершено';
      default: return 'Ожидает оплаты';
    }
  };

  if (myBookings.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
          <CalendarIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase font-syne tracking-tighter">ГРАФИК ПУСТ</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">Здесь появятся ваши подтвержденные ШАГи.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-[0.4em]">Exchange History</span>
          </div>
          <h1 className="text-5xl md:text-[7rem] font-black text-white tracking-tighter leading-none uppercase font-syne">
            ВАШИ<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">СОБЫТИЯ</span>
          </h1>
        </div>
        <button onClick={onRefresh} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <RefreshCcw className="w-4 h-4" /> Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myBookings.map((booking, idx) => (
          <div 
            key={booking.id} 
            className={`group bg-[#0d0d0e] border rounded-[40px] overflow-hidden transition-all duration-500 shadow-2xl relative ${booking.status === 'cancelled' ? 'opacity-50 border-white/5 grayscale' : 'border-white/5 hover:border-white/20'}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Date Block */}
                <div className="lg:col-span-2 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-2 p-5 bg-white/[0.03] rounded-3xl border border-white/5 h-full">
                  <div className="text-left lg:text-center">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{formatDate(booking.date).split(' ')[1]?.toUpperCase() || 'МЕС'}</span>
                    <span className="text-3xl font-black font-syne text-white leading-none">{formatDate(booking.date).split(' ')[0]}</span>
                  </div>
                  <div className="hidden lg:block h-px w-8 bg-white/10 my-1" />
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-[11px] bg-indigo-500/10 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{booking.time}</span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${getStatusColor(booking.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' : (booking.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-slate-500')}`} />
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase font-syne leading-tight">{booking.serviceTitle || 'Индивидуальный ШАГ'}</h3>
                    <div className="flex items-center gap-3 text-slate-400">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold">
                        {isEnt ? `Клиент: ${booking.userName}` : `Ментор: ${booking.mentorName || booking.mentorId}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="text-center lg:text-right shrink-0">
                    <p className="text-3xl font-black text-white font-syne">{booking.price || 0} ₽</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    {!isEnt && booking.status === 'pending' && (
                      <button onClick={() => onPay(booking)} className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">Оплатить</button>
                    )}
                    
                    {booking.status === 'confirmed' && onReschedule && (
                      <button 
                        onClick={() => onReschedule(booking)}
                        className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                        title="Перенести встречу"
                      >
                        <ArrowRightLeft className="w-4 h-4" /> Перенести
                      </button>
                    )}

                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button 
                        disabled={isCancelling === booking.id}
                        onClick={() => handleCancel(booking)} 
                        className={`p-4 rounded-2xl border transition-all ${isCancelling === booking.id ? 'opacity-50 cursor-not-allowed' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'}`}
                        title="Отменить"
                      >
                        {isCancelling === booking.id ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
