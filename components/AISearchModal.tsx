import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import { Mentor } from '../types';
import { findBestMentor } from '../services/geminiService';

interface AISearchModalProps {
  mentors: Mentor[];
  onClose: () => void;
  onSelectMentor: (mentor: Mentor) => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({ mentors, onClose, onSelectMentor }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ mentor: Mentor; reason: string; matchPercentage: number; advice: string } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const responseText = await findBestMentor(query, mentors);
      const data = JSON.parse(responseText);
      const foundMentor = mentors.find(m => String(m.id) === String(data.id) || m.email === data.id);
      
      if (foundMentor) {
        setResult({ 
          mentor: foundMentor, 
          reason: data.reason, 
          matchPercentage: data.matchPercentage,
          advice: data.advice 
        });
      } else if (mentors.length > 0) {
        setResult({
          mentor: mentors[0],
          reason: data.reason || "Этот ментор обладает схожими компетенциями для вашего запроса.",
          matchPercentage: data.matchPercentage || 85,
          advice: data.advice || "Начните с четкого описания вашего проекта."
        });
      }
    } catch (e) {
      console.error(e);
      alert("Сбой нейронной сети. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto no-scrollbar animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      
      <button onClick={onClose} className="fixed top-6 right-6 p-3 bg-white/5 rounded-full text-white/50 hover:text-white transition-all z-[110] backdrop-blur-xl border border-white/10">
        <X size={24} />
      </button>

      <div className="min-h-screen flex flex-col p-6 md:p-20 max-w-7xl mx-auto">
        {!result && !isLoading && (
          <div className="flex-1 flex flex-col justify-center space-y-10 animate-in slide-in-from-bottom-8 duration-700 pt-10">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 text-indigo-500">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">ШАГ_ИИ_ПОДБОР</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                НАЙДИ СВОЙ<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">РЕЗОНАНС</span>
              </h2>
              <p className="text-slate-500 text-base md:text-2xl font-medium max-w-2xl leading-relaxed">
                Опишите свой запрос максимально честно. Наш интеллект проанализирует опыт менторов, чтобы найти идеальное совпадение.
              </p>
            </div>

            <div className="relative group space-y-6">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Например: 'Я запускаю стартап в сфере логистики и мне нужен ментор...'"
                className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[32px] md:rounded-[40px] text-white text-lg md:text-2xl font-medium outline-none focus:border-indigo-500/50 transition-all h-48 md:h-64 resize-none shadow-2xl"
              />
              <button 
                onClick={handleSearch}
                disabled={!query.trim()}
                className="w-full md:w-auto px-10 py-6 md:py-8 bg-indigo-600 text-white rounded-[24px] md:rounded-[32px] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20"
              >
                ЗАПУСТИТЬ АНАЛИЗ <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-indigo-600/10 rounded-full flex items-center justify-center relative z-10">
                <Loader2 className="w-12 h-12 md:w-20 md:h-20 text-indigo-500 animate-spin" />
              </div>
              <div className="absolute inset-0 bg-indigo-600 blur-[60px] md:blur-[100px] opacity-20 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase font-syne tracking-widest">АНАЛИЗИРУЕМ МАТРИЦУ</h3>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]">Ищем ментора с нужной энергией...</p>
            </div>
          </div>
        )}

        {result && (
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 animate-in slide-in-from-bottom-12 duration-1000 pt-16 pb-10">
            <div className="space-y-8 flex flex-col justify-center order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[9px] font-black uppercase tracking-widest">СОВПАДЕНИЕ: {result.matchPercentage}%</span>
                </div>
                <h3 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                  ВАШ<br/><span className="text-indigo-500">ПРОВОДНИК</span>
                </h3>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="p-6 md:p-10 bg-white/[0.03] border border-white/10 rounded-[28px] md:rounded-[48px]">
                  <p className="text-base md:text-xl font-medium text-slate-300 leading-relaxed italic">
                    «{result.reason}»
                  </p>
                </div>
                <div className="flex items-start gap-4 p-6 bg-indigo-500/5 rounded-[24px] border border-indigo-500/10">
                  <Target className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Совет от ИИ</p>
                    <p className="text-xs md:text-sm text-indigo-300/80 font-bold leading-relaxed">
                      {result.advice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 py-6 rounded-[24px] font-black uppercase text-[9px] tracking-[0.3em] text-slate-600 hover:text-white hover:bg-white/5 transition-all border border-white/5"
                >
                  ИЗМЕНИТЬ ЗАПРОС
                </button>
                <button 
                  onClick={() => onSelectMentor(result.mentor)}
                  className="flex-[1.5] bg-white text-black py-6 rounded-[24px] font-black uppercase text-[9px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  ПЕРЕЙТИ К ВСТРЕЧЕ <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="relative group flex items-center justify-center order-1 lg:order-2">
              <div className="absolute inset-0 bg-indigo-600 blur-[80px] md:blur-[120px] opacity-10 rounded-full" />
              <div className="relative w-full aspect-[4/5] max-w-sm lg:max-w-none rounded-[40px] md:rounded-[64px] overflow-hidden border border-white/10 shadow-3xl">
                 <img src={result.mentor.paymentUrl || result.mentor.avatarUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                 <div className="absolute bottom-10 left-8 right-8 space-y-2">
                    <p className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.5em]">{result.mentor.industry}</p>
                    <h4 className="text-3xl md:text-5xl font-black text-white uppercase font-syne tracking-tighter leading-none">{result.mentor.name}</h4>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};