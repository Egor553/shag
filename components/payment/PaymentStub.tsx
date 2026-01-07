
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

  useEffect(() => {
    // Проверяем, есть ли незавершенный платеж при загрузке
    const savedId = sessionStorage.getItem('last_payment_id');
    if (savedId && !isSuccess) {
      verifyPayment(savedId);
    }
  }, []);

  const requestPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await yookassaService.createPayment({
        amount,
        description: `ШАГ Энергообмен: ${title}`,
        metadata: { bookingId },
        return_url: window.location.href // Возврат на ту же страницу
      });

      if (response.confirmation?.confirmation_url) {
        sessionStorage.setItem('last_payment_id', response.id);
        setCheckoutUrl(response.confirmation.confirmation_url);
        
        // Автоматический переход через секунду
        setTimeout(() => {
          window.location.href = response.confirmation!.confirmation_url;
        }, 1500);
      }
    } catch (e: any) {
      setError(e.message || "Ошибка соединения с ЮKassa.");
      setLoading(false);
    }
  };

  const verifyPayment = async (idToVerify: string) => {
    setIsVerifying(true);
    try {
      const status = await yookassaService.checkPaymentStatus(idToVerify);
      if (status === 'succeeded' || status === 'waiting_for_capture') {
        setIsSuccess(true);
        sessionStorage.removeItem('last_payment_id');
        setTimeout(onSuccess, 2000);
      } else {
        setError("Платеж еще обрабатывается банком. Попробуйте нажать кнопку проверки через 30-60 секунд.");
      }
    } catch (e) {
      setError("Не удалось связаться с платежным сервером.");
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
        <h3 className="text-3xl font-black text-slate-900 uppercase font-syne tracking-tighter">ОПЛАЧЕНО</h3>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">ШАГ подтвержден</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center space-y-4">
         <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center text-indigo-600">
            <Heart size={40} className="fill-current" />
         </div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">СУММА ЭНЕРГООБМЕНА</h4>
            <p className="text-5xl font-black text-slate-900 font-syne tracking-tighter">{amount.toLocaleString()} ₽</p>
         </div>
      </div>

      <div className="space-y-4">
        {loading && !checkoutUrl ? (
          <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-[32px] border border-slate-100">
             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Формируем защищенный счет...</p>
          </div>
        ) : checkoutUrl ? (
          <div className="space-y-4 animate-in fade-in">
            <a 
              href={checkoutUrl}
              className="w-full flex items-center justify-between p-8 bg-emerald-600 text-white rounded-[32px] hover:bg-emerald-500 transition-all shadow-xl"
            >
              <div className="text-left">
                <p className="text-base font-black uppercase font-syne">ПЕРЕЙТИ К ОПЛАТЕ</p>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">ЮKassa (КАРТЫ / СБП)</p>
              </div>
              <ExternalLink size={24} />
            </a>
            <p className="text-[9px] text-center text-slate-400 font-bold px-4">
              Окно оплаты откроется автоматически. Если нет — нажмите на кнопку выше.
            </p>
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
                  <p className="text-base font-black uppercase font-syne">ОПЛАТИТЬ ШАГ</p>
                  <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">БЕЗОПАСНЫЙ ПЛАТЕЖ</p>
               </div>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        )}

        {sessionStorage.getItem('last_payment_id') && !loading && (
          <button 
            disabled={isVerifying}
            onClick={() => verifyPayment(sessionStorage.getItem('last_payment_id')!)}
            className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
          >
            {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            Я ОПЛАТИЛ, ПРОВЕРИТЬ СТАТУС
          </button>
        )}
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-[10px] font-bold uppercase leading-relaxed">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <button onClick={onCancel} className="w-full text-slate-400 font-black uppercase text-[10px] py-2 tracking-[0.3em] hover:text-slate-900 transition-colors">ОТМЕНИТЬ</button>
    </div>
  );
};
