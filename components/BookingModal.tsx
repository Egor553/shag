
import React, { useState } from 'react';
import { Mentor, MeetingFormat } from '../types';
import { X, Calendar as CalendarIcon, Clock, CreditCard, ExternalLink, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  mentor: Mentor;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentor, onClose, onComplete }) => {
  const [format, setFormat] = useState<MeetingFormat>(MeetingFormat.ONLINE_1_ON_1);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [exchange, setExchange] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const availableSlots = React.useMemo(() => {
    try {
      const slots = mentor.slots || "{}";
      return typeof slots === 'string' ? JSON.parse(slots) : slots;
    } catch (e) { return {}; }
  }, [mentor]);

  const availableDates = Object.keys(availableSlots);
  const getPrice = () => format === MeetingFormat.GROUP_OFFLINE ? mentor.groupPrice : mentor.singlePrice;

  const handleSubmit = () => {
    onComplete({
      mentorId: mentor.id,
      format,
      goal,
      exchange,
      date: selectedDate,
      time: selectedSlot,
      price: getPrice()
    });
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">ШАГ забронирован!</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Для окончательного подтверждения встречи наставником необходимо произвести оплату.</p>
          </div>
          {mentor.paymentUrl ? (
            <a 
              href={mentor.paymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-500 transition-all"
            >
              Перейти к оплате <ExternalLink className="w-5 h-5" />
            </a>
          ) : (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-sm font-medium">
              Наставник скоро свяжется с вами для уточнения деталей оплаты.
            </div>
          )}
          <button onClick={onClose} className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Закрыть окно</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"><X className="w-6 h-6 text-slate-400" /></button>
        <div className="p-10">
          <div className="flex items-center gap-5 mb-10 pb-10 border-b border-slate-50">
            <img src={mentor.avatarUrl} className="w-16 h-16 rounded-[24px] object-cover shadow-lg" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">Бронирование ШАГа</h2>
              <p className="text-indigo-600 font-bold text-sm tracking-wide">наставник: {mentor.name}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-10 bg-slate-50 p-1 rounded-full">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-3">
                {Object.values(MeetingFormat).map((f) => (
                  <button key={f} onClick={() => setFormat(f)} className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left ${format === f ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}>
                    <span className="font-black text-sm uppercase tracking-tight">{f}</span>
                    <span className="font-black text-indigo-600 text-lg">{f === MeetingFormat.GROUP_OFFLINE ? mentor.groupPrice : mentor.singlePrice} ₽</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-500 transition-all">Продолжить</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Твой запрос к наставнику</label>
                <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Главный вопрос, который хочешь разобрать..." className="w-full p-6 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 outline-none resize-none h-32" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Чем ты можешь быть полезен? (Энергообмен)</label>
                <input value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Твой уникальный навык или помощь..." className="w-full p-6 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 outline-none" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 font-black uppercase text-[10px] text-slate-400 tracking-widest">Назад</button>
                <button disabled={!goal || !exchange} onClick={() => setStep(3)} className="flex-[2] bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Выбрать время</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                {availableDates.length > 0 ? availableDates.map(date => (
                  <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(''); }} className={`px-5 py-3 rounded-2xl border-2 font-black text-[11px] uppercase tracking-wider transition-all ${selectedDate === date ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg' : 'border-slate-100 hover:border-indigo-200'}`}>
                    {date.split('-').reverse().join('.')}
                  </button>
                )) : <p className="text-sm text-slate-400 font-medium">К сожалению, слоты пока не указаны.</p>}
              </div>
              {selectedDate && (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots[selectedDate].map((slot: string) => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-4 rounded-2xl border-2 font-black text-xs transition-all ${selectedSlot === slot ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-100 hover:border-indigo-100'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
              <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100"><div className="flex justify-between font-black text-xl text-slate-900"><span>Сумма ШАГа</span><span className="text-indigo-600">{getPrice()} ₽</span></div></div>
              <button disabled={!selectedSlot} onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
                <CreditCard className="w-5 h-5" /> Забронировать встречу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
