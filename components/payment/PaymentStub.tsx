
import React, { useState, useEffect } from 'react';
import { 
  Loader2, ArrowRight, ShieldCheck, 
  CreditCard, AlertCircle, CheckCircle2, Zap, ExternalLink, Heart
} from 'lucide-react';
import { yookassaService } from '../../services/yookassaService';

interface PaymentStubProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
  bookingId?: string;
}

export const PaymentStub: React.FC<PaymentStubProps> = ({ amount, onSuccess, onCancel, title, bookingId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Проверка статуса при монтировании (если пользователь вернулся после оплаты)
  useEffect(() => {
    const savedId = sessionStorage.getItem('last_payment_id');
    if (savedId) {
      verifyPayment(savedId);
    }
  }, []);

  const requestPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // return_url — куда ЮKassa отправит пользователя ПОСЛЕ оплаты
      const returnUrl = window.location.origin + window.location.pathname + '?payment_return=true';
      
      const response = await yookassaService.createPayment({
        amount,
        description: `ШАГ Энергообмен: ${title}`,
        metadata: { bookingId, source: 'shag_platform' },
        return_url: returnUrl
      });

      if (response.confirmation?.confirmation_url) {
        // Сохраняем ID платежа, чтобы проверить его, когда пользователь вернется
        sessionStorage.setItem('last_payment_id', response.id);
        setCheckoutUrl(response.confirmation.confirmation_url);
        
        // Редирект на страницу оплаты ЮKassa
        window.location.href = response.confirmation.confirmation_url;
      } else {
        throw new Error('ЮKassa не вернула ссылку для оплаты');
      }
    } catch (e: any) {
      setError(e.message || "Ошибка соединения с платежным шлюзом.");
      setLoading(false);
    }
  };

  const verifyPayment = async (idToVerify: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const status = await yookassaService.checkPaymentStatus(idToVerify);
      
      if (status === 'succeeded' || status === 'waiting_for_capture') {
        setIsSuccess(true);
        sessionStorage.removeItem('last_payment_id');
        // Небольшая задержка для визуального подтверждения
        setTimeout(onSuccess, 1500);
      } else if (status === 'canceled') {
        setError("Платеж был отменен. Попробуйте еще раз.");
        sessionStorage.removeItem('last_payment_id');
      } else {
        // Если все еще pending, значит пользователь нажал проверку слишком рано или не оплатил
        setError("Оплата еще не подтверждена банком. Если вы уже оплатили, подождите 30 секунд и нажмите проверить снова.");
      }
    } catch (e) {
      setError("Ошибка при проверке статуса платежа.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]">
          <CheckCircle2 className="w-16 h-16 text-white animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-slate-900 uppercase font-syne tracking-tighter">УСПЕШНО</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Платеж подтвержден, ШАГ активирован</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
         <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center text-indigo-600">
            <Heart size={40} className="fill-current" />
         </div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">СУММА К ОПЛАТЕ</h4>
            <p className="text-5xl font-black text-slate-900 font-syne tracking-tighter">{amount.toLocaleString()} ₽</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
         </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-[32px] border border-slate-100">
             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Перенаправляем в ЮKassa...</p>
          </div>
        ) : (
          <button 
            onClick={requestPayment}
            className="w-full flex items-center justify-between p-8 bg-indigo-600 text-white rounded-[32px] hover:bg-indigo-500 transition-all group shadow-2xl active:scale-95"
          >
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CreditCard size={28} />
               </div>
               <div className="text-left">
                  <p className="text-base font-black uppercase font-syne">ОПЛАТИТЬ</p>
                  <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">БАНКОВСКАЯ КАРТА / СБП</p>
               </div>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        )}

        {sessionStorage.getItem('last_payment_id') && !loading && (
          <div className="p-2 border-2 border-dashed border-emerald-100 rounded-[32px] space-y-2">
            <button 
              disabled={isVerifying}
              onClick={() => verifyPayment(sessionStorage.getItem('last_payment_id')!)}
              className="w-full py-6 bg-emerald-50 text-emerald-600 rounded-[28px] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-3"
            >
              {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Я ОПЛАТИЛ, ПРОВЕРИТЬ СТАТУС
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-[10px] font-bold uppercase leading-relaxed">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <button onClick={onCancel} className="text-slate-400 font-black uppercase text-[10px] py-2 tracking-[0.3em] hover:text-slate-900 transition-colors">ВЕРНУТЬСЯ НАЗАД</button>
        <div className="flex gap-4 opacity-20 grayscale scale-75">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-6" alt="Mir" />
        </div>
      </div>
    </div>
  );
};
