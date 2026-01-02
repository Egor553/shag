
import React, { useState } from 'react';
import { 
  Loader2, CheckCircle, ArrowRight, ShieldCheck, 
  CreditCard, Lock, Smartphone, Landmark, QrCode, 
  Zap, Smartphone as PhoneIcon, ChevronRight
} from 'lucide-react';

interface PaymentStubProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
}

type PaymentMethod = 'card' | 'sbp';

export const PaymentStub: React.FC<PaymentStubProps> = ({ amount, onSuccess, onCancel, title }) => {
  const [method, setMethod] = useState<PaymentMethod>('sbp');
  const [step, setStep] = useState<'selection' | 'processing' | 'secure' | 'success'>('selection');
  const [cardNumber, setCardNumber] = useState('');
  
  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      if (method === 'card') setStep('secure');
      else {
        setStep('success');
        setTimeout(() => onSuccess(), 1500);
      }
    }, 2000);
  };

  const handleConfirmSecure = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 1500);
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <CheckCircle className="text-white w-12 h-12" />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-slate-900 uppercase font-syne tracking-tight">ШАГ ОПЛАЧЕН</h3>
          <p className="text-slate-500 font-medium max-w-[280px] mx-auto">Транзакция подтверждена. Данные встречи обновлены в вашем календаре.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
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
           <span className="text-xs font-black text-slate-900">№{Math.floor(Math.random() * 999999)}</span>
        </div>
      </div>

      {step === 'selection' && (
        <div className="space-y-4">
           <button 
             onClick={() => { setMethod('sbp'); handlePay(); }}
             className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-[28px] hover:border-indigo-600 hover:shadow-lg transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                    <Zap className="text-pink-500 w-6 h-6 fill-current" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase font-syne">СБП</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Мгновенная оплата</p>
                 </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
           </button>

           <button 
             onClick={() => setStep('secure')}
             className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-[28px] hover:border-indigo-600 hover:shadow-lg transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                    <CreditCard className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase font-syne">Банковская карта</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Мир, Visa, Mastercard</p>
                 </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
           </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
           <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Обработка данных...</p>
        </div>
      )}

      {step === 'secure' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
           <div className="bg-white border-2 border-slate-100 p-8 rounded-[40px] space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Номер карты</label>
                 <input 
                   placeholder="0000 0000 0000 0000" 
                   value={cardNumber}
                   onChange={e => setCardNumber(e.target.value)}
                   className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="ММ/ГГ" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 text-center" />
                 <input type="password" placeholder="CVC" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 text-center" />
              </div>
              <button onClick={handlePay} className="w-full bg-indigo-600 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl">Оплатить {amount} ₽</button>
           </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 pt-6 opacity-30">
        <div className="flex items-center gap-6 grayscale">
           <img src="https://sbp.nspk.ru/assets/img/logo.svg" className="h-4" alt="SBP" />
           <div className="w-px h-4 bg-slate-300" />
           <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-2" alt="Mir" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
           </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[7px] font-black uppercase tracking-widest leading-none text-center">Безопасная оплата через ЮKassa<br/>по протоколу PCI DSS</span>
        </div>
      </div>

      <button onClick={onCancel} className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-indigo-600 transition-colors">Отмена</button>
    </div>
  );
};
