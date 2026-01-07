
import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, ChevronRight, CheckCircle2, Loader2, Landmark } from 'lucide-react';

export const YooKassaSimulation: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get('mock_pay_id');
  const amount = params.get('amount');
  const desc = params.get('desc');

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      // Обновляем статус в реестре
      const reg = JSON.parse(sessionStorage.getItem('shag_mock_payments') || '{}');
      reg[paymentId!] = 'succeeded';
      sessionStorage.setItem('shag_mock_payments', JSON.stringify(reg));
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[32px] p-12 text-center space-y-8 shadow-2xl border border-emerald-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900">ОПЛАТА ПРОШЛА</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Деньги успешно зачислены в фонд энергообмена ШАГ. Теперь вы можете вернуться в приложение и подтвердить встречу.
            </p>
          </div>
          <button 
            onClick={() => window.close()} 
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
          >
            Закрыть это окно
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter">ЮKassa</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Тестовый шлюз ШАГ</span>
          </div>
          <Landmark size={24} className="text-slate-400" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-10">
          <div className="flex justify-between items-end pb-8 border-b border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">К оплате</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{Number(amount).toLocaleString()} ₽</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Заказ</p>
              <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{desc}</p>
            </div>
          </div>

          {step === 'form' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-5">
                <div className="relative">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    defaultValue="4242 4242 4242 4242" 
                    className="w-full bg-slate-50 border border-slate-200 p-5 pl-14 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-500" 
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input defaultValue="12/26" className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-slate-900 font-bold outline-none text-center" placeholder="ММ/ГГ" />
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input defaultValue="***" type="password" className="w-full bg-slate-50 border border-slate-200 p-5 pl-12 rounded-2xl text-slate-900 font-bold outline-none text-center" placeholder="CVC" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePay}
                className="w-full bg-indigo-600 text-white p-7 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Оплатить {Number(amount).toLocaleString()} ₽ <ChevronRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Безопасное соединение TLS 1.3
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-300">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-900">ПРОВЕРКА ДАННЫХ</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Авторизация в вашем банке...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex justify-center gap-6 grayscale opacity-50">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-6" alt="Mir" />
        </div>
      </div>
    </div>
  );
};
