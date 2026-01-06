
import React, { useState } from 'react';
import { 
  Loader2, CheckCircle, ArrowRight, ShieldCheck, 
  CreditCard, Lock, Smartphone, Landmark, QrCode, 
  Zap, Smartphone as PhoneIcon, ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react';
import { dbService } from '../../services/databaseService';

interface PaymentStubProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
  bookingId?: string;
}

export const PaymentStub: React.FC<PaymentStubProps> = ({ amount, onSuccess, onCancel, title, bookingId }) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'waiting_for_return' | 'error'>('selection');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePaymentInitiation = async () => {
    setStep('processing');
    try {
      const res = await dbService.postAction({
        action: 'create_yookassa_payment',
        amount: amount,
        description: `Оплата ШАГа: ${title}`,
        bookingId: bookingId
      });

      if (res.result === 'success' && res.confirmation_url) {
        // Элегантная задержка перед редиректом для визуального подтверждения
        setTimeout(() => {
          window.location.href = res.confirmation_url;
        }, 1000);
        setStep('waiting_for_return');
      } else {
        throw new Error(res.message || 'ЮKassa временно недоступна');
      }
    } catch (e: any) {
      setStep('error');
      setErrorMsg(e.message);
    }
  };

  if (step === 'waiting_for_return') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 border border-indigo-500/20">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
            <Smartphone size={16} />
          </div>
        </div>
        <div className="space-y-4 px-4">
          <h3 className="text-2xl font-black text-slate-900 uppercase font-syne">Перенаправляем...</h3>
          <p className="text-slate-500 text-sm max-w-[300px] mx-auto font-medium leading-relaxed">
            Вы переходите на защищенную страницу оплаты ЮKassa. После завершения платежа вы вернетесь в приложение.
          </p>
          <div className="pt-6 flex flex-col gap-3">
             <button onClick={onSuccess} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                Я уже оплатил встречу <CheckCircle size={14} />
             </button>
             <button onClick={() => setStep('selection')} className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Вернуться к выбору</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 uppercase font-syne">ОШИБКА ШЛЮЗА</h3>
          <p className="text-slate-500 text-sm font-medium px-6">{errorMsg}</p>
        </div>
        <button onClick={() => setStep('selection')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
         <div className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">НАЗНАЧЕНИЕ</h4>
            <p className="text-sm font-black text-slate-900 uppercase font-syne tracking-tight">ЭНЕРГООБМЕН ШАГ</p>
         </div>
         <div className="text-right">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">СУММА</h4>
            <p className="text-3xl font-black text-indigo-600 font-syne leading-none">{amount} ₽</p>
         </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={48} /></div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Объект транзакции</p>
        <p className="text-xs font-bold text-slate-700 leading-snug italic">«{title}»</p>
      </div>

      <div className="space-y-4">
         <button 
           onClick={handlePaymentInitiation}
           disabled={step === 'processing'}
           className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-[28px] hover:border-indigo-600 hover:shadow-xl transition-all group active:scale-[0.98]"
         >
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {step === 'processing' ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
               </div>
               <div className="text-left">
                  <p className="text-sm font-black text-slate-900 uppercase font-syne">Оплатить через ЮKassa</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Карты, СБП, Кошельки</p>
               </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all w-5 h-5" />
         </button>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-center leading-relaxed">
            Безопасный платеж PCI DSS<br/>через шлюз ЮKassa
          </span>
        </div>
      </div>

      <button onClick={onCancel} className="w-full text-slate-300 font-black uppercase text-[10px] tracking-widest hover:text-indigo-600 transition-colors py-2">Отмена</button>
    </div>
  );
};
