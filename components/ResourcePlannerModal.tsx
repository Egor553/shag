
import React, { useState } from 'react';
import { UserSession, Mentor } from '../types';
import { Sparkles, Clock, Calendar as CalendarIcon, Check, Loader2, Target, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
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
    
    const updates = {
      timeLimit,
      slots: typeof slots === 'string' ? slots : JSON.stringify(slots),
      lastWeeklyUpdate: today
    };

    try {
      await onSaveProfile(updates);
      onClose();
    } catch (e) {
      alert("Ошибка сохранения ресурсов. Проверьте соединение с интернетом.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-[#1a1d23] w-full max-w-5xl rounded-[48px] md:rounded-[64px] border border-white/10 p-6 md:p-16 relative shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[95vh] no-scrollbar">
        {/* Architectural Design Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="space-y-12 md:space-y-16 text-center">
          <div className="flex flex-col items-center gap-8">
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 text-white/60">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">МОДУЛЬ_РЕСУРСОВ</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-tight break-words">
                РЕСУРС <span className="text-indigo-500 italic">НЕДЕЛИ</span>
              </h2>
              <div className="flex flex-col md:flex-row gap-4 p-6 bg-white/5 rounded-[32px] border border-white/5 backdrop-blur-md text-left items-center">
                <Sparkles className="w-8 h-8 text-white shrink-0" />
                <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed italic">
                  «Мы просим подтверждать доступность раз в 7 дней, чтобы участники видели только актуальные окна для записи.»
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <label className="flex items-center justify-center gap-3 text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                <Target className="w-4 h-4 text-white" /> ЛИМИТ ЧАСОВ / МЕС
              </label>
              <div className="relative group">
                <input 
                  value={timeLimit}
                  onChange={e => setTimeLimit(e.target.value)}
                  placeholder="00"
                  className="w-full bg-white/[0.03] border border-white/10 p-8 rounded-2xl text-white text-5xl font-black outline-none focus:border-indigo-500 transition-all font-syne text-center placeholder:text-white/5"
                />
              </div>
            </div>
          </div>

          <div className="w-full space-y-8">
            <div className="flex items-center justify-center gap-4">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
              <label className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ДОСТУПНОЕ ВРЕМЯ</label>
            </div>
            <div className="max-w-4xl mx-auto overflow-hidden">
               <SlotCalendar 
                  selectedSlots={typeof slots === 'string' ? JSON.parse(slots || '{}') : slots} 
                  onChange={s => setSlots(JSON.stringify(s))} 
                  accentColor="indigo" 
                />
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-5 text-left max-w-sm">
               <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 shrink-0">
                  <Zap size={24} />
               </div>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                 Данные обновятся в общем реестре мгновенно после подтверждения
               </p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className={`w-full md:w-auto px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-4 group overflow-hidden ${isSaving ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-white/90 shadow-2xl'}`}
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  ПОДТВЕРДИТЬ
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
