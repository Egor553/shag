
import React, { useState } from 'react';
import { Job, UserRole, UserSession } from '../../types';
import { 
  Rocket, Briefcase, Plus, X, Trash2, 
  ArrowRight, Zap, DollarSign, Send
} from 'lucide-react';

// Added missing JobsViewProps interface
interface JobsViewProps {
  jobs: Job[];
  session: UserSession;
  onSaveJob: (job: Partial<Job>) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const JobsView: React.FC<JobsViewProps> = ({ jobs, session, onSaveJob, onDeleteJob }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Инициализируем форму, пытаясь подтянуть контакт из профиля если он есть
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    reward: '',
    category: 'Маркетинг',
    telegram: session.phone || '', 
    deadline: ''
  });

  const isEnt = session.role === UserRole.ENTREPRENEUR;

  const handleOpenForm = () => {
    setFormData({
      title: '',
      description: '',
      reward: '',
      category: 'Маркетинг',
      telegram: formData.telegram || session.phone || '',
      deadline: ''
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    const trimmedTg = String(formData.telegram || '').trim();
    if (!formData.title || !formData.description || !trimmedTg || isSubmitting) {
      alert("Пожалуйста, заполните заголовок, описание и Telegram для связи");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSaveJob({
        ...formData,
        telegram: trimmedTg,
        mentorId: session.id || session.email,
        mentorName: session.name,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      setIsFormOpen(false);
      setFormData({ ...formData, title: '', description: '', reward: '', deadline: '' });
    } catch (e) {
      console.error("Failed to save job", e);
      alert("Ошибка при создании вакансии");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 md:space-y-24 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-violet-500" />
            <span className="text-violet-500 font-bold text-[9px] uppercase tracking-[0.4em]">Work & Projects</span>
          </div>
          <h1 className="text-[12vw] sm:text-7xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.9] uppercase font-syne">
            ПОДРАБОТКА<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">ВАКАНСИИ</span>
          </h1>
        </div>
        {isEnt && !isFormOpen && (
          <button onClick={handleOpenForm} className="bg-white text-black px-10 py-6 rounded-[32px] font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-2xl active:scale-95">
            <Plus className="w-5 h-5" /> Создать вакансию
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0a0a0b] p-8 md:p-16 rounded-[48px] border border-white/10 shadow-3xl animate-in zoom-in-95 duration-500 relative">
          <button onClick={() => setIsFormOpen(false)} className="absolute top-10 right-10 p-2 text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Заголовок вакансии</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="СДЕЛАТЬ АНАЛИЗ КОНКУРЕНТОВ..." className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold" />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Ваш Telegram (для связи)</label>
                  <div className="relative">
                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} placeholder="@username" className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold" />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Описание задач</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="ЧЕТКОЕ ТЗ..." className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-medium h-48 resize-none" />
               </div>
            </div>
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Вознаграждение</label>
                  <div className="relative">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                     <input value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} placeholder="10.000 ₽" className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold" />
                  </div>
               </div>
               <div className="pt-10 border-t border-white/5 flex gap-4">
                  <button onClick={() => setIsFormOpen(false)} className="flex-1 py-6 rounded-2xl font-black uppercase text-[10px] text-slate-500">Отмена</button>
                  <button onClick={handleSave} className="flex-[2] bg-violet-600 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                    {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {jobs.map((job) => {
          const isMyJob = String(job.mentorId) === String(session.id) || String(job.mentorId).toLowerCase() === String(session.email).toLowerCase();
          const jobTelegram = job.telegram ? String(job.telegram).trim() : '';
          const hasTg = jobTelegram.length > 0;
          
          return (
            <div key={job.id} onClick={() => setSelectedJob(job)} className={`bg-[#0a0a0b] border p-8 rounded-[40px] flex flex-col h-full group transition-all duration-500 cursor-pointer ${isMyJob ? 'border-indigo-500/40' : 'border-white/5 hover:border-violet-500/50'}`}>
              <div className="flex justify-between mb-8">
                <div className="px-4 py-2 bg-violet-500/10 text-violet-500 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit">{job.category}</div>
                <div className="flex gap-2">
                  {isMyJob && (
                    <button onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id); }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                  )}
                  {hasTg && (
                    <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-violet-400 transition-colors">
                      <Send className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight uppercase font-syne mb-4">{job.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 italic">«{job.description}»</p>
              
              <div className="mb-6 mt-auto">
                {hasTg ? (
                  <div className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/5 p-3 rounded-xl border border-violet-500/10">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>TG: {jobTelegram}</span>
                  </div>
                ) : (
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest p-3 bg-white/5 rounded-xl">Контакты скрыты</div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                 <p className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[150px]">{job.mentorName}</p>
                 <div className="flex items-center gap-2 text-violet-400">
                    <span className="text-xs font-black uppercase">{job.reward}</span>
                    <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-[#0a0a0b] w-full max-w-xl rounded-[48px] border border-white/10 shadow-3xl p-10 relative overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white"><X className="w-8 h-8"/></button>
            <div className="space-y-10">
               <div className="space-y-2">
                 <div className="px-4 py-2 bg-violet-500/10 text-violet-500 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit mb-4">{selectedJob.category}</div>
                 <h2 className="text-4xl font-black text-white uppercase font-syne leading-none">{selectedJob.title}</h2>
               </div>
               <div className="p-8 bg-white/[0.03] rounded-[32px] border border-white/5">
                  <p className="text-slate-300 font-medium leading-relaxed italic">«{selectedJob.description}»</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/[0.02] rounded-3xl">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Награда</span>
                    <p className="text-xl font-black text-white">{selectedJob.reward || 'Не указана'}</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] rounded-3xl">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Telegram</span>
                    <p className="text-xl font-black text-violet-400">{selectedJob.telegram || 'Не указан'}</p>
                  </div>
               </div>
               {selectedJob.telegram && (
                 <button 
                  onClick={() => {
                    const cleanUsername = String(selectedJob.telegram).replace('@', '').trim();
                    window.open(`https://t.me/${cleanUsername}`, '_blank');
                  }} 
                  className="w-full bg-violet-600 text-white py-6 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   <Send className="w-5 h-5" /> Написать в Telegram
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
