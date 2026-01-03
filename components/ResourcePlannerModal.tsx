
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
      <div className="bg-[#1a1d23] w-full max-w-6xl rounded-[64px] border border-white/10 p-10 md:p-20 relative shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[95vh] no-scrollbar">
        {/* Architectural Design Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

        <div className="space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="space-y-10 max-w-2xl">
              <div className="flex items-center gap-5 text-white/60">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em]">RESOURCES_MOD_V3</span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase font-syne tracking-tighter leading-[0.85]">
                РЕСУРС_<br/><span className="text-white/20 italic">НЕДЕЛИ</span>
              </h2>
              <div className="flex gap-6 p-8 bg-white/5 rounded-[40px] border border-white/5 backdrop-blur-md">
                <Sparkles className="w-10 h-10 text-white shrink-0" />
                <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed italic">
                  «Мы просим подтверждать доступность раз в 7 дней, чтобы участники платформы видели только актуальные окна для записи.»
                </p>
              </div>
            </div>

            <div className="w-full md:w-96 space-y-8 pt-6">
              <label className="flex items-center gap-4 text-[11px] font-black text-white/40 uppercase tracking-[0.4em] px-2">
                <Target className="w-5 h-5 text-white" /> QUOTA_SETTING
              </label>
              <div className="relative group">
                <input 
                  value={timeLimit}
                  onChange={e => setTimeLimit(e.target.value)}
                  placeholder="00"
                  className="w-full bg-white/[0.03] border border-white/10 p-14 rounded-tl-[50px] rounded-br-[50px] text-white text-8xl font-black outline-none focus:border-white transition-all font-syne text-center placeholder:text-white/5 shadow-inner"
                />
                <div className="absolute bottom-8 inset-x-0 text-center text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">ЧАСОВ / МЕС</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-14">
            <div className="space-y-10">
              <div className="flex items-center gap-5 px-4">
                <CalendarIcon className="w-6 h-6 text-white" />
                <label className="text-[11px] font-black text-white uppercase tracking-[0.6em]">MATRIX_GRID_CALIBRATION</label>
              </div>
              <SlotCalendar 
                selectedSlots={typeof slots === 'string' ? JSON.parse(slots || '{}') : slots} 
                onChange={s => setSlots(JSON.stringify(s))} 
                accentColor="indigo" 
              />
            </div>
          </div>

          <div className="pt-16 flex flex-col md:flex-row gap-10 items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Zap size={36} />
               </div>
               <p className="text-[12px] font-black text-white/50 uppercase tracking-[0.4em] max-w-[280px] leading-relaxed">
                 При сохранении ваши данные мгновенно обновятся в общем реестре менторов
               </p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className={`w-full md:w-auto px-20 py-8 rounded-tr-[40px] rounded-bl-[40px] font-black uppercase text-sm tracking-[0.5em] transition-all flex items-center justify-center gap-8 group overflow-hidden ${isSaving ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-white/90 shadow-[0_15px_45px_rgba(255,255,255,0.15)]'}`}
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <>
                  DEPLOY_CHANGES
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-4 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
