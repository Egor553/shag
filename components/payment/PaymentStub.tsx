
import React, { useState, useEffect } from 'react';
import { 
  Loader2, CheckCircle, ArrowRight, ShieldCheck, 
  CreditCard, Lock, Smartphone, Landmark, QrCode, 
  ExternalLink, Zap, Smartphone as PhoneIcon 
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
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('secure');
    }, 2000);
  };

  const handleConfirmSecure = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 1500);
    }, 1500);
  };

  const handleSbpClick = () => {
    setStep('processing');
    // Имитация открытия приложения банка или сканирования QR
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 1500);
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <CheckCircle className="text-white w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-slate-900 uppercase font-syne">ШАГ ОПЛАЧЕН</h3>
          <p className="text-slate-500 font-medium">Транзакция прошла успешно через СБП.</p>
        </div>
      </div>
    );
  }

  if (step === 'secure' && method === 'card') {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-4">
        <div className="bg-slate-50 border border-slate-200 p-10 rounded-[40px] text-center space-y-6">
           <Smartphone className="w-16 h-16 text-indigo-600 mx-auto" />
           <div className="space-y-2">
             <h3 className="text-xl font-black text-slate-900 uppercase">3D-Secure Подтверждение</h3>
             <p className="text-xs text-slate-500 font-bold leading-relaxed">Мы отправили код в SMS на ваш номер телефона для подтверждения списания {amount} ₽</p>
           </div>
           <input type="text" placeholder="0 0 0 0" className="w-full bg-white border-2 border-slate-200 p-6 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-indigo-600" />
           <button onClick={handleConfirmSecure} className="w-full bg-indigo-600 text-white py-6 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl">Подтвердить</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-2">
         <img src="https://yookassa.ru/wp-content/uploads/2020/09/YooKassa_logo_ru.svg" className="h-6 opacity-80" alt="ЮKassa" />
         <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Secure Checkout
         </div>
      </header>

      {/* Tabs Selection */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button 
          onClick={() => setMethod('sbp')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'sbp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Zap className={`w-3.5 h-3.5 ${method === 'sbp' ? 'text-pink-500' : 'text-slate-400'}`} /> СБП
        </button>
        <button 
          onClick={() => setMethod('card')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <CreditCard className={`w-3.5 h-3.5 ${method === 'card' ? 'text-indigo-600' : 'text-slate-400'}`} /> Карта
        </button>
      </div>

      <div className="bg-[#121214] p-8 rounded-[40px] text-white space-y-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           {method === 'sbp' ? <QrCode className="w-32 h-32" /> : <Landmark className="w-32 h-32" />}
        </div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">К оплате за ШАГ</span>
          <p className="text-5xl font-black font-syne">{amount} <span className="text-xl opacity-40">₽</span></p>
        </div>
      </div>

      {method === 'sbp' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative bg-white p-4 rounded-3xl border-2 border-slate-100">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                    className="w-48 h-48 opacity-90" 
                    alt="SBP QR Code" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="bg-white p-2 rounded-xl shadow-xl">
                        <img src="https://sbp.nspk.ru/assets/img/logo.svg" className="h-6" alt="SBP" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-black text-slate-900 uppercase">Сканируйте QR-код</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[220px]">Откройте приложение вашего банка и наведите камеру на код</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Или выберите банк для оплаты</p>
            <div className="grid grid-cols-3 gap-3">
               {['Т-Банк', 'Сбер', 'Альфа'].map(bank => (
                 <button 
                   key={bank}
                   onClick={handleSbpClick}
                   className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-600 transition-all group"
                 >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Landmark className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-slate-600">{bank}</span>
                 </button>
               ))}
            </div>
          </div>

          <button 
            onClick={handleSbpClick}
            disabled={step === 'processing'}
            className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 transition-all"
          >
            {step === 'processing' ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Я ОПЛАТИЛ В БАНКЕ <CheckCircle className="w-5 h-5" /></>}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-6">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Номер карты</label>
                <div className="relative">
                   <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input 
                     value={cardNumber} 
                     onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                     maxLength={19}
                     placeholder="0000 0000 0000 0000" 
                     className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-14 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all" 
                   />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">ММ/ГГ</label>
                   <input 
                     value={expiry}
                     onChange={e => setExpiry(e.target.value)}
                     maxLength={5}
                     placeholder="12/26" 
                     className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all text-center" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">CVC</label>
                   <input 
                     value={cvc}
                     onChange={e => setCvc(e.target.value)}
                     maxLength={3}
                     type="password"
                     placeholder="•••" 
                     className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all text-center" 
                   />
                </div>
             </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={step === 'processing' || cardNumber.length < 16}
            className="w-full bg-indigo-600 text-white py-8 rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 transition-all"
          >
            {step === 'processing' ? <Loader2 className="w-6 h-6 animate-spin" /> : <>ОПЛАТИТЬ КАРТОЙ <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      )}

      <button onClick={onCancel} className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Вернуться назад</button>

      <div className="flex flex-col items-center gap-4 pt-4 opacity-40 border-t border-slate-100">
        <div className="flex items-center gap-6">
           <img src="https://sbp.nspk.ru/assets/img/logo.svg" className="h-4" alt="SBP" />
           <div className="w-px h-4 bg-slate-300" />
           <div className="flex gap-4 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-2" alt="Mir" />
           </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[7px] font-black uppercase tracking-widest">Безопасная оплата через ЮKassa (PCI DSS)</span>
        </div>
      </div>
    </div>
  );
};
