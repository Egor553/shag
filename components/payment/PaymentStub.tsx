
import React, { useState } from 'react';
import { 
  Loader2, CheckCircle, ArrowRight, ShieldCheck, 
  CreditCard, Lock, Smartphone, Landmark, QrCode, 
  Zap, Smartphone as PhoneIcon, ChevronRight, ExternalLink
} from 'lucide-react';
import { dbService } from '../../services/databaseService';

interface PaymentStubProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
  bookingId?: string; // Передаем ID брони для связи
}

export const PaymentStub: React.FC<PaymentStubProps> = ({ amount, onSuccess, onCancel, title, bookingId }) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'waiting_for_return' | 'error'>('selection');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePaymentInitiation = async () => {
    setStep('processing');
    try {
      // Имитация или реальный вызов API для создания платежа в ЮKassa
      const res = await dbService.postAction({
        action: 'create_yookassa_payment',
        amount: amount,
        description: `Оплата ШАГа: ${title}`,
        bookingId: bookingId
      });

      if (res.result === 'success' && res.confirmation_url) {
        // В реальном приложении мы перенаправляем пользователя
        window.location.href = res.confirmation_url;
        // Или открываем в новой вкладке, если это SPA
        // window.open(res.confirmation_url, '_blank');
        setStep('waiting_for_return');
      } else {
        throw new Error(res.message || 'Ошибка инициализации платежа');
      }
    } catch (e: any) {
      setStep('error');
      setErrorMsg(e.message);
    }
  };

  if (step === 'waiting_for_return') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 border border-indigo-500/20">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-slate-900 uppercase font-syne">Ожидаем оплату</h3>
          <p className="text-slate-500 text-sm max-w-[280px] mx-auto font-medium">
            Вы были перенаправлены на страницу ЮKassa. После завершения оплаты статус обновится автоматически.
          </p>
          <button onClick={onSuccess} className="text-indigo-600 font-black uppercase text-[10px] tracking-widest mt-4 flex items-center justify-center gap-2 mx-auto">
            Я уже оплатил <CheckCircle size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
          <Zap className="w-12 h-12" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 uppercase font-syne">ОШИБКА ПЛАТЕЖА</h3>
          <p className="text-slate-500 text-sm font-medium">{errorMsg || 'Технические неполадки на стороне шлюза'}</p>
        </div>
        <button onClick={() => setStep('selection')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px]">Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
         <div className="space-y-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Получатель</h4>
            <p className="text-sm font-black text-slate-900 uppercase font-syne tracking-tight">Платформа ШАГ</p>
         </div>
         <div className="text-right">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Сумма</h4>
            <p className="text-2xl font-black text-indigo-600 font-syne">{amount} ₽</p>
         </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Детали платежа</p>
        <div className="flex items-center justify-between">
           <span className="text-xs font-bold text-slate-600 truncate mr-4">{title}</span>
        </div>
      </div>

      {step === 'selection' && (
        <div className="space-y-4">
           <button 
             onClick={handlePaymentInitiation}
             className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-[28px] hover:border-indigo-600 hover:shadow-lg transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                    <CreditCard className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase font-syne">Перейти к оплате</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Безопасный шлюз ЮKassa</p>
                 </div>
              </div>
              <ExternalLink className="text-slate-300 group-hover:text-indigo-600 transition-colors w-5 h-5" />
           </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Связь с банком...</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 pt-6 opacity-30">
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[7px] font-black uppercase tracking-widest leading-none text-center">Безопасная оплата через ЮKassa<br/>по протоколу PCI DSS</span>
        </div>
      </div>

      <button onClick={onCancel} className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-indigo-600 transition-colors">Отмена</button>
    </div>
  );
};
