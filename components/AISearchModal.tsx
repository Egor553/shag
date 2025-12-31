
import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Zap, Target } from 'lucide-react';
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
  const [result, setResult] = useState<{ mentor: Mentor; reason: string } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const responseText = await findBestMentor(query, mentors);
      const data = JSON.parse(responseText);
      const foundMentor = mentors.find(m => String(m.id) === String(data.id));
      
      if (foundMentor) {
        setResult({ mentor: foundMentor, reason: data.reason });
      } else {
        alert("Не удалось найти подходящего наставника. Попробуйте изменить запрос.");
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка при поиске. Проверьте подключение или API ключ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-[#0a0a0b] border border-white/10 rounded-[48px] md:rounded-[64px] shadow-[0_0_120px_rgba(79,70,229,0.2)] overflow-hidden relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors z-50">
          <X className="w-8 h-8" />
        </button>

        <div className="p-8 md:p-16 space-y-12">
          {!result && !isLoading && (
            <div className="space-y-10 text-center md:text-left animate-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-4 text-indigo-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">AI Mentor Matching</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                  КТО ТЕБЕ<br/>НУЖЕН?
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                  Опиши свой текущий вызов, проект или запрос. Наш AI проанализирует опыт всех менторов и найдет идеальное совпадение для тебя.
                </p>
              </div>

              <div className="space-y-6">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Например: 'Я запускаю бренд одежды и ищу эксперта в маркетинге, который поможет с позиционированием и первыми продажами...'"
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[32px] text-white text-xl font-medium outline-none focus:border-indigo-500 transition-all h-48 resize-none shadow-inner"
                />
                <button 
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="w-full py-8 bg-indigo-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-30"
                >
                  Запустить магию поиска <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-1000">
              <div className="relative">
                <div className="w-32 h-32 bg-indigo-600/20 rounded-[40px] flex items-center justify-center relative z-10">
                  <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                </div>
                <div className="absolute inset-0 bg-indigo-600 blur-[60px] opacity-20 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase font-syne">Анализируем базу...</h3>
                <p className="text-slate-500 font-medium">Подбираем наставника с максимально релевантным опытом</p>
              </div>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    <Zap className="w-3 h-3 fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Идеальное совпадение</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
                    МЫ НАШЛИ<br/><span className="text-indigo-500">ШАГ</span>
                  </h3>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Target className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Почему это лучший выбор:</span>
                  </div>
                  <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                    «{result.reason}»
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setResult(null)}
                    className="flex-1 py-6 rounded-[24px] font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all"
                  >
                    Другой запрос
                  </button>
                  <button 
                    onClick={() => onSelectMentor(result.mentor)}
                    className="flex-[2] bg-white text-black py-6 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-4"
                  >
                    Смотреть профиль <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-10 rounded-full" />
                <div className="relative h-full aspect-[4/5] rounded-[48px] overflow-hidden border-2 border-white/10 shadow-3xl">
                   <img src={result.mentor.avatarUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   <div className="absolute bottom-10 left-10 space-y-2">
                      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">{result.mentor.industry}</p>
                      <h4 className="text-4xl font-black text-white uppercase font-syne">{result.mentor.name}</h4>
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
