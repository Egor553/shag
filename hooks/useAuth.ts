
import { useState, useCallback } from 'react';
import { UserSession, UserRole } from '../types';
import { dbService } from '../services/databaseService';

export const useAuth = (onSuccessSync: (email: string, session: UserSession) => Promise<void>) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const login = useCallback(async (email: string, pass: string) => {
    setIsAuthLoading(true);
    setErrorMsg(null);
    try {
      const userData = await dbService.login({ email, password: pass });
      const sess = { ...userData, isLoggedIn: true } as UserSession;
      
      localStorage.setItem('shag_session', JSON.stringify(sess));
      setSession(sess);
      
      // Синхронизацию запускаем, но не ждем её для входа в UI
      onSuccessSync(sess.email, sess);
      return true;
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка входа');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }, [onSuccessSync]);

  const register = useCallback(async (role: UserRole, data: any) => {
    setIsAuthLoading(true);
    setErrorMsg(null);
    try {
      const newUser = { 
        role, 
        ...data, 
        slots: typeof data.slots === 'string' ? data.slots : JSON.stringify(data.slots), 
        balance: 0 
      };
      
      const res = await dbService.register(newUser);
      
      if (res.result === 'success') {
        const sess = { ...res.user, isLoggedIn: true } as UserSession;
        
        localStorage.setItem('shag_session', JSON.stringify(sess));
        setSession(sess);
        
        // Уведомляем систему о необходимости подгрузки данных
        await onSuccessSync(newUser.email, sess);
        return true;
      }
      throw new Error(res.message || 'Ошибка регистрации');
    } catch (e: any) {
      setErrorMsg(e.message || 'Ошибка соединения');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }, [onSuccessSync]);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('shag_session');
  }, []);

  return { session, setSession, isAuthLoading, errorMsg, setErrorMsg, login, register, logout };
};
