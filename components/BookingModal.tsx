
import React, { useState } from 'react';
import { Mentor, MeetingFormat, Service, Booking } from '../types';
import { X, Calendar as CalendarIcon, Clock, CreditCard, ExternalLink, CheckCircle, Info, Users as UsersIcon, Monitor, MapPin } from 'lucide-react';

interface BookingModalProps {
  mentor: Mentor;
  service?: Service;
  bookings: Booking[]; // Добавлено для проверки занятости
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentor, service, bookings, onClose, onComplete }) => {
  // Если есть услуга, фиксируем формат из неё
  const [format, setFormat] = useState<MeetingFormat>(service?.format || MeetingFormat.ONLINE_1_ON_1);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [exchange, setExchange] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const getPrice = () => {
    if (service) {
      return format === MeetingFormat.GROUP_OFFLINE ? (service.groupPrice || service.price) : service.price;
    }
    return format === MeetingFormat.GROUP_OFFLINE ? mentor.groupPrice : mentor.singlePrice;
  };

  // Проверка доступности конкретного времени
  const isSlotAvailable = (date: string, time: string) => {
    const slotBookings = bookings.filter(b => 
      b.serviceId === service?.id && 
      b.date === date && 
      b.time === time && 
      b.status !== 'completed' // Учитываем только активные брони
    );

    const limit = format === MeetingFormat.GROUP_OFFLINE ? 10 : 1;
    return slotBookings.length < limit;
  };

  const availableSlotsData = React.useMemo(() => {
    try {
      const slots = service?.slots || mentor.slots || "{}";
      const parsed = typeof slots === 'string' ? JSON.parse(slots) : slots;
      
      // Фильтруем слоты, где еще есть места
      const filtered: Record<string, string[]> = {};
      Object.keys(parsed).forEach(date => {
        const freeTimes = parsed[date].filter((time: string) => isSlotAvailable(date, time));
        if (freeTimes.length > 0) {
          filtered[date] = freeTimes;
        }
      });
      return filtered;
    } catch (e) { return {}; }
  }, [mentor, service, bookings, format]);

  const availableDates = Object.keys(availableSlotsData);

  const handleSubmit = () => {
    onComplete({
      mentorId: mentor.id,
      serviceId: service?.id,
      format,
      goal,
      exchange,
      date: selectedDate,
      time: selectedSlot,
      price: getPrice()
    });
    setIsBooked(true);
  };

  const getFormatIcon = (f: MeetingFormat) => {
    switch (f) {
      case MeetingFormat.ONLINE_1_ON_1: return <Monitor className="w-5 h-5" />;
      case MeetingFormat.OFFLINE_1_ON_1: return <MapPin className="w-5 h-5" />;
      case MeetingFormat.GROUP_OFFLINE: return <UsersIcon className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  if (isBooked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 font-syne uppercase tracking-tighter">ШАГ забронирован!</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Для подтверждения встречи ментором необходимо произвести оплату.</p>
          </div>
          {mentor.paymentUrl ? (
            <a href={mentor.paymentUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-500 transition-all">
              Перейти к оплате <ExternalLink className="w-5 h-5" />
            </a>
          ) : (
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-amber-700 text-sm font-medium">
              Ментор скоро свяжется с вами для уточнения деталей оплаты.
            </div>
          )}
          <button onClick={onClose} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Закрыть окно</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
      <div className="bg-white w-full max-w-xl rounded-[56px] shadow-3xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full transition-all z-10">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="p-10 md:p-14">
          <div className="flex items-center gap-6 mb-12">
            <div className="relative">
              <img src={service?.imageUrl || mentor.avatarUrl} className="w-20 h-20 rounded-[32px] object-cover shadow-2xl border-2 border-slate-50" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white">
                {getFormatIcon(format)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 leading-none uppercase font-syne tracking-tight mb-1">{service?.title || 'Бронирование ШАГа'}</h2>
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">ментор: {mentor.name}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-12 bg-slate-50 p-1 rounded-full">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex gap-4">
                 <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                 <p className="text-[11px] text-indigo-900/80 leading-relaxed font-semibold">{service?.description || 'Индивидуальная встреча с опытным предпринимателем.'}</p>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Выбранный формат</label>
                 <div className="p-8 rounded-[32px] border-4 border-indigo-600 bg-indigo-50 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                          {getFormatIcon(format)}
                       </div>
                       <div>
                          <p className="text-indigo-900 font-black text-sm uppercase leading-none mb-1">{format}</p>
                          <p className="text-indigo-600/60 text-[10px] font-bold uppercase tracking-widest">
                            {format === MeetingFormat.GROUP_OFFLINE ? 'Групповое участие (до 10 чел)' : 'Личная сессия (1 на 1)'}
                          </p>
                       </div>
                    </div>
                    <span className="text-2xl font-black text-indigo-600 font-syne">{getPrice()} ₽</span>
                 </div>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-500 transition-all active:scale-95">Продолжить</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Твой запрос к ментору</label>
                <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Главный вопрос, который хочешь разобрать..." className="w-full p-8 rounded-[32px] border-2 border-slate-100 focus:border-indigo-500 bg-slate-50/50 outline-none resize-none h-40 text-sm font-bold placeholder:text-slate-300 transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Твой вклад (Энергообмен)</label>
                <input value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Твой уникальный навык или помощь..." className="w-full p-8 rounded-[32px] border-2 border-slate-100 focus:border-indigo-500 bg-slate-50/50 outline-none text-sm font-bold placeholder:text-slate-300 transition-all" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 font-black uppercase text-[10px] text-slate-400 tracking-widest">Назад</button>
                <button disabled={!goal || !exchange} onClick={() => setStep(3)} className="flex-[2] bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 transition-all">Выбрать время</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Доступные даты</label>
                <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2">
                  {availableDates.length > 0 ? availableDates.map(date => (
                    <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(''); }} className={`px-6 py-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${selectedDate === date ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl scale-105' : 'border-slate-100 hover:border-indigo-200 text-slate-400'}`}>
                      {date.split('-').reverse().slice(0, 2).join('.')}
                    </button>
                  )) : (
                    <div className="w-full py-12 px-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-center space-y-3">
                       <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Все места на этот ШАГ заняты</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedDate && availableSlotsData[selectedDate] && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Доступные слоты</label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlotsData[selectedDate].map((slot: string) => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-5 rounded-2xl border-2 font-black text-xs transition-all ${selectedSlot === slot ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md scale-105' : 'border-slate-100 hover:border-indigo-100 text-slate-500'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl border border-white/5 flex justify-between items-center mt-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">К оплате</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-white font-syne tracking-tighter">{getPrice()}</span>
                    <span className="text-indigo-400 font-bold">₽</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${selectedSlot ? 'animate-bounce text-indigo-400' : 'text-slate-600'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setStep(2)} className="flex-1 font-black uppercase text-[10px] text-slate-400 tracking-widest">Назад</button>
                 <button disabled={!selectedSlot} onClick={handleSubmit} className="flex-[3] bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all">
                  Бронировать ШАГ <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArrowRightIcon = (props: any) => <ExternalLink {...props} />;
