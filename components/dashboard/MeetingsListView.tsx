
import React, { useState } from 'react';
import { Booking, UserSession, UserRole } from '../../types';
import {
  Calendar as CalendarIcon, Clock, User,
  Zap, ArrowRightLeft, Target, Heart, RefreshCcw, XCircle, CreditCard, Trash2,
  Mail, Building, MapPin, TrendingUp, Key, Briefcase, Sparkles, ShieldCheck, Phone
} from 'lucide-react';
import { dbService } from '../../services/databaseService';
import { ReviewModal } from './ReviewModal';

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
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<Booking | null>(null);
  const isEnt = session.role === UserRole.ENTREPRENEUR;
  const isAdmin = session.role === UserRole.ADMIN;

  const myBookings = [...bookings].filter(b =>
    isAdmin ? true :
      isEnt ? (String(b.mentorId) === String(session.id) || String(b.mentorId).toLowerCase() === String(session.email).toLowerCase())
        : (String(b.userEmail).toLowerCase() === String(session.email).toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancel = async (booking: Booking) => {
    if (isEnt && !isAdmin) return;

    const personName = booking.mentorName || 'ментора';
    if (!confirm(`Вы уверены, что хотите отменить запись к ${personName}?`)) return;

    setIsProcessing(booking.id);
    try {
      const res = await dbService.cancelBooking(booking.id, isAdmin ? 'Отменено администратором' : 'Отменено ментором');
      if (res.result === 'success') {
        if (isAdmin) {
          await dbService.sendMessage({
            id: Math.random().toString(36).substr(2, 9),
            bookingId: booking.id,
            senderEmail: 'system',
            senderName: 'ШАГ Система',
            text: '❌ Ваша запись была отменена администратором платформы.',
            timestamp: new Date().toISOString()
          });
        }
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      alert('Ошибка связи с сервером');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (booking: Booking) => {
    if (!confirm('Вы уверены, что хотите безвозвратно удалить эту запись из истории?')) return;
    setIsProcessing(booking.id);
    try {
      const res = await dbService.deleteBooking(booking.id);
      if (res.result === 'success' && onRefresh) onRefresh();
    } catch (e) {
      alert('Ошибка при удалении');
    } finally {
      setIsProcessing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        day: d.getDate(),
        month: d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '').toUpperCase(),
        fullDate: d
      };
    } catch { return { day: '?', month: '???', fullDate: new Date() }; }
  };

  if (myBookings.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px]">
        <CalendarIcon className="w-16 h-16 text-slate-800" />
        <h3 className="text-2xl font-black text-white uppercase font-syne tracking-tighter">ГРАФИК ПУСТ</h3>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-indigo-500 font-bold text-[9px] uppercase tracking-[0.4em]">Exchange Calendar</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase font-syne">
            {isEnt ? 'ВАШИ' : 'ТВОИ'}<br />СОБЫТИЯ
          </h1>
        </div>
        <button onClick={onRefresh} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/5">
          <RefreshCcw className="w-4 h-4" /> Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myBookings.map((booking) => {
          const { day, month, fullDate } = formatDate(booking.date);
          const isPast = fullDate < now;
          const isCancelled = booking.status === 'cancelled';
          const isConfirmed = booking.status === 'confirmed';

          return (
            <div
              key={booking.id}
              className={`relative bg-[#0d0d0e] border rounded-[40px] overflow-hidden transition-all duration-500 shadow-2xl ${isCancelled ? 'opacity-40 grayscale border-red-500/20' : 'border-white/5 hover:border-white/10'}`}
            >
              <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-start">

                <div className="flex flex-row lg:flex-col items-center justify-center gap-4 p-6 bg-white/[0.03] rounded-[28px] border border-white/5 w-full lg:w-32 shrink-0">
                  <div className="text-center">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">{month}</span>
                    <span className="text-3xl font-black font-syne text-white">{day}</span>
                  </div>
                  <div className="hidden lg:block w-full h-px bg-white/10" />
                  <div className="text-indigo-400 font-black text-[10px] flex items-center gap-1.5">
                    <Clock size={12} /> {booking.time}
                  </div>
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {isConfirmed ? 'Подтверждено' : (isCancelled ? 'Отменено' : 'Ожидает оплаты')}
                    </span>
                    <span className="px-4 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase text-slate-500 tracking-widest">
                      {booking.format}
                    </span>
                    {isPast && (
                      <span className="px-4 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest">
                        В прошлом
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{isEnt ? 'Ментор' : 'Участник'}</p>
                        <h3 className="text-2xl font-black text-white uppercase font-syne">{isEnt ? booking.userName : (booking.mentorName || 'Ментор')}</h3>
                      </div>
                    </div>

                    {(isEnt || isAdmin) && booking.goal && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-indigo-500/5 rounded-3xl border border-white/5 space-y-3">
                          <div className="flex items-center gap-2 text-indigo-400">
                            <Target size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Запрос ментора</span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed italic">«{booking.goal}»</p>
                        </div>
                        <div className="p-6 bg-emerald-500/5 rounded-3xl border border-white/5 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Heart size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Энергообмен</span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed italic">«{booking.exchange || 'Готов быть полезным'}»</p>
                        </div>
                      </div>
                    )}

                    {!isEnt && (
                      <h4 className="text-lg font-bold text-slate-400 uppercase font-syne tracking-tight">«{booking.serviceTitle}»</h4>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full lg:w-48 shrink-0 justify-center">
                  {(isConfirmed || isAdmin) && !isPast && !isCancelled && (
                    <button
                      onClick={() => onReschedule && onReschedule(booking)}
                      className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10 active:scale-95"
                    >
                      <ArrowRightLeft size={16} /> {isAdmin ? 'Перенести' : 'Перенести встречу'}
                    </button>
                  )}

                  {isConfirmed && !isPast && !isEnt && !isCancelled && (
                    <p className="text-[8px] font-bold text-amber-500/60 uppercase text-center px-4 tracking-widest">
                      Активные подтвержденные записи нельзя отменять самостоятельно
                    </p>
                  )}

                  {!isConfirmed && !isPast && !isCancelled && !isEnt && (
                    <button
                      disabled={!!isProcessing}
                      onClick={() => handleCancel(booking)}
                      className="w-full py-5 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all border border-red-500/10"
                    >
                      {isProcessing === booking.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <XCircle size={16} />} Отменить
                    </button>
                  )}

                  {isAdmin && !isCancelled && (
                    <button
                      disabled={!!isProcessing}
                      onClick={() => handleCancel(booking)}
                      className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isProcessing === booking.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <XCircle size={16} />} ROOT ОТМЕНА
                    </button>
                  )}

                  {(isPast || isCancelled) && (
                    <button
                      disabled={!!isProcessing}
                      onClick={() => handleDelete(booking)}
                      className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      {isProcessing === booking.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />} Удалить из истории
                    </button>
                  )}

                  {!isEnt && booking.status === 'pending' && !isPast && !isCancelled && (
                    <button onClick={() => onPay(booking)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                      <CreditCard size={16} /> Оплатить ШАГ
                    </button>
                  )}

                  {!isEnt && isPast && isConfirmed && booking.status !== 'completed' && (
                    <button
                      onClick={() => setSelectedReviewBooking(booking)}
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 animate-pulse"
                    >
                      <Sparkles size={16} /> Оставить отзыв
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {selectedReviewBooking && (
        <ReviewModal
          booking={selectedReviewBooking}
          session={session}
          onClose={() => setSelectedReviewBooking(null)}
          onSuccess={() => onRefresh && onRefresh()}
        />
      )}
    </div>
  );
};
