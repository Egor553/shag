
import React, { useState } from 'react';
import { Star, X, MessageSquare, ShieldCheck, Send } from 'lucide-react';
import { Booking, UserSession } from '../../types';
import { dbService } from '../../services/databaseService';

interface ReviewModalProps {
    booking: Booking;
    session: UserSession;
    onClose: () => void;
    onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, session, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dbService.saveReview({
                id: Math.random().toString(36).substr(2, 9),
                mentor_id: booking.mentorId,
                user_email: session.email,
                user_name: session.name,
                rating,
                comment,
                is_anonymous: isAnonymous,
                date: new Date().toISOString()
            });
            // Обновляем статус бронирования, чтобы нельзя было оставить отзыв дважды
            await dbService.updateBookingStatus(booking.id, 'completed');
            onSuccess();
            onClose();
        } catch (e) {
            alert('Ошибка при сохранении отзыва');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#1a1d23] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 md:p-12 space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.4em]">ФОРМА_ОБРАТНОЙ_СВЯЗИ</p>
                            <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tighter">ОЦЕНИТЕ ВСТРЕЧУ</h3>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.05em]">{booking.serviceTitle}</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">ВАША ОЦЕНКА</label>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-all transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-white/10'}`}
                                    >
                                        <Star size={40} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={2.5} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare size={12} /> ВАШ КОММЕНТАРИЙ
                            </label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Что вам особенно понравилось? Какие инсайты получили?"
                                className="w-full bg-white/5 border border-white/10 p-6 rounded-[30px] text-white outline-none focus:border-indigo-500 transition-all h-32 resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-emerald-500 w-5 h-5" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">АНОНИМНО</p>
                                    <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest">Ментор не увидит ваше имя</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAnonymous(!isAnonymous)}
                                className={`w-14 h-8 rounded-full transition-all relative ${isAnonymous ? 'bg-indigo-600' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isAnonymous ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl transition-all"
                        >
                            {isSubmitting ? 'ОПЕРАЦИЯ...' : (
                                <>ОТПРАВИТЬ ОТЗЫВ <Send size={16} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
