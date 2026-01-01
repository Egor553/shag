
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
    category: 'Консультация',
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
        category: 'Консультация',
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

  const isGroupFormat = formData.maxParticipants && formData.maxParticipants > 1;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">ВИТРИНА ШАГОВ</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Создавайте продукты и масштабируйте опыт</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Добавить услугу
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0a0a0b] p-8 md:p-12 rounded-[40px] border border-white/10 shadow-3xl animate-in zoom-in-95 duration-500 space-y-10 relative max-w-7xl mx-auto">
          <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>

          {editingId && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[24px] flex items-center gap-4 text-amber-500 animate-in slide-in-from-top-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest">Режим редактирования</p>
                 <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-relaxed">
                   Ваше текущее расписание (даты и время) сохранено. Вы можете изменить данные услуги, не теряя привязанные слоты.
                 </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Базовые данные */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Название ШАГа</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Бизнес-разбор или Групповой мастер-майнд"
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Тип встречи</label>
                  <div className="relative">
                    <select 
                      value={formData.format}
                      onChange={e => setFormData({...formData, format: e.target.value as MeetingFormat})}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold appearance-none cursor-pointer pr-12"
                    >
                      {Object.values(MeetingFormat).map(f => (
                        <option key={f} value={f} className="bg-[#0a0a0b] text-white">{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Длительность</label>
                  <input 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="60 мин"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold text-center"
                  />
                </div>
              </div>

              {/* Настройка Группы */}
              <div className="bg-indigo-600/5 p-8 rounded-[32px] border border-indigo-500/10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <UsersIcon className="text-indigo-500 w-5 h-5" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-white">Групповой формат</h4>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-500 uppercase">Макс. человек:</span>
                       <input 
                         type="number"
                         value={formData.maxParticipants}
                         onChange={e => setFormData({...formData, maxParticipants: Number(e.target.value)})}
                         className="w-16 bg-white/10 border border-white/10 p-2 rounded-lg text-white font-black text-center outline-none focus:border-indigo-500"
                       />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Цена Соло (₽)</label>
                       <input 
                         type="number"
                         value={formData.price}
                         onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                         className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Цена Группа (₽)</label>
                       <input 
                         type="number"
                         value={formData.groupPrice}
                         onChange={e => setFormData({...formData, groupPrice: Number(e.target.value)})}
                         placeholder="0"
                         className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-bold"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Что получит участник?</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Опишите ценность вашего ШАГа..."
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-medium h-32 resize-none"
                />
              </div>
            </div>

            {/* Расписание */}
            <div className="space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-3 px-2">
                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                <label className="text-[10px] font-black text-white uppercase tracking-widest">Доступное время для записи</label>
              </div>
              <div className="flex-1">
                <SlotCalendar 
                  selectedSlots={JSON.parse(formData.slots || '{}')} 
                  onChange={s => setFormData({...formData, slots: JSON.stringify(s)})}
                  accentColor="indigo"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
            <button onClick={() => setIsFormOpen(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all">Отмена</button>
            <button onClick={handleSave} className="flex-[2] bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Save className="w-5 h-5" /> {editingId ? 'Сохранить изменения' : 'Создать ШАГ'}
            </button>
          </div>
        </div>
      )}

      {/* Список услуг */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.length === 0 && !isFormOpen && (
          <div className="md:col-span-2 py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px] flex flex-col items-center justify-center text-center space-y-6">
            <Layers className="w-20 h-20 text-white/10" />
            <div className="space-y-2">
              <p className="text-white font-black text-2xl uppercase font-syne">Ваша витрина пока пуста</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Создайте вашу первую услугу, чтобы начать принимать запросы на ШАГи.</p>
            </div>
            <button onClick={() => handleOpenForm()} className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-400 transition-colors">Добавить первый ШАГ</button>
          </div>
        )}
        
        {services.map(service => (
          <div key={service.id} className="bg-[#0a0a0b] rounded-[40px] border border-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col shadow-2xl">
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-400">
                       <Zap className="w-3 h-3 fill-current" />
                       <span className="text-[8px] font-black uppercase tracking-widest">{service.category || 'Консультация'}</span>
                    </div>
                    <h4 className="text-2xl font-black text-white leading-tight uppercase font-syne">{service.title}</h4>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleOpenForm(service)} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all"><Edit3 className="w-4 h-4"/></button>
                    <button onClick={() => onDelete(service.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4"/></button>
                 </div>
              </div>

              <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 italic">«{service.description}»</p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex gap-6">
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Индивидуально</span>
                    <p className="text-xl font-black text-white">{service.price} ₽</p>
                  </div>
                  {service.groupPrice ? (
                    <div className="space-y-0.5">
                      <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Группа ({service.maxParticipants})</span>
                      <p className="text-xl font-black text-emerald-500">{service.groupPrice} ₽</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] font-black uppercase">{service.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
