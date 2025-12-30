
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-white font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
        <div className="flex gap-2">
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`off-${i}`} />)}
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
              className={`aspect-square rounded-xl text-xs font-bold transition-all relative flex items-center justify-center
                ${active ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/30` : 'text-slate-400 hover:bg-white/5'}
                ${current ? `ring-2 ring-${accentColor}-400 ring-offset-2 ring-offset-[#121214]` : ''}
              `}
            >
              {day}
              {active && !current && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Время для {selectedDate.split('-').reverse().join('.')}:</p>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map(time => {
              const active = selectedSlots[selectedDate]?.includes(time);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleSlot(selectedDate, time)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border
                    ${active ? `bg-${accentColor}-600 border-transparent text-white shadow-md` : 'border-white/10 text-slate-400 hover:border-white/20'}
                  `}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
