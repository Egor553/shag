
import React from 'react';
import { Quote, Zap, ShieldCheck, CheckCircle2, MessageSquareX, TrendingUp, Users, Star, Heart } from 'lucide-react';
import { ShagLogo } from '../../App';
import { FormatsInfo } from '../FormatsInfo';

export const MissionView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-24 md:space-y-40 py-6 md:py-10 animate-in fade-in duration-1000 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 md:space-y-12">
        <div className="flex justify-center mb-4 md:mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 blur-[60px] md:blur-[80px] opacity-20 animate-pulse" />
          <div className="p-3 md:p-4 bg-slate-900 rounded-[28px] md:rounded-[32px] shadow-2xl border border-white/10 relative z-10">
             <ShagLogo className="w-16 h-16 md:w-24 md:h-24" />
          </div>
        </div>
        <div className="space-y-4 md:space-y-6 px-2">
           <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase font-syne">
            НАША<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-white">МИССИЯ</span>
          </h1>
        </div>
        <p className="text-lg md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-tight italic px-4">
          «Дать молодым ребятам и твёрдым предпринимателям возможность найти друг друга» 📊
        </p>
      </div>

      {/* The Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[40px] md:rounded-[56px] space-y-6 md:space-y-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-red-500">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase font-syne">Запрос ребят</h3>
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            Выход на новый уровень дохода, наставник и окружение. Как решить всё это одновременно? Мы не знаем чёткого рецепта... НО есть люди, которые уже прошли этот путь.
          </p>
        </div>
        <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[40px] md:rounded-[56px] space-y-6 md:space-y-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-amber-500">
            <MessageSquareX className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase font-syne">Где найти ментора?</h3>
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            Бесплатные чаты? 98% — шум. Платные? Самые дешевые едва ли дают доступ к людям с доходом 1-5 млн+. Для этого существуем МЫ.
          </p>
        </div>
      </div>

      {/* Interaction Formats Section */}
      <FormatsInfo />

      {/* The Selection Criteria */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-white/10 rounded-[40px] md:rounded-[64px] p-8 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 md:p-20 opacity-10 rotate-12 pointer-events-none">
          <ShieldCheck className="w-32 h-32 md:w-64 md:h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-8 md:space-y-10">
          <h2 className="text-3xl md:text-6xl font-black text-white uppercase font-syne tracking-tighter">КРИТЕРИИ ОТБОРА МЕНТОРОВ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-8">
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                Мы выбираем тех, кто не только успешен в деньгах, но и твёрд в ценностях. Нам важно, чтобы ментор был примером во всех сферах жизни.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                   <CheckCircle2 className="w-5 h-5" /> Проверенные эксперты
                 </div>
                 <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                   <Star className="w-5 h-5" /> Участники топ-бизнес клубов
                 </div>
                 <div className="flex items-center gap-3 text-pink-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                   <Heart className="w-5 h-5" /> Семейные ценности
                 </div>
              </div>
            </div>
            <div className="space-y-4 bg-black/40 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/10">
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Жесткий проходной порог:</h4>
               <ul className="space-y-4 text-xs md:text-sm font-bold text-slate-300">
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Опыт в своей нише: от 5 лет (100% подтверждение)</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Бизнес: личный оборот от 100 млн ₽ / год</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Доп. преимущество: резидентство в клубах Атланты, Клуб 500 и др.</li>
                 <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Спортивный образ жизни и активная соц. позиция</li>
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="text-center space-y-8 md:space-y-12">
        <div className="relative inline-block px-4">
          <Quote className="absolute -top-6 -left-2 md:-top-10 md:-left-10 w-10 h-10 md:w-20 md:h-20 text-indigo-600/10" />
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter italic leading-tight">
            «ЧЕЛОВЕКУ НУЖЕН ЧЕЛОВЕК»
          </h2>
        </div>
        <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.8em]">Энергообмен ШАГ</p>
      </div>
    </div>
  );
};
