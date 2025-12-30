
import React, { useState } from 'react';
import { Plus, Trash2, Save, Layers, Clock, DollarSign, Type } from 'lucide-react';
import { Service, MeetingFormat } from '../types';

interface ServiceBuilderProps {
  services: Service[];
  onSave: (service: Partial<Service>) => void;
  onDelete: (id: string) => void;
}

export const ServiceBuilder: React.FC<ServiceBuilderProps> = ({ services, onSave, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: 1500,
    format: MeetingFormat.ONLINE_1_ON_1,
    duration: '60 мин',
    category: 'Консультация'
  });

  const handleCreate = () => {
    if (!newService.title || !newService.description) return;
    onSave(newService);
    setIsAdding(false);
    setNewService({
      title: '',
      description: '',
      price: 1500,
      format: MeetingFormat.ONLINE_1_ON_1,
      duration: '60 мин',
      category: 'Консультация'
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Мои услуги</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Создать услугу
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[40px] border-2 border-indigo-100 shadow-2xl animate-in slide-in-from-top-4 duration-500 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Название услуги</label>
              <input 
                value={newService.title}
                onChange={e => setNewService({...newService, title: e.target.value})}
                placeholder="Например: Стратегическая сессия"
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Категория</label>
              <select 
                value={newService.category}
                onChange={e => setNewService({...newService, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none"
              >
                <option>Консультация</option>
                <option>Разбор бизнеса</option>
                <option>Менторство (месяц)</option>
                <option>Мастер-класс</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Описание (чему научите?)</label>
              <textarea 
                value={newService.description}
                onChange={e => setNewService({...newService, description: e.target.value})}
                placeholder="Подробно опишите, какой результат получит молодой талант..."
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium h-32"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Формат</label>
              <select 
                value={newService.format}
                onChange={e => setNewService({...newService, format: e.target.value as MeetingFormat})}
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none"
              >
                {Object.values(MeetingFormat).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Цена (₽)</label>
                <input 
                  type="number"
                  value={newService.price}
                  onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Длительность</label>
                <input 
                  value={newService.duration}
                  onChange={e => setNewService({...newService, duration: e.target.value})}
                  placeholder="60 мин"
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={() => setIsAdding(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Отмена</button>
            <button onClick={handleCreate} className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Сохранить услугу
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.length === 0 && !isAdding && (
          <div className="md:col-span-2 py-20 bg-white border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
            <Layers className="w-16 h-16 text-slate-200" />
            <p className="text-slate-400 font-bold text-lg">У вас еще нет созданных услуг</p>
            <button onClick={() => setIsAdding(true)} className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">Создать первую</button>
          </div>
        )}
        {services.map(service => (
          <div key={service.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl group hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">{service.category}</span>
              <button onClick={() => onDelete(service.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-3">{service.title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Стоимость</span>
                <span className="text-2xl font-black text-slate-900">{service.price} ₽</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block">Длительность</span>
                <span className="text-sm font-bold text-slate-600">{service.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
