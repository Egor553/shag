
import React, { useState } from 'react';
import { UserSession, Mentor } from '../types';
import { Sparkles, Clock, Calendar as CalendarIcon, Check, Loader2 } from 'lucide-react';
import { SlotCalendar } from './SlotCalendar';

interface ResourcePlannerModalProps {
  session: UserSession;
  mentorProfile: Mentor | null;
  onSaveProfile: (updates: Partial<UserSession>) => void;
  onClose: () => void;
}

export const ResourcePlannerModal: React.FC<ResourcePlannerModalProps> = ({
  session,
  mentorProfile,
  onSaveProfile,
  onClose
}) => {
  const [timeLimit, setTimeLimit] = useState(session.timeLimit || '');
  const [slots, setSlots] = useState(mentorProfile?.slots || '{}');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    const today = new Date().toISOString();
    
    // Подготавливаем объект обновлений
    const updates = {
      timeLimit,
      slots: typeof slots === 'string' ? slots : JSON.stringify(slots),
      lastWeeklyUpdate: today
    };

    try {
      // Вызываем переданную функцию сохранения, которая обновит и БД, и локальный стейт
      await onSaveProfile(updates);
      onClose();
    } catch (e) {
      alert("Ошибка сохранения ресурсов. Проверьте соединение с интернетом.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-[#0a0a0b] w-full max-w-4xl rounded-[48px] border border-white/10 p-8 md:p-16 relative shadow-3xl overflow-y-auto max-h-[95vh] no-scrollbar">
        <div className="space-y-12">
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Weekly Resource Plan</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-syne tracking-tighter leading-[0.9]">
              ВАШ РЕСУРС<br/><span className="text-indigo-600">НА НЕДЕЛЮ</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg font-medium max-w-xl">
              Уточните ваше свободное время, чтобы таланты могли планировать ШАГи. Это займет меньше минуты.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Часов в месяц (всего)
                </label>
                <div className="relative">
                  <input 
                    value={timeLimit}
                    onChange={e => setTimeLimit(e.target.value)}
                    placeholder="Например: 12"
                    className="w-full bg-white/5 border border-white/10 p-8 rounded-[32px] text-white text-3xl font-black outline-none focus:border-indigo-500 transition-all font-syne"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-xl">ЧАСОВ</span>
                </div>
              </div>

              <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Почему это важно?</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                  «Мы спрашиваем об этом раз в неделю, чтобы ваше расписание оставалось актуальным и вы не получали запросы в те дни, когда заняты основным бизнесом.»
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                <CalendarIcon className="w-4 h-4 text-indigo-500" /> Выберите актуальные даты
              </label>
              <SlotCalendar 
                selectedSlots={typeof slots === 'string' ? JSON.parse(slots || '{}') : slots} 
                onChange={s => setSlots(JSON.stringify(s))} 
                accentColor="indigo" 
              />
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full py-8 bg-white text-black rounded-[32px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Подтвердить план на неделю"} 
              {!isSaving && <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
