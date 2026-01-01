
import React, { useState, useEffect, useRef } from 'react';
import { Booking, ChatMessage, UserSession, UserRole } from '../../types';
import { Search, Send, MessageSquare, Clock, Zap, ArrowLeft, MoreVertical, CheckCheck, Loader2 } from 'lucide-react';
import { dbService } from '../../services/databaseService';

interface ChatManagerProps {
  bookings: Booking[];
  session: UserSession;
  onSendMessage: (bookingId: string, text: string) => void;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ bookings, session, onSendMessage }) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const filteredBookings = confirmedBookings.filter(b => 
    b.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.mentorId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeBooking = confirmedBookings.find(b => b.id === selectedBookingId);

  // Подгрузка сообщений при выборе чата
  useEffect(() => {
    if (selectedBookingId) {
      loadMessages(selectedBookingId);
      const interval = setInterval(() => loadMessages(selectedBookingId), 5000); // Опрос каждые 5 сек
      return () => clearInterval(interval);
    } else {
      setChatMessages([]);
    }
  }, [selectedBookingId]);

  const loadMessages = async (bookingId: string) => {
    try {
      const msgs = await dbService.getMessages(bookingId);
      setChatMessages(msgs);
    } catch (e) {
      console.error('Failed to load messages');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedBookingId) return;
    
    const tempMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      bookingId: selectedBookingId,
      senderEmail: session.email,
      senderName: session.name,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    // Оптимистичное обновление UI
    setChatMessages(prev => [...prev, tempMsg]);
    setInputText('');

    try {
      await dbService.sendMessage(tempMsg);
      onSendMessage(selectedBookingId, inputText); // Уведомляем родителя (MainDashboard)
    } catch (e) {
      console.error('Message failed to send');
    }
  };

  const getChatName = (booking: Booking) => {
    return session.role === UserRole.ENTREPRENEUR ? booking.userName : booking.mentorId;
  };

  return (
    <div className="h-[calc(100vh-14rem)] bg-[#0a0a0b] rounded-[48px] border border-white/5 flex overflow-hidden shadow-3xl animate-in fade-in duration-700">
      {/* Sidebar - Contacts */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col ${selectedBookingId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-white/5 space-y-6">
          <h2 className="text-2xl font-black text-white uppercase font-syne tracking-tight">СООБЩЕНИЯ</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Поиск диалогов..." 
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl text-white text-xs outline-none focus:border-indigo-500" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-4 opacity-30">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">Нет активных чатов</p>
            </div>
          ) : (
            filteredBookings.map(b => (
              <button 
                key={b.id} 
                onClick={() => setSelectedBookingId(b.id)}
                className={`w-full p-6 flex items-center gap-4 transition-all border-b border-white/5 hover:bg-white/[0.02] ${selectedBookingId === b.id ? 'bg-indigo-600/10 border-r-4 border-r-indigo-600' : ''}`}
              >
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/10">
                  <span className="font-black text-xl">{getChatName(b)[0]}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm font-black text-white truncate uppercase font-syne">{getChatName(b)}</p>
                    <span className="text-[8px] font-bold text-slate-600 uppercase">{b.date.split('-').reverse().slice(0,2).join('.')}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium truncate italic">«{b.serviceTitle}»</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white/[0.01] ${!selectedBookingId ? 'hidden md:flex' : 'flex'}`}>
        {activeBooking ? (
          <>
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedBookingId(null)} className="md:hidden p-2 text-slate-500"><ArrowLeft /></button>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 font-black">
                     {getChatName(activeBooking)[0]}
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase font-syne leading-none">{getChatName(activeBooking)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]">{activeBooking.serviceTitle}</span>
                      </div>
                   </div>
                </div>
              </div>
              <button className="p-3 text-slate-600 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
              {chatMessages.map((msg, idx) => {
                const isMe = msg.senderEmail === session.email;
                return (
                  <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[80%] md:max-w-[60%] space-y-2`}>
                      <div className={`p-6 rounded-[32px] ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-600 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-8 md:p-10 border-t border-white/5">
              <div className="relative flex items-center gap-4">
                <input 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[24px] text-white outline-none focus:border-indigo-500 transition-all font-medium pr-16"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="absolute right-3 p-4 bg-indigo-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
            <div className="w-32 h-32 bg-white/5 rounded-[48px] flex items-center justify-center text-slate-800">
               <MessageSquare className="w-12 h-12" />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">МЕССЕНДЖЕР ШАГ</h3>
               <p className="text-slate-500 text-sm max-w-xs mx-auto">Выберите активный диалог слева, чтобы начать обсуждение деталей вашей встречи.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
