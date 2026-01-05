
import React from 'react';
import { Globe, Users, Coffee, Video, Zap, ArrowRight } from 'lucide-react';

export const FormatsInfo: React.FC = () => {
  const formats = [
    {
      title: 'Онлайн 1 на 1',
      description: 'Подходит для любого уголка мира',
      longDescription: 'Идеальный формат для быстрой синхронизации и получения точечных советов вне зависимости от географии. Используем встроенную видеосвязь ШАГ.',
      icon: Globe,
      color: 'indigo'
    },
    {
      title: 'Офлайн 1 на 1',
      description: 'При нахождении в одном городе',
      longDescription: 'Личная встреча за кофе или в офисе ментора. Глубокое погружение, невербальное общение и максимальная концентрация на вашем запросе.',
      icon: Coffee,
      color: 'emerald'
    },
    {
      title: 'Групповой онлайн-созвон',
      description: 'Мастермайнд, разбор или обмен опытом',
      longDescription: 'Формат мастермайнда или дружеского диалога. Возможность услышать разборы других участников и получить объемное видение ситуации.',
      icon: Video,
      color: 'violet'
    },
    {
      title: 'Групповая встреча офлайн',
      description: 'Энергия коллектива и твёрдость ментора',
      longDescription: 'Самый мощный по накалу формат. Прямой обмен энергией молодого коллектива и фундаментальным опытом ментора в живом пространстве.',
      icon: Users,
      color: 'pink'
    }
  ];

  return (
    <div className="space-y-12 md:space-y-20">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-white/20" />
          <span className="text-white/40 font-black text-[9px] uppercase tracking-[0.4em]">Exchange Mechanics</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black text-white uppercase font-syne tracking-tighter leading-none">
          ФОРМАТЫ<br/><span className="text-indigo-500">ЭНЕРГООБМЕНА</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {formats.map((f, i) => (
          <div 
            key={i}
            className="group relative bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[40px] md:rounded-[56px] hover:border-white/20 transition-all duration-500 overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-${f.color}-500/10 blur-[80px] rounded-full group-hover:bg-${f.color}-500/20 transition-all duration-700`} />
            
            <div className="relative z-10 space-y-8">
              <div className={`w-16 h-16 bg-${f.color}-500/10 rounded-2xl flex items-center justify-center text-${f.color}-400 border border-${f.color}-500/20`}>
                <f.icon className="w-8 h-8" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase font-syne tracking-tight leading-none">
                  {f.title}
                </h3>
                <p className={`text-${f.color}-400 font-bold text-xs uppercase tracking-widest`}>
                  {f.description}
                </p>
              </div>

              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic">
                «{f.longDescription}»
              </p>
              
              <div className="pt-4 flex items-center gap-2 text-white/20 group-hover:text-white/60 transition-colors">
                 <Zap size={14} className="fill-current" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Ready for action</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
