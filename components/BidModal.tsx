
import React, { useState, useEffect } from 'react';
import { Service, Auction, UserSession, Bid } from '../types';
import { X, Gavel, TrendingUp, Sparkles, ShieldCheck, Loader2, ArrowRight, MessageSquare, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { dbService } from '../services/databaseService';

interface BidModalProps {
  service: Service;
  auction: Auction;
  session: UserSession;
  onClose: () => void;
  onSuccess: (bid: Bid) => void;
}

export const BidModal: React.FC<BidModalProps> = ({ service, auction, session, onClose, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minStep);
  const [message, setMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiPitch = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Пользователь ${session.name} хочет сделать ставку на встречу с ментором ${service.mentorName}.
      Запрос пользователя: "${session.focusGoal || 'Хочу расти и масштабироваться'}".
      Описание лота: "${service.description}".
      Напиши короткий (2-3 предложения), дерзкий и убедительный текст "почему ментор должен выбрать именно меня", который будет прикреплен к ставке. Отвечай только текстом сообщения.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.9 }
      });

      setMessage(response.text || '');
    } catch (e) {
      console.error(e);
      setError("Не удалось сгенерировать Питч");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (bidAmount < auction.currentBid + auction.minStep) {
      setError(`Минимальная ставка: ${(auction.currentBid + auction.minStep).toLocaleString()} ₽`);
      return;
    }

    // В реальности здесь была бы проверка баланса, для симуляции мы разрешаем ставки,
    // но в будущем можно добавить пополнение.
    setIsSubmitting(true);
    try {
      const newBid: Bid = {
        id: Math.random().toString(36).substr(2, 9),
        auctionId: auction.id,
        userId: session.id || session.email,
        userName: session.name,
        amount: bidAmount,
        message: message,
        timestamp: new Date().toISOString()
      };

      const res = await dbService.placeBid(newBid, auction);
      if (res.result === 'success') {
        onSuccess(newBid);
      }
    } catch (e: any) {
      setError(e.message || "Ошибка при совершении ставки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-[#050505] border border-amber-500/30 rounded-[48px] overflow-hidden relative shadow-[0_0_100px_rgba(212,175,55,0.1)]">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all z-50">
          <X size={32} />
        </button>

        <div className="p-10 md:p-16 space-y-12">
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 text-amber-500">
              <Gavel size={24} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">PLATFORM_AUCTION_ENGINE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-syne tracking-tighter leading-none">
              СДЕЛАТЬ<br/><span className="text-amber-500">СТАВКУ</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
              Повышая ставку, вы увеличиваете свой вклад в сообщество и шансы на резонанс с ментором.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex flex-col items-center gap-4">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Ваша сумма энергообмена</p>
              <div className="flex items-center gap-6">
                 <button onClick={() => setBidAmount(prev => Math.max(auction.currentBid + auction.minStep, prev - auction.minStep))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all">-</button>
                 <div className="flex items-baseline gap-2">
                    <input 
                      type="number"
                      value={bidAmount}
                      onChange={e => setBidAmount(Number(e.target.value))}
                      className="bg-transparent text-6xl font-black text-white font-syne text-center w-48 outline-none"
                    />
                    <span className="text-2xl font-bold text-amber-500">₽</span>
                 </div>
                 <button onClick={() => setBidAmount(prev => prev + auction.minStep)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all">+</button>
              </div>
              <p className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest">Минимальный шаг: +{auction.minStep.toLocaleString()} ₽</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={12} /> СОПРОВОДИТЕЛЬНОЕ ПИСЬМО
                </label>
                <button 
                  onClick={handleAiPitch}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-[9px] font-black uppercase tracking-widest group"
                >
                  {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />}
                  Усилить с ИИ
                </button>
              </div>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Расскажите ментору, почему эта встреча важна для вас..."
                className="w-full bg-white/[0.02] border border-white/10 p-6 rounded-[24px] text-white text-sm font-medium outline-none focus:border-amber-500/30 transition-all h-32 resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase text-center tracking-widest">
              {error}
            </div>
          )}

          <div className="pt-6 space-y-6">
            <button 
              disabled={isSubmitting}
              onClick={handlePlaceBid}
              className="w-full bg-white text-black py-8 rounded-[32px] font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Gavel size={20} />} 
              ПОДТВЕРДИТЬ СТАВКУ
            </button>
            <div className="flex items-center justify-center gap-6 text-white/20">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Гарантия ШАГ</span>
               </div>
               <div className="flex items-center gap-2">
                  <Heart size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">100% Вклад</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
