
import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers, Clock, DollarSign, Edit3, Camera, Video, Calendar as CalendarIcon, X, Globe, MapPin, Users as UsersIcon, ChevronDown, User, AlertCircle, Zap, LayoutGrid, Sparkles } from 'lucide-react';
import { Service, MeetingFormat } from '../types';
import { SlotCalendar } from './SlotCalendar';
import { INDUSTRIES } from '../constants';
import { ServiceCard } from './ServiceCard';

interface ServiceBuilderProps {
  services: Service[];
  onSave: (service: Partial<Service>) => void;
  onUpdate?: (id: string, updates: Partial<Service>) => void;
  onDelete: (id: string) => void;
}

export const ServiceBuilder: React.FC<ServiceBuilderProps> = ({ services, onSave, onUpdate, onDelete }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: 1500,
    groupPrice: 0,
    maxParticipants: 1,
    format: MeetingFormat.ONLINE_1_ON_1,
    duration: '60 мин',
    category: INDUSTRIES[1],
    imageUrl: '',
    videoUrl: '',
    slots: '{}'
  });

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({ ...service });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        price: 1500,
        groupPrice: 0,
        maxParticipants: 1,
        format: MeetingFormat.ONLINE_1_ON_1,
        duration: '60 мин',
        category: INDUSTRIES[1],
        imageUrl: '',
        videoUrl: '',
        slots: '{}'
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      alert("Пожалуйста, заполните основные поля");
      return;
    }
    if (editingId && onUpdate) {
      onUpdate(editingId, formData);
    } else {
      onSave(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-12 md:space-y-20 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-500">
             <LayoutGrid size={16} />
          </div>
          <h3 className="text-2xl md:text-5xl font-black text-white uppercase font-syne tracking-tighter">ВАШИ ШАГи В ВИТРИНЕ</h3>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="w-full md:w-auto bg-white text-black px-10 py-6 rounded-2xl md:rounded-[32px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            ДОБАВИТЬ ШАГ
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[120] bg-[#0d0d0f] md:relative md:inset-auto md:bg-[#1a1d23] p-5 md:p-12 rounded-none md:rounded-[48px] border-none md:border border-white/10 shadow-3xl overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-500">
          <div className="max-w-7xl mx-auto space-y-12 pb-32 md:pb-0">
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-10 sticky top-0 bg-[#0d0d0f] md:bg-transparent z-10 pt-4 md:pt-0">
              <div className="space-y-1">
                 <h3 className="text-xl md:text-3xl font-black text-white uppercase font-syne">
                   {editingId ? 'РЕДАКТИРОВАНИЕ' : 'НОВЫЙ ШАГ'}
                 </h3>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">РЕДАКТИРОВАНИЕ_АКТИВНО</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-20">
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 font-syne">ЗАГОЛОВОК ШАГА</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Напр: Личный разбор маркетинга" className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white outline-none focus:border-indigo-500 transition-all font-black text-lg md:text-2xl uppercase font-syne" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 font-syne">НИША</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-[24px] text-white outline-none focus:border-indigo-500 font-bold appearance-none cursor-pointer text-sm"
                      >
                        {INDUSTRIES.filter(i => i !== 'Все').map(cat => (
                          <option key={cat} value={cat} className="bg-[#0a0a0b]">{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 font-syne">ФОРМАТ</label>
                    <div className="relative">
                      <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value as MeetingFormat})} className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-[24px] text-white outline-none focus:border-indigo-500 font-bold appearance-none cursor-pointer text-sm">
                        {Object.values(MeetingFormat).map(f => (<option key={f} value={f} className="bg-[#0a0a0b] text-white">{f}</option>))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 font-syne">СТОИМОСТЬ ЭНЕРГООБМЕНА (₽)</label>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/[0.03] p-6 rounded-[24px] border border-white/10 space-y-2">
                         <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Индивидуально</span>
                         <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-transparent text-2xl font-black text-white outline-none" />
                      </div>
                      <div className="bg-white/[0.03] p-6 rounded-[24px] border border-white/10 space-y-2">
                         <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Групповой</span>
                         <input type="number" value={formData.groupPrice} onChange={e => setFormData({...formData, groupPrice: Number(e.target.value)})} className="w-full bg-transparent text-2xl font-black text-white outline-none" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 font-syne">ОПИСАНИЕ ЦЕННОСТИ</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Что получит участник после вашего ШАГа?" className="w-full bg-white/[0.03] border border-white/10 p-8 rounded-[32px] text-white outline-none focus:border-indigo-500 transition-all font-medium h-48 md:h-64 resize-none text-base leading-relaxed break-words" />
                </div>
              </div>

              <div className="space-y-8 flex flex-col h-full">
                <div className="flex items-center gap-4 px-2">
                  <CalendarIcon className="w-6 h-6 text-indigo-500" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest font-syne">ИНДИВИДУАЛЬНЫЙ ГРАФИК</label>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Настройте доступные слоты для этого ШАГа</p>
                  </div>
                </div>
                <div className="flex-1 bg-white/[0.02] rounded-[48px] border border-white/5 p-4 md:p-8">
                  <SlotCalendar selectedSlots={JSON.parse(formData.slots || '{}')} onChange={s => setFormData({...formData, slots: JSON.stringify(s)})} accentColor="indigo" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-12 md:pt-16 border-t border-white/5">
              <button onClick={() => setIsFormOpen(false)} className="order-2 md:order-1 flex-1 py-6 rounded-[24px] font-black uppercase text-[11px] tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">ОТМЕНА</button>
              <button onClick={handleSave} className="order-1 md:order-2 flex-[2] bg-white text-black py-7 rounded-[28px] md:rounded-[32px] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all">
                <Save className="w-6 h-6" /> {editingId ? 'СОХРАНИТЬ' : 'ОПУБЛИКОВАТЬ В ВИТРИНЕ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14 px-2">
        {services.length === 0 && !isFormOpen && (
          <div className="col-span-full py-24 md:py-40 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] md:rounded-[80px] flex flex-col items-center justify-center text-center space-y-8 px-6 backdrop-blur-sm">
            <div className="relative">
               <LayoutGrid size={80} className="text-white opacity-[0.03]" />
               <Sparkles className="absolute -top-4 -right-4 text-indigo-500/40 animate-pulse w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-black text-2xl md:text-5xl uppercase font-syne tracking-tighter">ВИТРИНА ПУСТА</h3>
              <p className="text-slate-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] max-w-sm mx-auto">Время добавить ваш первый ШАГ и заявить о себе сообществу</p>
            </div>
            <button 
              onClick={() => handleOpenForm()}
              className="px-10 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
            >
              СОЗДАТЬ ПЕРВЫЙ ШАГ
            </button>
          </div>
        )}
        
        {services.map(service => (
          <div key={service.id} className="relative group/card animate-in fade-in slide-in-from-bottom-12 duration-700">
             {/* Admin Controls Overlay */}
             <div className="absolute top-6 right-6 z-30 flex gap-2 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                <button 
                  onClick={() => handleOpenForm(service)}
                  className="w-12 h-12 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center hover:bg-indigo-50 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(service.id)}
                  className="w-12 h-12 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
             </div>

             {/* Using the standard ServiceCard for visual consistency in the Showcase */}
             <div className="h-full border border-white/5 rounded-[40px] group-hover/card:border-indigo-500/30 transition-all duration-500">
                <ServiceCard service={service} onClick={() => handleOpenForm(service)} />
             </div>
             
             {/* Hint for editing */}
             <div className="absolute inset-x-0 -bottom-8 flex justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Нажмите для редактирования</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
