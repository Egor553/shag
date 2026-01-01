
import React from 'react';
import { Quote, Sparkles, Zap, Heart, Users, ShieldCheck, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { ShagLogo } from '../../App';

export const MissionView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-24 py-10 animate-in fade-in duration-1000 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-12">
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20 animate-pulse" />
          <ShagLogo className="w-28 h-28 relative z-10" />
        </div>
        <div className="space-y-4">
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
        <p className="text-xl md:text-3xl font-bold text-slate-300 max-w-3xl mx-auto leading-tight">
          Создать мост между поколениями, где опыт твёрдых предпринимателей встречается с дерзостью молодых талантов 📊
        </p>
      </div>

      {/* Философия ШАГа */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="group space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[56px] hover:border-indigo-500/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
             <Target className="w-40 h-40" />
          </div>
          <div className="w-16 h-16 bg-indigo-600/20 rounded-3xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase font-syne leading-none">Запросы<br/>поколения</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Молодым ребятам (18-27 лет) не нужны скучные лекции. Им нужен выход на новый уровень дохода, социальный капитал и наставник, который уже прошёл этот путь.
          </p>
        </div>

        <div className="group space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[56px] hover:border-violet-500/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
             <TrendingUp className="w-40 h-40" />
          </div>
          <div className="w-16 h-16 bg-violet-600/20 rounded-3xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase font-syne leading-none">Живой<br/>энергообмен</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Взрослым предпринимателям важно отдавать. ШАГ — это платформа, где они делают это безвозмездно, а средства талантов идут на развитие сообщества.
          </p>
        </div>
      </div>

      {/* Центральная цитата */}
      <div className="relative p-12 md:p-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[64px] overflow-hidden group shadow-3xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <Quote className="absolute top-10 right-10 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10 space-y-10">
           <p className="text-3xl md:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
             «Энергия — это единственная валюта, которая растёт, когда ты её отдаёшь»
           </p>
           <div className="flex items-center gap-6">
              <div className="w-16 h-px bg-white/40" />
              <span className="text-xs font-black uppercase tracking-[0.5em] text-white/80">Саша Смирнов (Фрамбини)</span>
           </div>
        </div>
      </div>

      {/* Почему мы? */}
      <div className="space-y-16 py-12">
        <div className="max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-syne tracking-tight leading-none">ГДЕ НАЙТИ ТАКИХ ЛЮДЕЙ?</h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Бесплатные чаты переполнены шумом. Платные клубы часто недоступны для старта. ШАГ — это единственный фильтр, где предприниматели с доходом 1-5 млн+ в месяц ждут твоего запроса.
          </p>
          <div className="flex items-center gap-4 text-indigo-500 font-black uppercase text-xs tracking-widest bg-indigo-500/10 px-8 py-5 rounded-3xl border border-indigo-500/20 w-fit">
            Человеку нужен человек <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "СТРОГИЙ ОТБОР", text: "Мы верифицируем каждого ментора лично.", icon: ShieldCheck },
             { title: "ГОТОВНОСТЬ ОТДАВАТЬ", text: "Здесь нет тех, кто хочет заработать на тебе.", icon: Zap },
             { title: "ТВОЙ ШАГ", text: "Просто выбери того, кто откликается твоему вайбу.", icon: Heart }
           ].map((item, i) => (
             <div key={i} className="p-10 border border-white/5 bg-white/[0.01] rounded-[40px] space-y-6 hover:bg-white/[0.03] transition-all group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                   <item.icon className="w-7 h-7" />
                </div>
                <h4 className="font-black text-white uppercase text-sm tracking-widest font-syne">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Критерии */}
      <div className="bg-white p-12 md:p-24 rounded-[64px] shadow-3xl space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <ShieldCheck className="w-64 h-64 text-indigo-600" />
        </div>
        <div className="space-y-4 relative z-10">
           <div className="flex items-center gap-3 text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Trust & Excellence</span>
           </div>
           <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase font-syne tracking-tighter leading-none">
             КРИТЕРИИ ОТБОРА<br/>МЕНТОРОВ
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 relative z-10">
           <div className="space-y-8">
              {[
                "Минимум 10 лет опыта в своей нише",
                "Оборот бизнеса от 100 млн ₽ в год",
                "Если эксперт — мировые кейсы и результаты"
              ].map((text, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-8 h-8 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0 mt-1"><Sparkles className="w-4 h-4 text-indigo-600" /></div>
                   <p className="text-lg font-bold text-slate-800">{text}</p>
                </div>
              ))}
           </div>
           <div className="space-y-8">
              {[
                "Наличие семьи и здоровых ценностей",
                "ЗОЖ и осознанный подход к жизни",
                "Искреннее желание быть полезным миру"
              ].map((text, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-8 h-8 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 mt-1"><Heart className="w-4 h-4 text-emerald-600" /></div>
                   <p className="text-lg font-bold text-slate-800">{text}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
