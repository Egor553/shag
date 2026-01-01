
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
          <div className="p-4 bg-slate-900 rounded-[32px] shadow-2xl border border-white/10 relative z-10">
             <ShagLogo className="w-24 h-24" />
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="group space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[56px] hover:border-indigo-500/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Target className="w-40 h-40" /></div>
          <div className="w-16 h-16 bg-indigo-600/20 rounded-3xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><Target className="w-8 h-8" /></div>
          <h3 className="text-3xl font-black text-white uppercase font-syne leading-none">Запросы<br/>поколения</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">Молодым ребятам не нужны скучные лекции. Им нужен выход на новый уровень дохода, социальный капитал и наставник, который уже прошёл путь.</p>
        </div>
        <div className="group space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[56px] hover:border-violet-500/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000"><TrendingUp className="w-40 h-40" /></div>
          <div className="w-16 h-16 bg-violet-600/20 rounded-3xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform"><TrendingUp className="w-8 h-8" /></div>
          <h3 className="text-3xl font-black text-white uppercase font-syne leading-none">Живой<br/>энергообмен</h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">Взрослым предпринимателям важно отдавать. ШАГ — это платформа, где они делают это безвозмездно, а средства талантов идут на развитие сообщества.</p>
        </div>
      </div>
    </div>
  );
};
