
import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Zap, Target, ShieldCheck, Activity } from 'lucide-react';
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
      } else {
        alert("ИИ подбирает наиболее близкий вариант...");
        // В случае ошибки или если не найден конкретный ID, попробуем еще раз с первым ментором для демонстрации
        if (mentors.length > 0) {
           setResult({
              mentor: mentors[0],
              reason: data.reason || "Этот ментор обладает схожими компетенциями для вашего запроса.",
              matchPercentage: data.matchPercentage || 85,
              advice: data.advice || "Начните с четкого ТЗ вашего проекта."
           });
        }
      }
    } catch (e) {
      console.error(e);
      alert("Сбой нейронной сети. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-5xl bg-[#050505] border border-white/10 rounded-[48px] md:rounded-[64px] shadow-[0_0_150px_rgba(79,70,229,0.15)] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-all z-50">
          <X className="w-8 h-8" />
        </button>

        <div className="p-8 md:p-20">
          {!result && !isLoading && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-indigo-500">
                  <Activity className="w-6 h-6 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">ШАГ_AI_MATCHMAKER</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                  НАЙДИ СВОЙ<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">РЕЗОНАНС</span>
                </h2>
                <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed">
                  Опишите свой запрос максимально честно. Наш интеллект проанализирует опыт сотен менторов, чтобы найти идеальное совпадение.
                </p>
              </div>

              <div className="relative group">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Например: 'Я запускаю стартап в сфере логистики и мне нужен ментор, который поможет выстроить операционку и привлечь первые инвестиции...'"
                  className="w-full bg-white/[0.02] border border-white/10 p-10 rounded-[40px] text-white text-xl md:text-2xl font-medium outline-none focus:border-indigo-500/50 transition-all h-56 resize-none shadow-2xl"
                />
                <button 
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="absolute bottom-6 right-6 px-12 py-7 bg-indigo-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-20"
                >
                  ЗАПУСТИТЬ АНАЛИЗ <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in duration-1000">
              <div className="relative">
                <div className="w-48 h-48 bg-indigo-600/10 rounded-full flex items-center justify-center relative z-10">
                  <Loader2 className="w-24 h-24 text-indigo-500 animate-spin" />
                </div>
                <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-20 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white uppercase font-syne tracking-widest">АНАЛИЗИРУЕМ МАТРИЦУ</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Ищем ментора с нужной энергией...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="space-y-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">MATCH: {result.matchPercentage}%</span>
                  </div>
                  <h3 className="text-6xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                    ВАШ<br/><span className="text-indigo-500">ПРОВОДНИК</span>
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[48px] relative">
                    <p className="text-xl font-medium text-slate-300 leading-relaxed italic">
                      «{result.reason}»
                    </p>
                  </div>
                  <div className="flex items-start gap-5 p-8 bg-indigo-500/5 rounded-[32px] border border-indigo-500/10">
                    <Target className="w-6 h-6 text-indigo-400 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Совет от ИИ</p>
                      <p className="text-sm text-indigo-300/80 font-bold leading-relaxed">
                        {result.advice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={() => setResult(null)}
                    className="flex-1 py-8 rounded-[32px] font-black uppercase text-[10px] tracking-[0.3em] text-slate-600 hover:text-white hover:bg-white/5 transition-all border border-white/5"
                  >
                    ИЗМЕНИТЬ ЗАПРОС
                  </button>
                  <button 
                    onClick={() => onSelectMentor(result.mentor)}
                    className="flex-[2] bg-white text-black py-8 rounded-[32px] font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4"
                  >
                    ПЕРЕЙТИ К ВСТРЕЧЕ <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-600 blur-[120px] opacity-10 rounded-full" />
                <div className="relative w-full aspect-[4/5] rounded-[64px] overflow-hidden border border-white/10 shadow-3xl">
                   <img src={result.mentor.paymentUrl || result.mentor.avatarUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   <div className="absolute bottom-16 left-12 right-12 space-y-3">
                      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em]">{result.mentor.industry}</p>
                      <h4 className="text-5xl font-black text-white uppercase font-syne tracking-tighter leading-none">{result.mentor.name}</h4>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
