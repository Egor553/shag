
import React, { useState, useEffect, useRef } from 'react';
import { Booking, ChatMessage, UserSession } from '../../types';
import { X, Send, User, Clock, Zap, MessageSquare } from 'lucide-react';

interface ChatRoomProps {
  booking: Booking;
  session: UserSession;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ booking, session, messages, onSendMessage, onClose }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const otherPersonName = session.email === booking.userEmail ? booking.mentorId : booking.userName;

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-[#0a0a0b] border border-white/10 rounded-[48px] md:rounded-[64px] shadow-3xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Чат по встрече</p>
                 <h3 className="text-xl font-black text-white uppercase font-syne tracking-tight">
                   {booking.serviceTitle || 'Персональный ШАГ'}
                 </h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Собеседник: {otherPersonName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
             <X className="w-8 h-8" />
           </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
               <Zap className="w-16 h-16 text-indigo-500" />
               <p className="text-xs font-black uppercase tracking-[0.5em]">Напишите первое сообщение</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderEmail === session.email;
              return (
                <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                   <div className={`max-w-[80%] md:max-w-[60%] space-y-2`}>
                      <div className={`p-6 rounded-[32px] ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                         <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-600 ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <Clock className="w-2.5 h-2.5" />
                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                   </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-8 md:p-12 border-t border-white/5 bg-white/[0.01]">
           <div className="relative flex items-center gap-4">
              <input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ваше сообщение..."
                className="flex-1 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px] text-white outline-none focus:border-indigo-500 transition-all font-medium text-sm md:text-base pr-20"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="absolute right-4 p-4 md:p-6 bg-indigo-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-30"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
