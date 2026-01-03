
import React, { useState } from 'react';
import { Job, UserRole, UserSession } from '../../types';
import { 
  Rocket, Briefcase, Plus, X, Trash2, 
  ArrowRight, Zap, DollarSign, Send
} from 'lucide-react';

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
    <div className="space-y-8 md:space-y-24 animate-in fade-in duration-1000 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-4xl sm:text-7xl md:text-[8rem] font-black text-white tracking-tighter leading-[1.1] md:leading-[0.9] uppercase font-syne">
            ПОДРАБОТКА<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/30 to-white/5 italic">ВАКАНСИИ</span>
          </h1>
        </div>
        {isEnt && !isFormOpen && (
          <button onClick={handleOpenForm} className="bg-white text-black px-8 md:px-12 py-5 md:py-8 rounded-[24px] md:rounded-[40px] font-black uppercase text-[10px] md:text-[11px] tracking-widest flex items-center justify-center gap-3 md:gap-4 hover:scale-105 transition-all shadow-2xl active:scale-95">
            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Создать вакансию
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0a0a0b] p-6 md:p-16 rounded-[32px] md:rounded-[48px] border border-white/10 shadow-3xl animate-in zoom-in-95 duration-500 relative">
          <button onClick={() => setIsFormOpen(false)} className="absolute top-6 md:top-10 right-6 md:right-10 p-2 text-white/40 hover:text-white transition-colors z-10"><X className="w-6 md:w-7 md:h-7"/></button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
               <div className="space-y-2 md:space-y-3">
                  <label className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest px-2">Заголовок вакансии</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="СДЕЛАТЬ АНАЛИЗ КОНКУРЕНТОВ..." className="w-full bg-white/5 border border-white/15 p-4 md:p-6 rounded-xl md:rounded-2xl text-white outline-none focus:border-white/40 font-bold" />
               </div>
               <div className="space-y-2 md:space-y-3">
                  <label className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest px-2">Telegram (для связи)</label>
                  <div className="relative">
                    <Send className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40" />
                    <input value={formData.telegram} onChange={e => setFormData({...formData, telegram: e.target.value})} placeholder="@username" className="w-full bg-white/5 border border-white/15 pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-6 rounded-xl md:rounded-2xl text-white outline-none focus:border-white/40 font-bold" />
                  </div>
               </div>
               <div className="space-y-2 md:space-y-3">
                  <label className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest px-2">Описание задач</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="ЧЕТКОЕ ТЗ..." className="w-full bg-white/5 border border-white/15 p-4 md:p-6 rounded-xl md:rounded-2xl text-white outline-none focus:border-white/40 font-medium h-32 md:h-48 resize-none" />
               </div>
            </div>
            <div className="space-y-6 md:space-y-8">
               <div className="space-y-2 md:space-y-3">
                  <label className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest px-2">Вознаграждение</label>
                  <div className="relative">
                     <DollarSign className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40" />
                     <input value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} placeholder="10.000 ₽" className="w-full bg-white/5 border border-white/15 pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-6 rounded-xl md:rounded-2xl text-white outline-none focus:border-white/40 font-bold" />
                  </div>
               </div>
               <div className="pt-6 md:pt-10 border-t border-white/10 flex gap-3 md:gap-4">
                  <button onClick={() => setIsFormOpen(false)} className="flex-1 py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] text-white/30 hover:text-white transition-colors">Отмена</button>
                  <button onClick={handleSave} className="flex-[2] bg-white text-black py-5 md:py-7 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl">
                    {isSubmitting ? 'Ждем...' : 'Создать'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
        {jobs.map((job) => {
          const isMyJob = String(job.mentorId) === String(session.id) || String(job.mentorId).toLowerCase() === String(session.email).toLowerCase();
          const jobTelegram = job.telegram ? String(job.telegram).trim() : '';
          const hasTg = jobTelegram.length > 0;
          
          return (
            <div key={job.id} onClick={() => setSelectedJob(job)} className={`bg-[#0a0a0b] border p-6 md:p-8 rounded-[32px] md:rounded-[48px] flex flex-col h-full group transition-all duration-500 cursor-pointer ${isMyJob ? 'border-white/40 shadow-xl' : 'border-white/10 hover:border-white/30'}`}>
              <div className="flex justify-between mb-6">
                <div className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest w-fit border border-white/10">{job.category}</div>
                <div className="flex gap-2">
                  {isMyJob && (
                    <button onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id); }} className="p-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/40 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  )}
                  {hasTg && (
                    <div className="p-2.5 bg-white/10 rounded-lg text-white/40 group-hover:text-white transition-colors">
                      <Send className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-black text-white leading-tight uppercase font-syne mb-4">{job.title}</h3>
              <p className="text-white/60 text-[11px] md:text-sm leading-relaxed line-clamp-2 mb-6 italic">«{job.description}»</p>
              
              <div className="mb-6 mt-auto">
                {hasTg ? (
                  <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/10">
                    <Zap className="w-2.5 h-2.5 text-white fill-current" />
                    <span className="truncate">TG: {jobTelegram}</span>
                  </div>
                ) : (
                  <div className="text-[8px] font-black text-white/20 uppercase tracking-widest p-3 bg-white/[0.02] rounded-xl text-center">Контакт скрыт</div>
                )}
              </div>

              <div className="pt-4 md:pt-8 border-t border-white/10 flex items-center justify-between">
                 <p className="text-[8px] md:text-[10px] font-black text-white/50 uppercase truncate max-w-[120px]">{job.mentorName}</p>
                 <div className="flex items-center gap-1.5 md:gap-2 text-white">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{job.reward}</span>
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
          <div className="bg-[#1a1d23] w-full max-w-xl rounded-[40px] md:rounded-[64px] border border-white/20 shadow-3xl p-8 md:p-14 relative overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setSelectedJob(null)} className="absolute top-6 md:top-10 right-6 md:right-10 p-2 text-white/40 hover:text-white transition-colors"><X className="w-6 md:w-8 md:h-8"/></button>
            <div className="space-y-8 md:space-y-12 pt-4">
               <div className="space-y-3">
                 <div className="px-4 py-1.5 bg-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border border-white/10">{selectedJob.category}</div>
                 <h2 className="text-2xl md:text-5xl font-black text-white uppercase font-syne leading-tight tracking-tighter">{selectedJob.title}</h2>
               </div>
               <div className="p-6 md:p-12 bg-white/[0.04] rounded-[32px] md:rounded-[48px] border border-white/10">
                  <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed italic">«{selectedJob.description}»</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-5 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-3xl border border-white/5">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-1.5">Награда</span>
                    <p className="text-lg md:text-2xl font-black text-white font-syne">{selectedJob.reward || '—'}</p>
                  </div>
                  <div className="p-5 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-3xl border border-white/5">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-1.5">Telegram</span>
                    <p className="text-lg md:text-2xl font-black text-white truncate font-syne">{selectedJob.telegram || '—'}</p>
                  </div>
               </div>
               {selectedJob.telegram && (
                 <button 
                  onClick={() => {
                    const cleanUsername = String(selectedJob.telegram).replace('@', '').trim();
                    window.open(`https://t.me/${cleanUsername}`, '_blank');
                  }} 
                  className="w-full bg-white text-black py-6 md:py-8 rounded-[24px] md:rounded-[32px] font-black uppercase text-[10px] md:text-[11px] flex items-center justify-center gap-3 md:gap-4 shadow-2xl active:scale-95 transition-all"
                 >
                   <Send className="w-5 h-5 md:w-6 md:h-6" /> Написать в Telegram
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
