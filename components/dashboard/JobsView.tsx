
import React, { useState } from 'react';
import { Job, UserRole, UserSession } from '../../types';
import { 
  Rocket, Briefcase, Plus, X, Save, Trash2, 
  ArrowRight, Zap, Target, DollarSign, Clock, Loader2, CheckCircle2, Send, Info
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
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    reward: '',
    category: 'Маркетинг',
    telegram: '',
    deadline: ''
  });

  const isEnt = session.role === UserRole.ENTREPRENEUR;

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.telegram || isSubmitting) {
      alert("Пожалуйста, заполните заголовок, описание и Telegram для связи");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSaveJob({
        ...formData,
        mentorId: session.id || session.email,
        mentorName: session.name,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      setIsFormOpen(false);
      setFormData({ title: '', description: '', reward: '', category: 'Маркетинг', telegram: '', deadline: '' });
    } catch (e) {
      console.error("Failed to save job", e);
      alert("Ошибка при создании миссии");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 md:space-y-24 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-violet-500" />
            <span className="text-violet-500 font-bold text-[9px] uppercase tracking-[0.4em]">Work & Projects</span>
          </div>
          <h1 className="text-[12vw] sm:text-7xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.9] uppercase font-syne">
            ПОДРАБОТКА<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/60">МИССИИ</span>
          </h1>
        </div>

        {isEnt && !isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-black px-10 py-6 rounded-[32px] font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Создать миссию
          </button>
        )}
      </div>

      {/* Builder Form */}
      {isFormOpen && (
        <div className="bg-[#0a0a0b] p-8 md:p-16 rounded-[48px] border border-white/10 shadow-3xl animate-in zoom-in-95 duration-500 relative">
          <button onClick={() => setIsFormOpen(false)} className="absolute top-10 right-10 p-2 text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Заголовок задачи</label>
                  <input 
                    disabled={isSubmitting}
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="СДЕЛАТЬ АНАЛИЗ КОНКУРЕНТОВ..." 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Ваш Telegram (для связи)</label>
                  <div className="relative">
                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      disabled={isSubmitting}
                      value={formData.telegram} 
                      onChange={e => setFormData({...formData, telegram: e.target.value})} 
                      placeholder="@username" 
                      className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                    />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Описание миссии</label>
                  <textarea 
                    disabled={isSubmitting}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="ЧЕТКОЕ ТЗ..." 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-medium h-48 resize-none disabled:opacity-50" 
                  />
               </div>
            </div>
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Вознаграждение (₽ + Опыт)</label>
                  <div className="relative">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                     <input 
                        disabled={isSubmitting}
                        value={formData.reward} 
                        onChange={e => setFormData({...formData, reward: e.target.value})} 
                        placeholder="10.000 ₽ + ЛИЧНЫЙ СОЗВОН" 
                        className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                     />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Категория</label>
                    <input 
                      disabled={isSubmitting}
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Дедлайн</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        disabled={isSubmitting}
                        type="date" 
                        value={formData.deadline} 
                        onChange={e => setFormData({...formData, deadline: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                      />
                    </div>
                  </div>
               </div>
               <div className="pt-10 border-t border-white/5 flex gap-4">
                  <button disabled={isSubmitting} onClick={() => setIsFormOpen(false)} className="flex-1 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white/5">Отмена</button>
                  <button 
                    disabled={isSubmitting} 
                    onClick={handleSave} 
                    className="flex-[2] bg-violet-600 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Опубликовать миссию'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {jobs.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[48px]">
             <Rocket className="w-20 h-20 text-white/5" />
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase font-syne">Миссий пока нет</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Предприниматели и Эксперты скоро опубликуют задачи.</p>
             </div>
          </div>
        ) : (
          jobs.map((job, idx) => {
            const isMyJob = String(job.mentorId) === String(session.id) || String(job.mentorId).toLowerCase() === String(session.email).toLowerCase();
            return (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className={`bg-[#0a0a0b] border p-8 rounded-[40px] flex flex-col h-full group transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4 ${isMyJob ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.05)]' : 'border-white/5 hover:border-violet-500/50'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-2 bg-violet-500/10 text-violet-500 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit">
                      {job.category}
                    </div>
                  </div>
                  {isEnt && isMyJob && (
                    <button onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id); }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4 flex-1 mb-10">
                  <h3 className="text-2xl font-black text-white leading-tight uppercase font-syne group-hover:text-violet-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 italic">
                    «{job.description}»
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center text-violet-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{job.mentorName}</p>
                   </div>
                   <div className="flex items-center gap-2 text-violet-400">
                      <span className="text-[10px] font-black uppercase tracking-widest">Детали</span>
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0a0a0b] w-full max-w-xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden relative">
            <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-all"><X className="w-8 h-8"/></button>
            <div className="p-10 md:p-14 space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-violet-500">
                    <Target className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Миссия проекта</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase font-syne leading-none tracking-tighter">{selectedJob.title}</h2>
               </div>

               <div className="p-8 bg-white/[0.03] rounded-[32px] border border-white/5 space-y-4">
                  <p className="text-slate-300 font-medium leading-relaxed italic">«{selectedJob.description}»</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/[0.02] rounded-3xl space-y-1">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Награда</span>
                     <p className="text-xl font-black text-white font-syne">{selectedJob.reward}</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] rounded-3xl space-y-1">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Категория</span>
                     <p className="text-xl font-black text-white font-syne">{selectedJob.category}</p>
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="flex flex-col items-center gap-4 text-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Связаться с предпринимателем:</p>
                     <div className="flex items-center gap-3 bg-violet-600/10 px-8 py-5 rounded-2xl border border-violet-500/20 w-full group hover:bg-violet-600 transition-all cursor-pointer" 
                          onClick={() => window.open(`https://t.me/${selectedJob.telegram?.replace('@', '')}`, '_blank')}>
                        <Send className="w-5 h-5 text-violet-400 group-hover:text-white" />
                        <span className="text-lg font-black text-white tracking-widest uppercase">{selectedJob.telegram}</span>
                     </div>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="w-full py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Закрыть</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
