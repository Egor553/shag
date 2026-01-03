
import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers, Clock, DollarSign, Edit3, Camera, Video, Calendar as CalendarIcon, X, Globe, MapPin, Users as UsersIcon, ChevronDown, User, AlertCircle, Zap } from 'lucide-react';
import { Service, MeetingFormat } from '../types';
import { SlotCalendar } from './SlotCalendar';

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
    category: 'Бизнес',
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
        category: 'Бизнес',
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
    <div className="space-y-6 md:space-y-10 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="space-y-0.5 md:space-y-1 text-center sm:text-left">
          <h3 className="text-xl md:text-3xl font-black text-white uppercase font-syne tracking-tighter">МОИ ШАГи</h3>
          <p className="text-slate-500 text-[8px] md:text-xs font-bold uppercase tracking-widest italic">Масштабируйте ваш опыт</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="w-full sm:w-auto bg-indigo-600 text-white p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all shadow-xl active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> Добавить ШАГ
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[120] bg-[#0d0d0f] md:relative md:inset-auto md:bg-[#0a0a0b] p-5 md:p-12 rounded-none md:rounded-[40px] border-none md:border border-white/10 shadow-3xl overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 pb-32 md:pb-0">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 mb-6 sticky top-0 bg-[#0d0d0f] md:bg-transparent z-10 pt-4 md:pt-0">
              <h3 className="text-lg md:text-xl font-black text-white uppercase font-syne">
                {editingId ? 'Изменить услугу' : 'Новая услуга'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 md:p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-12">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Название</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Напр: Бизнес-разбор 1 на 1" className="w-full bg-white/5 border border-white/10 p-5 md:p-5 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold text-sm" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Формат</label>
                    <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value as MeetingFormat})} className="w-full bg-white/5 border border-white/10 p-5 md:p-5 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 font-bold appearance-none cursor-pointer pr-10 text-sm">
                      {Object.values(MeetingFormat).map(f => (<option key={f} value={f} className="bg-[#0a0a0b] text-white">{f}</option>))}
                    </select>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Длительность</label>
                    <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="60 мин" className="w-full bg-white/5 border border-white/10 p-5 md:p-5 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 font-bold text-sm" />
                  </div>
                </div>

                <div className="bg-white/5 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 space-y-4 md:space-y-6">
                   <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 px-1">Стоимость энергообмена</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                         <label className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Соло (₽)</label>
                         <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                         <label className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Группа (₽)</label>
                         <input type="number" value={formData.groupPrice} onChange={e => setFormData({...formData, groupPrice: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white font-bold text-sm" />
                      </div>
                   </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Описание ценности</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Что получит участник после вашего ШАГа?" className="w-full bg-white/5 border border-white/10 p-5 md:p-5 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-medium h-32 md:h-48 resize-none text-sm leading-relaxed" />
                </div>
              </div>

              <div className="space-y-4 md:space-y-6 flex flex-col h-full">
                <div className="flex items-center gap-3 px-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-500" />
                  <label className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Индивидуальный график</label>
                </div>
                <div className="flex-1 overflow-x-hidden md:scale-100">
                  <SlotCalendar selectedSlots={JSON.parse(formData.slots || '{}')} onChange={s => setFormData({...formData, slots: JSON.stringify(s)})} accentColor="indigo" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-8 md:pt-10">
              <button onClick={() => setIsFormOpen(false)} className="order-2 md:order-1 flex-1 py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all">Отмена</button>
              <button onClick={handleSave} className="order-1 md:order-2 flex-[2] bg-white text-black py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Save className="w-5 h-5" /> {editingId ? 'Сохранить изменения' : 'Опубликовать ШАГ'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {services.length === 0 && !isFormOpen && (
          <div className="md:col-span-2 py-16 md:py-20 bg-white/[0.04] border border-dashed border-white/20 rounded-[32px] md:rounded-[48px] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 px-6">
            <Layers className="w-12 h-12 md:w-16 md:h-16 text-white/10" />
            <div className="space-y-1 md:space-y-2">
              <p className="text-white font-black text-lg md:text-2xl uppercase font-syne">Список пуст</p>
              <p className="text-slate-500 text-[8px] md:text-xs uppercase tracking-widest">Добавьте ваш первый ШАГ в витрину</p>
            </div>
          </div>
        )}
        
        {services.map(service => (
          <div key={service.id} className="bg-white/[0.06] rounded-[32px] md:rounded-[40px] border border-white/10 overflow-hidden group hover:border-indigo-500/50 transition-all flex flex-col shadow-xl">
            <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between">
                 <div className="space-y-0.5 md:space-y-1">
                    <div className="flex items-center gap-1.5 md:gap-2 text-indigo-400">
                       <Zap className="w-3 h-3 fill-current" />
                       <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">{service.category || 'Бизнес'}</span>
                    </div>
                    <h4 className="text-base md:text-2xl font-black text-white leading-tight uppercase font-syne truncate max-w-[200px] sm:max-w-none">{service.title}</h4>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleOpenForm(service)} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all"><Edit3 className="w-4 h-4"/></button>
                    <button onClick={() => onDelete(service.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4"/></button>
                 </div>
              </div>
              <p className="text-slate-400 text-[11px] md:text-sm italic line-clamp-2 leading-relaxed">«{service.description}»</p>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
                <div className="flex gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none block">Соло</span>
                    <p className="text-base md:text-xl font-black text-white">{service.price} ₽</p>
                  </div>
                  {service.groupPrice ? (
                    <div className="space-y-0.5">
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none block">Группа</span>
                      <p className="text-base md:text-xl font-black text-emerald-500">{service.groupPrice} ₽</p>
                    </div>
                  ) : null}
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-600 tracking-widest">{service.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
