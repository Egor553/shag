
import React from 'react';
import { ShagLogo } from '../App';
import { ArrowRight, Quote, Sparkles, Zap, Heart, Users } from 'lucide-react';

interface ValuePropositionProps {
  onStart: () => void;
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-600/20 blur-[150px] rounded-full animate-pulse" />

      <div className="max-w-4xl w-full relative z-10 space-y-16 py-20">
        <div className="flex justify-center animate-in fade-in zoom-in duration-1000">
          <ShagLogo className="w-24 h-24" />
        </div>

        <div className="space-y-12">
          {/* Section 1: History */}
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
              Более года мы общались с вашим поколением...
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">
              Мы слушали, записывали и выявляли то, что действительно болит. 
              Финансовая стабильность, поиск своего окружения, запрос на наставника, 
              выход на новый уровень и первые настоящие клиенты.
            </p>
          </div>

          {/* Section 2: Honesty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-xl space-y-6">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
                <Zap className="w-7 h-7" />
              </div>
              <p className="text-xl font-bold leading-snug">
                Мы скажем честно: у нас нет «секретного ингредиента» или магического алгоритма успеха.
              </p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-xl space-y-6">
              <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400">
                <Users className="w-7 h-7" />
              </div>
              <p className="text-xl font-bold leading-snug">
                Но мы знаем сотни людей, которые уже прошли этот путь и готовы отдавать свой опыт вам.
              </p>
            </div>
          </div>

          {/* Section 3: Quote */}
          <div className="relative p-12 md:p-16 border-l-4 border-indigo-600 bg-indigo-600/5 rounded-r-[48px] animate-in fade-in duration-1000 delay-500">
            <Quote className="absolute top-8 right-8 w-20 h-20 text-indigo-600/20" />
            <p className="text-2xl md:text-4xl font-black italic tracking-tight leading-tight mb-6">
              «Если ты не знаешь, как решить какой-то вопрос — просто спроси того, кто уже знает ответ»
            </p>
            <cite className="text-indigo-400 font-black uppercase tracking-widest text-sm not-italic">
              — Саша Смирнов (Фрамбини)
            </cite>
          </div>

          {/* Section 4: Final Message */}
          <div className="text-center space-y-10 animate-in slide-in-from-bottom-8 duration-1000 delay-700">
            <p className="text-2xl font-medium text-slate-300 max-w-2xl mx-auto">
              В ШАГе мы объединяем тех, кто ищет, с теми, кто нашел. 
              Твой путь начинается здесь.
            </p>
            <button 
              onClick={onStart}
              className="group relative px-12 py-8 bg-indigo-600 rounded-[32px] font-black uppercase text-sm tracking-[0.3em] transition-all hover:scale-105 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40"
            >
              <span className="flex items-center gap-4">
                Сделать первый ШАГ <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
