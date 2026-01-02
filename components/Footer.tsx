
import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, FileText, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const openLegal = (type: 'agreement' | 'offer') => {
    if (type === 'agreement') {
      setModalContent({
        title: 'Пользовательское соглашение',
        text: 'Настоящее Соглашение определяет условия использования сервиса "ШАГ". Пользователь обязуется использовать сервис исключительно в законных целях. Администрация не несет ответственности за содержание личных консультаций менторов. Весь энергообмен и финансовые транзакции осуществляются согласно правилам платформы. Настоящим вы соглашаетесь на обработку персональных данных для обеспечения работы сервиса.'
      });
    } else {
      setModalContent({
        title: 'Публичная оферта',
        text: 'Данный документ является публичным предложением (офертой) об оказании информационных услуг. Оплата услуг (ШАГов) является акцептом данной оферты. Сервис предоставляет доступ к базе данных наставников и миссий. Возврат средств осуществляется в случае отмены встречи более чем за 24 часа до ее начала. Все платежи являются добровольными взносами в развитие экосистемы.'
      });
    }
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-24 md:pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand & Legal */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white font-syne uppercase">ШАГ</span>
            <span className="text-[9px] font-bold text-indigo-600 tracking-[0.2em] uppercase -mt-1">платформа энергообмена</span>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => openLegal('agreement')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <FileText size={12} /> Пользовательское соглашение
            </button>
            <button 
              onClick={() => openLegal('offer')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <ShieldCheck size={12} /> Публичная оферта
            </button>
          </div>
        </div>

        {/* Contacts */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Контакты</h4>
          <div className="space-y-4">
            <a href="tel:+79296754641" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone size={14} className="text-slate-500" />
              </div>
              <span className="text-sm font-bold">+7 (929) 675-46-41</span>
            </a>
            <a href="mailto:Vanstep@inbox.ru" className="flex items-center gap-3 text-white hover:text-indigo-400 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={14} className="text-slate-500" />
              </div>
              <span className="text-sm font-bold">Vanstep@inbox.ru</span>
            </a>
            <div className="flex items-center gap-3 text-white group">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                <MapPin size={14} className="text-slate-500" />
              </div>
              <span className="text-sm font-bold text-slate-300">г. Москва</span>
            </div>
          </div>
        </div>

        {/* Requisites */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Реквизиты</h4>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Самозанятый</p>
            <p className="text-sm font-bold text-white uppercase font-syne">Степанов Иван Артемович</p>
            <p className="text-[11px] font-medium text-slate-500">ИНН: 771551514336</p>
            <div className="pt-4">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none block">ШАГ © 2024. Все права защищены.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-[48px] p-10 md:p-14 relative animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setModalContent(null)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-all">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black text-white uppercase font-syne mb-8 tracking-tighter leading-none">{modalContent.title}</h3>
            <div className="max-h-[60vh] overflow-y-auto pr-4 no-scrollbar">
              <p className="text-slate-400 text-base leading-relaxed whitespace-pre-line font-medium italic">
                {modalContent.text}
              </p>
            </div>
            <button onClick={() => setModalContent(null)} className="w-full mt-10 bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest">Понятно</button>
          </div>
        </div>
      )}
    </footer>
  );
};
