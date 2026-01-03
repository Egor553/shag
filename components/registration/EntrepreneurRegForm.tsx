
import React from 'react';
import { Mail, Building, MapPin, TrendingUp, Clock, Key, User, Briefcase, Sparkles, Target, Calendar as CalendarIcon, Heart, ShieldCheck, Zap } from 'lucide-react';
import { SlotCalendar } from '../SlotCalendar';

interface EntrepreneurRegFormProps {
  regStep: number;
  regData: any;
  setRegData: (data: any) => void;
}

const GeometricInput = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-2">
        <Icon className="w-3 h-3 text-white/40 group-focus-within:text-white" /> {label}
      </label>
      {required && <span className="text-[7px] font-bold text-white/30 uppercase hidden sm:inline">Required</span>}
    </div>
    <div className="relative">
      <input 
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 p-4 lg:p-5 rounded-tl-2xl rounded-br-2xl text-white text-sm font-bold outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20"
      />
      <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full" />
    </div>
  </div>
);

const GeometricTextArea = ({ label, icon: Icon, placeholder, value, onChange, required = false }: any) => (
  <div className="relative group w-full">
    <div className="flex items-center justify-between mb-2 lg:mb-3 px-1">
      <label className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em] group-focus-within:text-white transition-colors flex items-center gap-2">
        <Icon className="w-3 h-3 text-white/40 group-focus-within:text-white" /> {label}
      </label>
    </div>
    <textarea 
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 p-5 lg:p-6 rounded-tr-3xl rounded-bl-3xl text-white text-sm font-medium outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder:text-white/20 h-32 md:h-40 resize-none"
    />
  </div>
);

export const EntrepreneurRegForm: React.FC<EntrepreneurRegFormProps> = ({ regStep, regData, setRegData }) => {
  return (
    <div className="space-y-8 lg:space-y-12">
      {regStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-10">
          <GeometricInput label="Full Name" icon={User} placeholder="ALEXANDER_S" value={regData.name} onChange={(v: string) => setRegData({...regData, name: v})} required />
          <GeometricInput label="Company" icon={Building} placeholder="PROJECT_ALPHA" value={regData.companyName} onChange={(v: string) => setRegData({...regData, companyName: v})} required />
          <GeometricInput label="Annual Turnover" icon={TrendingUp} placeholder="MILLIONS_RUB" value={regData.turnover} onChange={(v: string) => setRegData({...regData, turnover: v})} required />
          <GeometricInput label="Base City" icon={MapPin} placeholder="MOSCOW" value={regData.city} onChange={(v: string) => setRegData({...regData, city: v})} required />
          <div className="md:col-span-2">
            <GeometricInput label="Expertise Niche" icon={Briefcase} placeholder="IT / MARKETING / FINTECH" value={regData.direction} onChange={(v: string) => setRegData({...regData, direction: v})} required />
          </div>
          
          <div className="md:col-span-2 mt-4 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 lg:p-8 bg-white/[0.03] rounded-[30px] border border-white/10 relative">
            <div className="absolute -top-3 left-6 lg:left-8 px-4 py-1 bg-[#1a1d23] border border-white/20 rounded-full text-[7px] font-black text-white uppercase tracking-widest">
              Security_Module
            </div>
            <GeometricInput label="Work Email" icon={Mail} placeholder="OFFICE@CORP.COM" type="email" value={regData.email} onChange={(v: string) => setRegData({...regData, email: v})} required />
            <GeometricInput label="Master Password" icon={Key} placeholder="********" type="password" value={regData.password} onChange={(v: string) => setRegData({...regData, password: v})} required />
          </div>
        </div>
      )}

      {regStep === 2 && (
        <div className="space-y-6 lg:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            <GeometricTextArea label="Core Values" icon={Sparkles} placeholder="WHAT DRIVES YOU?" value={regData.qualities} onChange={(v: string) => setRegData({...regData, qualities: v})} required />
            <GeometricTextArea label="Talent Request" icon={Target} placeholder="WHAT DO YOU SEEK?" value={regData.requestToYouth} onChange={(v: string) => setRegData({...regData, requestToYouth: v})} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <GeometricInput label="Business Clubs" icon={ShieldCheck} placeholder="RESIDENCY" value={regData.businessClubs} onChange={(v: string) => setRegData({...regData, businessClubs: v})} />
            <GeometricInput label="Lifestyle / Sport" icon={Heart} placeholder="HOBBIES" value={regData.lifestyle} onChange={(v: string) => setRegData({...regData, lifestyle: v})} />
          </div>
        </div>
      )}

      {regStep === 3 && (
        <div className="space-y-8 lg:space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8 bg-white/[0.04] p-6 lg:p-8 rounded-tr-[40px] lg:rounded-tr-[50px] rounded-bl-[40px] lg:rounded-bl-[50px] border border-white/15 shadow-inner">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
               <Clock className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
            <div className="flex-1 space-y-2 lg:space-y-4 w-full">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Resource_Allocation</label>
              <div className="relative">
                <input 
                  required 
                  value={regData.timeLimit} 
                  onChange={e => setRegData({...regData, timeLimit: e.target.value})} 
                  placeholder="H / MONTH" 
                  className="w-full bg-transparent border-b border-white/20 py-2 lg:py-4 text-3xl lg:text-4xl font-black text-white outline-none focus:border-white transition-all font-syne" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              <label className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Calendar_Synchronization</label>
            </div>
            <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-2 lg:p-4 shadow-2xl overflow-x-auto">
              <SlotCalendar selectedSlots={regData.slots} onChange={s => setRegData({...regData, slots: s})} accentColor="indigo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
