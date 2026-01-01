
import React, { useState } from 'react';
import { Job, UserRole, UserSession } from '../../types';
import { 
  Rocket, Briefcase, Plus, X, Save, Trash2, 
  ArrowRight, Zap, Target, DollarSign, Clock, Loader2, CheckCircle2
} from 'lucide-react';

interface JobsViewProps {
  jobs: Job[];
  session: UserSession;
  onSaveJob: (job: Partial<Job>) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const JobsView: React.FC<JobsViewProps> = ({ jobs, session, onSaveJob, onDeleteJob }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    reward: '',
    category: 'Маркетинг',
    deadline: ''
  });

  const isEnt = session.role === UserRole.ENTREPRENEUR;

  const handleSave = async () => {
    if (!formData.title || !formData.description || isSubmitting) return;
    
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
      setFormData({ title: '', description: '', reward: '', category: 'Маркетинг', deadline: '' });
    } catch (e) {
      console.error("Failed to save job", e);
      alert("Ошибка при создании миссии");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;
    // В реальном приложении здесь был бы вызов API
    setAppliedJobs([...appliedJobs, jobId]);
    alert("Ваш отклик отправлен ментору! Он свяжется с вами в чате.");
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

        {/* Создавать могут только менторы */}
        {isEnt && !isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-black px-10 py-6 rounded-[32px] font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Создать миссию
          </button>
        )}
      </div>

      {/* Builder Form (Only for Mentors) */}
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
                    placeholder="СДЕЛАТЬ АНАЛИЗ КОНКУРЕНТОВ В ПРЕЗЕНТАЦИИ" 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-violet-500 font-bold disabled:opacity-50" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Описание миссии</label>
                  <textarea 
                    disabled={isSubmitting}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="ЧЕТКОЕ ТЗ: НУЖНО СОБРАТЬ 10 ПРИМЕРОВ САЙТОВ В НИШЕ..." 
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
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Предприниматели и Эксперты скоро опубликуют задачи для Модных талантов.</p>
             </div>
          </div>
        ) : (
          jobs.map((job, idx) => {
            const isMyJob = String(job.mentorId) === String(session.id) || String(job.mentorId).toLowerCase() === String(session.email).toLowerCase();
            const hasApplied = appliedJobs.includes(job.id);

            return (
              <div 
                key={job.id} 
                className={`bg-[#0a0a0b] border p-8 rounded-[40px] flex flex-col h-full group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${isMyJob ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.05)]' : 'border-white/5 hover:border-violet-500/50'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-2 bg-violet-500/10 text-violet-500 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit">
                      {job.category}
                    </div>
                    {isMyJob && (
                      <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest px-1">Ваша миссия</span>
                    )}
                  </div>
                  {isEnt && isMyJob && (
                    <button onClick={() => onDeleteJob(job.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all">
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

                <div className="space-y-6">
                  <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Вознаграждение</span>
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-lg font-black text-white">{job.reward}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center text-violet-500">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Заказчик</p>
                        <p className="text-xs font-bold text-slate-300 truncate">{job.mentorName}</p>
                      </div>
                    </div>
                    
                    {isEnt ? (
                       <div className="px-5 py-2 rounded-full border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                         {isMyJob ? 'В поиске' : 'Просмотр'}
                       </div>
                    ) : (
                      <button 
                        onClick={() => handleApply(job.id)}
                        disabled={hasApplied}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all ${hasApplied ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 cursor-default' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                      >
                        {hasApplied ? (
                          <>Отправлено <CheckCircle2 className="w-3 h-3" /></>
                        ) : (
                          <>Взять миссию <ArrowRight className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
