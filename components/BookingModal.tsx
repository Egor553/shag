
import React, { useState, useEffect } from 'react';
import { Mentor, MeetingFormat, Service, Booking, UserSession } from '../types';
import { X, Calendar as CalendarIcon, Clock, CreditCard, Users as UsersIcon, User, ArrowRight, ShieldCheck, Zap, Sparkles, RefreshCw, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { PaymentStub } from './payment/PaymentStub';
import { dbService } from '../services/databaseService';

interface BookingModalProps {
  mentor: Mentor;
  service?: Service;
  bookings: Booking[]; 
  session: UserSession;
  existingBooking?: Booking;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentor, service, bookings, session, existingBooking, onClose, onComplete }) => {
  const [format, setFormat] = useState<MeetingFormat>(existingBooking?.format || service?.format || MeetingFormat.ONLINE_1_ON_1);
  const [step, setStep] = useState(existingBooking ? 4 : 1);
  const [goal, setGoal] = useState(existingBooking?.goal || '');
  const [exchange, setExchange] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(existingBooking?.date || null);
  const [selectedSlot, setSelectedSlot] = useState(existingBooking?.time || '');
  const [showPayment, setShowPayment] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isRescheduleMode = existingBooking?.status === 'confirmed';
  const isOwner = session.email === (mentor.ownerEmail || mentor.email);

  const getPrice = () => {
    if (existingBooking) return existingBooking.price || 0;
    if (service) {
      return (format === MeetingFormat.GROUP_OFFLINE || format === MeetingFormat.GROUP_ONLINE) 
        ? (service.groupPrice || service.price) 
        : service.price;
    }
    return (format === MeetingFormat.GROUP_OFFLINE || format === MeetingFormat.GROUP_ONLINE) 
      ? mentor.groupPrice 
      : mentor.singlePrice;
  };

  const handleAction = async () => {
    if (isRescheduleMode) {
      setIsRescheduling(true);
      try {
        const res = await dbService.rescheduleBooking(existingBooking!.id, selectedDate!, selectedSlot);
        if (res.result === 'success') {
          onComplete({ id: existingBooking!.id, date: selectedDate, time: selectedSlot, status: 'confirmed' });
        } else {
          alert('Ошибка при переносе: ' + res.message);
        }
      } catch (e) {
        alert('Ошибка связи с сервером');
      } finally {
        setIsRescheduling(false);
      }
    } else {
      if (step < 4) setStep(step + 1);
      else setShowPayment(true);
    }
  };

  const handlePaySuccess = async () => {
    setIsSaving(true);
    try {
      const bookingData: Partial<Booking> = {
        id: existingBooking?.id || Math.random().toString(36).substr(2, 9),
        mentorId: mentor.id,
        mentorName: mentor.name,
        userEmail: session.email,
        userName: session.name,
        serviceId: existingBooking?.serviceId || service?.id || 'personal',
        serviceTitle: existingBooking?.serviceTitle || service?.title || 'Персональный ШАГ',
        format,
        goal,
        exchange,
        date: selectedDate || '',
        time: selectedSlot,
        price: getPrice(),
        status: 'confirmed'
      };

      const res = await dbService.saveBooking(bookingData);
      if (res.result === 'success') {
        onComplete(bookingData);
      } else {
        alert('Ошибка сохранения записи: ' + res.message);
      }
    } catch (e) {
      alert('Ошибка при сохранении бронирования');
    } finally {
      setIsSaving(false);
    }
  };

  const slotsSource = service?.slots || mentor.slots || '{}';
  const availableSlots = JSON.parse(slotsSource);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full h-full md:h-auto md:max-w-md md:rounded-[48px] shadow-3xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all z-20">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-10">
          
          {/* Header Area according to screenshot */}
          <div className="flex items-center gap-5 mb-8 pt-4">
            <div className="w-14 h-14 bg-[#5c56f2] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
               <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.1] uppercase font-syne tracking-tight">
                {isRescheduleMode ? 'ПЕРЕНОС ВСТРЕЧИ' : (service?.title || 'ОФЛАЙН ВСТРЕЧА С ПРЕДПРИНИМАТЕЛЕМ')}
              </h2>
              <p className="text-[#5c56f2] font-black text-[9px] md:text-[10px] uppercase tracking-widest mt-1">МЕНТОР: {mentor.name}</p>
            </div>
          </div>

          {/* Progress Indicator - Thin segments */}
          {!isRescheduleMode && !isOwner && !showPayment && (
            <div className="flex gap-1.5 mb-12">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#5c56f2]' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}

          {isSaving ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <Loader2 className="w-12 h-12 text-[#5c56f2] animate-spin" />
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 uppercase font-syne">Инициализация</h3>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Обработка данных...</p>
              </div>
            </div>
          ) : !showPayment ? (
            <div className="space-y-8">
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ФОРМАТ УЧАСТИЯ</label>
                    <div className="space-y-3">
                      {/* Individual Format Card refined */}
                      <button 
                        onClick={() => setFormat(MeetingFormat.ONLINE_1_ON_1)} 
                        className={`w-full p-4 md:p-5 rounded-[28px] border-2 transition-all flex items-center justify-between group ${format === MeetingFormat.ONLINE_1_ON_1 ? 'border-[#5c56f2] bg-white shadow-xl' : 'border-slate-50 bg-slate-50/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${format === MeetingFormat.ONLINE_1_ON_1 ? 'bg-[#5c56f2]/10 text-[#5c56f2]' : 'bg-white text-slate-300'}`}>
                            <User className="w-5 h-5" />
                          </div>
                          <p className={`font-black text-[11px] uppercase tracking-tight transition-colors ${format === MeetingFormat.ONLINE_1_ON_1 ? 'text-[#5c56f2]' : 'text-slate-400'}`}>Индивидуально</p>
                        </div>
                        <div className="text-right flex items-baseline gap-1">
                           <p className={`text-xl md:text-2xl font-black font-syne leading-none ${format === MeetingFormat.ONLINE_1_ON_1 ? 'text-[#5c56f2]' : 'text-slate-300'}`}>{service?.price || mentor.singlePrice}</p>
                           <p className={`text-[10px] font-bold uppercase ${format === MeetingFormat.ONLINE_1_ON_1 ? 'text-[#5c56f2]/60' : 'text-slate-200'}`}>₽</p>
                        </div>
                      </button>

                      {((service?.groupPrice || mentor.groupPrice || 0) > 0) && (
                        <button 
                          onClick={() => setFormat(MeetingFormat.GROUP_OFFLINE)} 
                          className={`w-full p-4 md:p-5 rounded-[28px] border-2 transition-all flex items-center justify-between group ${format === MeetingFormat.GROUP_OFFLINE ? 'border-emerald-500 bg-white shadow-xl' : 'border-slate-50 bg-slate-50/50'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${format === MeetingFormat.GROUP_OFFLINE ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white text-slate-300'}`}>
                              <UsersIcon className="w-5 h-5" />
                            </div>
                            <p className={`font-black text-[11px] uppercase tracking-tight transition-colors ${format === MeetingFormat.GROUP_OFFLINE ? 'text-emerald-600' : 'text-slate-400'}`}>Групповая встреча</p>
                          </div>
                          <div className="text-right flex items-baseline gap-1">
                             <p className={`text-xl md:text-2xl font-black font-syne leading-none ${format === MeetingFormat.GROUP_OFFLINE ? 'text-emerald-500' : 'text-slate-300'}`}>{service?.groupPrice || mentor.groupPrice}</p>
                             <p className={`text-[10px] font-bold uppercase ${format === MeetingFormat.GROUP_OFFLINE ? 'text-emerald-500/60' : 'text-slate-200'}`}>₽</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ВАШ ЗАПРОС</label>
                  <textarea 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value)} 
                    placeholder="В чем именно тебе нужна помощь наставника?" 
                    className="w-full p-6 rounded-[28px] border-2 border-slate-50 focus:border-[#5c56f2] bg-slate-50/30 outline-none h-40 text-sm font-bold transition-all text-slate-900 resize-none" 
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ВАШ ВКЛАД</label>
                  <textarea 
                    value={exchange} 
                    onChange={(e) => setExchange(e.target.value)} 
                    placeholder="Чем ты можешь быть полезен ментору?" 
                    className="w-full p-6 rounded-[28px] border-2 border-slate-50 focus:border-[#5c56f2] bg-slate-50/30 outline-none h-40 text-sm font-bold transition-all text-slate-900 resize-none" 
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ДОСТУПНЫЕ ДАТЫ</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(availableSlots).length > 0 ? Object.keys(availableSlots).map(date => (
                          <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(''); }} className={`px-5 py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${selectedDate === date ? 'border-[#5c56f2] bg-[#5c56f2] text-white' : 'border-slate-50 text-slate-600'}`}>
                            {date.split('-').reverse().slice(0, 2).join('.')}
                          </button>
                        )) : (
                          <p className="p-2 text-slate-400 text-[10px] font-bold uppercase italic">Нет свободных окон</p>
                        )}
                    </div>
                  </div>
                  {selectedDate && availableSlots[selectedDate] && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="grid grid-cols-3 gap-2">
                          {availableSlots[selectedDate].map((slot: string) => (
                            <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-4 rounded-xl border-2 font-black text-[11px] transition-all ${selectedSlot === slot ? 'border-[#5c56f2] bg-[#5c56f2]/5 text-[#5c56f2]' : 'border-slate-50 text-slate-600'}`}>{slot}</button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-6">
                <button 
                  disabled={(step === 2 && !goal) || (step === 3 && !exchange) || (step === 4 && !selectedSlot) || isRescheduling} 
                  onClick={handleAction} 
                  className="w-full bg-[#5c56f2] text-white py-6 rounded-[28px] font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                >
                  {isRescheduling ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                    step === 4 ? (isRescheduleMode ? 'ПОДТВЕРДИТЬ ПЕРЕНОС' : 'ОПЛАТИТЬ ШАГ') : 'ПРОДОЛЖИТЬ'
                  )}
                </button>
                {step > 1 && !isRescheduleMode && (
                  <button onClick={() => setStep(step - 1)} className="w-full text-slate-300 font-black uppercase text-[9px] tracking-widest mt-6 py-2">Назад</button>
                )}
              </div>
            </div>
          ) : (
            <PaymentStub 
              amount={getPrice()} 
              title={existingBooking?.serviceTitle || service?.title || 'Персональный ШАГ'} 
              onSuccess={handlePaySuccess} 
              onCancel={() => existingBooking ? onClose() : setShowPayment(false)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
