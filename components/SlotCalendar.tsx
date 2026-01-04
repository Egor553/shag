
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Zap } from 'lucide-react';

interface SlotCalendarProps {
  selectedSlots: any;
  onChange: (slots: any) => void;
  accentColor?: string;
}

export const SlotCalendar: React.FC<SlotCalendarProps> = ({ selectedSlots, onChange, accentColor = 'indigo' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const timeOptions = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const toggleSlot = (date: string, time: string) => {
    const newSlots = { ...selectedSlots };
    if (!newSlots[date]) newSlots[date] = [];
    if (newSlots[date].includes(time)) {
      newSlots[date] = newSlots[date].filter((t: string) => t !== time);
      if (newSlots[date].length === 0) delete newSlots[date];
    } else {
      newSlots[date].push(time);
    }
    onChange(newSlots);
  };

  const isSelected = (date: string) => !!selectedSlots[date];

  return (
    <div className="bg-white/[0.03] p-6 md:p-10 rounded-tr-[50px] rounded-bl-[50px] border border-white/10 relative overflow-hidden backdrop-blur-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12"><CalendarIcon size={160} /></div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 relative z-10 gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em]">КАЛЕНДАРЬ_СИСТЕМЫ</p>
          <h4 className="text-white font-black text-2xl uppercase tracking-widest font-syne">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
        </div>
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-3 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-3 mb-10 relative z-10">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d} className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest py-3">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`off-${i}`} className="p-2" />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
          const active = isSelected(dateStr);
          const current = selectedDate === dateStr;
          
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square rounded-2xl text-[14px] font-black transition-all relative flex items-center justify-center border
                ${active ? `bg-white border-white text-black shadow-[0_0_25px_rgba(255,255,255,0.2)]` : 'text-white/60 border-white/5 bg-white/5 hover:border-white/20 hover:text-white'}
                ${current ? `ring-2 ring-white ring-offset-4 ring-offset-[#1a1d23]` : ''}
              `}
            >
              {day}
              {active && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />}
            </button>
          );
        })}
      </div>

      {selectedDate ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 relative z-10 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
               <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
                 ДОСТУПНЫЕ_СЛОТЫ
               </p>
            </div>
            <span className="text-[11px] font-black text-black bg-white px-5 py-2 rounded-full border border-white tracking-widest">{selectedDate.split('-').reverse().join('.')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeOptions.map(time => {
              const active = selectedSlots[selectedDate]?.includes(time);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleSlot(selectedDate, time)}
                  className={`px-5 py-5 rounded-2xl text-[12px] font-black transition-all border flex items-center justify-center gap-3
                    ${active ? `bg-white text-black border-white shadow-xl` : 'border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white'}
                  `}
                >
                  <Clock size={14} className={active ? 'opacity-100' : 'opacity-20'} />
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-14 text-center border-t border-white/10 mt-6 flex flex-col items-center gap-5 group">
           <Zap className="w-10 h-10 text-white opacity-20 group-hover:opacity-60 transition-opacity" />
           <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Выберите дату для настройки ресурсов</p>
        </div>
      )}
    </div>
  );
};
