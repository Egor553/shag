
import React, { useState } from 'react';
import { UserSession } from '../../types';
import { 
  Sparkles, User, Calendar, MapPin, Phone, Mail, 
  Camera, Link as LinkIcon, LogOut, Zap
} from 'lucide-react';

interface YouthProfileProps {
  session: UserSession;
  onCatalogClick: () => void;
  onLogout: () => void;
  onUpdateAvatar: (url: string) => void;
}

export const YouthProfile: React.FC<YouthProfileProps> = ({ 
  session, 
  onCatalogClick, 
  onLogout,
  onUpdateAvatar
}) => {
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(session?.paymentUrl || '');

  const personalInfo = [
    { label: 'Имя Фамилия', value: session?.name, icon: User },
    { label: 'Дата рождения', value: session?.birthDate, icon: Calendar },
    { label: 'Город', value: session?.city, icon: MapPin },
    { label: 'Номер телефона', value: session?.phone, icon: Phone },
    { label: 'Почта', value: session?.email, icon: Mail },
  ];

  const handleAvatarSubmit = () => {
    onUpdateAvatar(tempPhotoUrl);
    setShowPhotoInput(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="bg-white p-10 md:p-14 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden h-full">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-14 pb-12 border-b border-slate-50">
            <div className="relative group shrink-0">
              <div className="w-44 h-44 bg-slate-900 rounded-[52px] overflow-hidden border-8 border-white shadow-2xl relative transition-all duration-500 group-hover:scale-105">
                {session?.paymentUrl ? (
                  <img src={session.paymentUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-7xl font-black">
                    {session?.name ? session.name[0] : 'U'}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-4 rounded-2xl shadow-xl hover:bg-violet-700 transition-all z-10 hover:scale-110"
              >
                <Camera className="w-6 h-6" />
              </button>
              
              {showPhotoInput && (
                <div className="absolute top-full mt-4 left-0 w-72 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 z-20 animate-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ссылка на фотографию</p>
                  <div className="flex gap-2">
                    <input 
                      value={tempPhotoUrl}
                      onChange={(e) => setTempPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 p-3 rounded-xl text-xs outline-none focus:ring-2 ring-violet-500 font-bold"
                    />
                    <button onClick={handleAvatarSubmit} className="bg-violet-600 text-white p-3 rounded-xl hover:bg-violet-700">
                      <LinkIcon className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-5 py-2 bg-violet-50 text-violet-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Молодой Талант
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                {session?.name}
              </h3>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors mx-auto md:mx-0 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Выйти
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {personalInfo.map((item, idx) => (
              <div key={idx} className="space-y-2 group">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-violet-500 transition-colors">
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900 pl-6 border-l-2 border-transparent group-hover:border-violet-500 transition-all">
                  {item.value || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="bg-violet-600 p-12 rounded-[56px] shadow-3xl text-white space-y-8 relative overflow-hidden group h-full">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Sparkles className="w-40 h-40" /></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-4 bg-white/20 rounded-3xl"><Sparkles className="w-8 h-8"/></div>
            <h4 className="text-3xl font-black">Время ШАГа</h4>
          </div>
          <p className="font-medium text-violet-100 text-lg leading-relaxed relative z-10">
            Выбирай наставников, перенимай опыт и масштабируй свои результаты прямо сейчас!
          </p>
          <button 
            onClick={onCatalogClick} 
            className="w-full bg-white text-violet-600 py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10"
          >
            К наставникам
          </button>
        </div>
      </div>
    </div>
  );
};
