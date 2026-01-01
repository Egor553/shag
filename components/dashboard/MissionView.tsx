
import React from 'react';
import { Quote, Zap, ShieldCheck, CheckCircle2, MessageSquareX, TrendingUp, Users } from 'lucide-react';
import { ShagLogo } from '../../App';

export const MissionView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-32 py-10 animate-in fade-in duration-1000 pb-32">
      {/* Hero Section */}
      <div className="text-center space-y-12">
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20 animate-pulse" />
          <div className="p-4 bg-slate-900 rounded-[32px] shadow-2xl border border-white/10 relative z-10">
             <ShagLogo className="w-24 h-24" />
          </div>
        </div>
        <div className="space-y-6">
           <div className="flex items-center justify-center gap-4 text-indigo-500 mb-2">
              <div className="w-12 h-px bg-indigo-500/30" />
              <span className="font-black text-[10px] uppercase tracking-[0.6em]">Energy Exchange Platform</span>
              <div className="w-12 h-px bg-indigo-500/30" />
           </div>
           <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase font-syne">
            НАША<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-white">МИССИЯ</span>
          </h1>
        </div>
        <p className="text-xl md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-tight italic">
          «Дать молодым ребятам и твёрдым предпринимателям/топам своей ниши возможность найти друг друга» 📊
        </p>
      </div>

      {/* The Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[56px] space-y-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase font-syne">Запрос ребят (18-27 лет)</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Выход на новый уровень дохода, финансовая стабильность, самореализация, наставник, социальный капитал, партнеры и окружение. Как решить всё это одновременно? Мы не знаем чёткого рецепта... НО есть люди, которые уже прошли этот путь.
          </p>
        </div>
        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[56px] space-y-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500">
            <MessageSquareX className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase font-syne">Где найти наставника?</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Бесплатные чаты? 98% — шлак. Платные? Самые дешевые едва ли дают доступ к людям с доходом 1-3-5 млн+. Для этого существуем МЫ. Мы отобрали и договорились с предпринимателями об их готовности отдавать.
          </p>
        </div>
      </div>

      {/* The Selection Criteria */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-white/10 rounded-[64px] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-syne tracking-tighter">КРИТЕРИИ ОТБОРА</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">
                Мы выбираем тех, кто не только успешен в деньгах, но и твёрд в ценностях. На ШАГе ты выбираешь наставника по вайбу, нише и человеческим качествам.
              </p>
              <div className="flex items-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
                <CheckCircle2 className="w-5 h-5" /> Проверенные предприниматели
              </div>
            </div>
            <div className="space-y-6 bg-black/40 p-10 rounded-[40px] border border-white/10">
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Проходной порог:</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-300">
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Опыт в нише: от 10 лет</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Бизнес: оборот от 100 млн ₽ в год</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Эксперты: внушительные кейсы и результаты</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Семья, ценности и образ жизни</li>
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="text-center space-y-12">
        <div className="relative inline-block">
          <Quote className="absolute -top-10 -left-10 w-20 h-20 text-indigo-600/10" />
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter italic">
            «ЧЕЛОВЕКУ НУЖЕН ЧЕЛОВЕК»
          </h2>
        </div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.8em]">Энергообмен ШАГ</p>
      </div>
    </div>
  );
};
