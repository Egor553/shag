
import React, { useState, useEffect } from 'react';
import { Mentor, MeetingFormat, Service, Booking, UserSession } from '../types';
import { X, Calendar as CalendarIcon, Clock, CreditCard, Users as UsersIcon, User, ArrowRight, ShieldCheck, Zap, Sparkles, RefreshCw, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { PaymentStub } from './payment/PaymentStub';
import { dbService } from '../services/databaseService';

interface BookingModalProps {
  mentor: Mentor;
  service?: Service;
  bookings: Booking[]; 
  session: UserSession; // Добавлена сессия
  existingBooking?: Booking; // Для оплаты или ПЕРЕНОСА
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
  const [imgError, setImgError] = useState(false);

  // Режим перезаписи: если запись уже подтверждена, мы просто меняем время
  const isRescheduleMode = existingBooking?.status === 'confirmed';
  
  // Режим предпросмотра: если ментор открыл свою собственную услугу
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
      setShowPayment(true);
    }
  };

  const handlePaySuccess = async () => {
    setIsSaving(true);
    try {
      // FIX: Explicitly typing bookingData as Partial<Booking> to ensure the 'status' property
      // matches the literal types defined in the Booking interface rather than being inferred as string.
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

  const photoUrl = mentor.paymentUrl || mentor.avatarUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
      <div className="bg-white w-full max-w-xl rounded-[56px] shadow-3xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full transition-all z-10">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="p-10 md:p-14">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-50 flex items-center justify-center">
               {!imgError && photoUrl ? (
                 <img src={photoUrl} className="w-full h-full object-cover" alt={mentor.name} onError={() => setImgError(true)} />
               ) : (
                 <User className="w-10 h-10 text-white" />
               )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 leading-none uppercase font-syne tracking-tight mb-1">
                {isOwner ? 'ВАШ ШАГ' : (isRescheduleMode ? 'ПЕРЕНОС ШАГА' : (existingBooking?.serviceTitle || service?.title || 'Персональный ШАГ'))}
              </h2>
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">ментор: {mentor.name}</p>
            </div>
          </div>
          
          {isOwner ? (
            <div className="space-y-8 animate-in fade-in">
              <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-black text-[10px] uppercase tracking-widest">Режим предпросмотра</span>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Так вашу услугу видят таланты и другие менторы. Вы можете редактировать описание и расписание в разделе «Мои ШАГи».
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 uppercase font-syne">Описание</h3>
                <p className="text-slate-500 text-sm leading-relaxed italic">«{service?.description || mentor.description}»</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-5 bg-slate-50 rounded-2xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Соло ШАГ</span>
                    <p className="text-xl font-black text-slate-900">{service?.price || mentor.singlePrice} ₽</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Длительность</span>
                    <p className="text-xl font-black text-slate-900">{service?.duration || '60 мин'}</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest">Понятно</button>
            </div>
          ) : isSaving ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase font-syne">Сохраняем ваш ШАГ</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Ваша встреча появится в календаре через мгновение</p>
              </div>
            </div>
          ) : !showPayment ? (
            <div className="space-y-10">
              {!isRescheduleMode && (
                <div className="flex gap-2 mb-12 bg-slate-50 p-1 rounded-full">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Формат участия</label>
                    <div className="grid grid-cols-1 gap-4">
                      <button onClick={() => setFormat(MeetingFormat.ONLINE_1_ON_1)} className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${format === MeetingFormat.ONLINE_1_ON_1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${format === MeetingFormat.ONLINE_1_ON_1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><User className="w-5 h-5" /></div>
                          <div><p className={`font-black text-xs uppercase ${format === MeetingFormat.ONLINE_1_ON_1 ? 'text-indigo-900' : 'text-slate-500'}`}>Индивидуально</p></div>
                        </div>
                        <span className="text-lg font-black font-syne text-indigo-600">{service?.price || mentor.singlePrice} ₽</span>
                      </button>
                      {((service?.groupPrice || mentor.groupPrice || 0) > 0) && (
                        <button onClick={() => setFormat(MeetingFormat.GROUP_OFFLINE)} className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${format === MeetingFormat.GROUP_OFFLINE ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                          <div className="flex items-center gap-4 text-left">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${format === MeetingFormat.GROUP_OFFLINE ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}><UsersIcon className="w-5 h-5" /></div>
                            <div><p className={`font-black text-xs uppercase ${format === MeetingFormat.GROUP_OFFLINE ? 'text-emerald-900' : 'text-slate-500'}`}>Группа</p></div>
                          </div>
                          <span className="text-lg font-black font-syne text-emerald-500">{service?.groupPrice || mentor.groupPrice} ₽</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-xl">Продолжить</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Твой запрос</label>
                  <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="В чем именно тебе нужна помощь наставника?" className="w-full p-8 rounded-[32px] border-2 border-slate-100 focus:border-indigo-500 bg-slate-50/50 outline-none h-40 text-sm font-bold transition-all text-slate-900" />
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 font-black uppercase text-[10px] text-slate-400 tracking-widest">Назад</button>
                    <button disabled={!goal} onClick={() => setStep(3)} className="flex-[2] bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest">Далее</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Твой вклад (Энергообмен)</label>
                  <textarea value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Чем ты можешь быть полезен ментору?" className="w-full p-8 rounded-[32px] border-2 border-slate-100 focus:border-indigo-500 bg-slate-50/50 outline-none h-40 text-sm font-bold transition-all text-slate-900" />
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 font-black uppercase text-[10px] text-slate-400 tracking-widest">Назад</button>
                    <button disabled={!exchange} onClick={() => setStep(4)} className="flex-[2] bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest">Выбрать дату</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Доступные даты</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(availableSlots).length > 0 ? Object.keys(availableSlots).map(date => (
                          <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(''); }} className={`px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${selectedDate === date ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 text-slate-600 hover:border-indigo-200'}`}>
                            {date.split('-').reverse().slice(0, 2).join('.')}
                          </button>
                        )) : (
                          <p className="p-4 text-slate-400 text-xs font-bold uppercase italic">Нет свободных дат в календаре</p>
                        )}
                    </div>
                  </div>
                  {selectedDate && availableSlots[selectedDate] && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="grid grid-cols-3 gap-3">
                          {availableSlots[selectedDate].map((slot: string) => (
                            <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-5 rounded-2xl border-2 font-black text-xs transition-all ${selectedSlot === slot ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-600 hover:border-indigo-50'}`}>{slot}</button>
                          ))}
                      </div>
                    </div>
                  )}
                  <button 
                    disabled={!selectedSlot || isRescheduling} 
                    onClick={handleAction} 
                    className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                  >
                    {isRescheduling ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                      isRescheduleMode ? 'ПОДТВЕРДИТЬ ПЕРЕНОС' : 'К ОПЛАТЕ ШАГА'
                    )}
                    {!isRescheduling && <ArrowRight className="w-5 h-5" />}
                  </button>
                  {!isRescheduleMode && (
                    <button onClick={() => setStep(3)} className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest">Назад</button>
                  )}
                </div>
              )}
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
