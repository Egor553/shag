
import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers, Clock, DollarSign, Type, Edit3, Camera, Video, Calendar as CalendarIcon, X, Globe, MapPin, Users as UsersIcon, ChevronDown } from 'lucide-react';
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
    groupPrice: 800,
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
        groupPrice: 800,
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

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">ВИТРИНА ШАГОВ</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Управляйте вашими продуктами</p>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Левая колонка - Базовые данные */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Название ШАГа</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Стратегический разбор вашего бизнеса"
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Формат</label>
                  <div className="relative">
                    <select 
                      value={formData.format}
                      onChange={e => setFormData({...formData, format: e.target.value as MeetingFormat})}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold appearance-none cursor-pointer pr-12"
                    >
                      {Object.values(MeetingFormat).map(f => (
                        <option key={f} value={f} className="bg-[#0a0a0b]">{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Категория / Длительность</label>
                  <div className="flex gap-3">
                    <input 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      placeholder="Маркетинг"
                      className="flex-[2] min-w-0 bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold text-xs"
                    />
                    <input 
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      placeholder="60 мин"
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold text-xs text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Описание результата</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Опишите, что именно получит участник после этой встречи..."
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-medium h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Цена 1-на-1 (₽)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Цена группа (₽)</label>
                  <div className="relative">
                    <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="number"
                      value={formData.groupPrice}
                      onChange={e => setFormData({...formData, groupPrice: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-5 rounded-2xl text-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Медиа: Фото (URL)</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      value={formData.imageUrl}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-5 rounded-2xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Медиа: Видео (URL)</label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      value={formData.videoUrl}
                      onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="Youtube link..."
                      className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-5 rounded-2xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Расписание этой услуги */}
            <div className="space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-3 px-2">
                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                <label className="text-[10px] font-black text-white uppercase tracking-widest">Индивидуальное расписание услуги</label>
              </div>
              <div className="flex-1">
                <SlotCalendar 
                  selectedSlots={JSON.parse(formData.slots || '{}')} 
                  onChange={s => setFormData({...formData, slots: JSON.stringify(s)})}
                  accentColor="indigo"
                />
              </div>
              <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">Внимание: это расписание привязано только к текущей услуге. Участники увидят его при бронировании именно этого продукта.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
            <button onClick={() => setIsFormOpen(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5 transition-all">Отмена</button>
            <button onClick={handleSave} className="flex-[2] bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Save className="w-5 h-5" /> {editingId ? 'Обновить продукт' : 'Создать продукт'}
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
              <p className="text-white font-black text-2xl uppercase font-syne">Витрина пуста</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Создайте вашу первую услугу, чтобы начать принимать запросы на ШАГи.</p>
            </div>
            <button onClick={() => handleOpenForm()} className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-400 transition-colors">Добавить первый ШАГ</button>
          </div>
        )}
        
        {services.map(service => (
          <div key={service.id} className="bg-[#0a0a0b] rounded-[40px] border border-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col shadow-2xl">
            {/* Превью фото услуги */}
            <div className="h-48 relative overflow-hidden bg-slate-900">
               {service.imageUrl ? (
                 <img src={service.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl font-syne">ШАГ</div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               <div className="absolute top-5 right-5 flex gap-2">
                  <button onClick={() => handleOpenForm(service)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all shadow-lg"><Edit3 className="w-4 h-4"/></button>
                  <button onClick={() => onDelete(service.id)} className="p-3 bg-red-500/10 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500/20 transition-all shadow-lg"><Trash2 className="w-4 h-4"/></button>
               </div>
               <div className="absolute bottom-5 left-5 flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{service.category}</span>
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">{service.duration}</span>
               </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                   {service.format === MeetingFormat.ONLINE_1_ON_1 ? <Globe className="w-3 h-3" /> : (service.format === MeetingFormat.GROUP_OFFLINE ? <UsersIcon className="w-3 h-3" /> : <MapPin className="w-3 h-3" />)}
                   <span className="text-[8px] font-black uppercase tracking-widest">{service.format}</span>
                </div>
                <h4 className="text-2xl font-black text-white leading-tight uppercase font-syne">{service.title}</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">{service.description}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Лично / Группа</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{service.price}</span>
                    <span className="text-slate-500 text-sm">/</span>
                    <span className="text-lg font-black text-indigo-400">{service.groupPrice || '—'}</span>
                    <span className="text-[10px] font-bold text-slate-600">₽</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 ${Object.keys(JSON.parse(service.slots || '{}')).length > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
