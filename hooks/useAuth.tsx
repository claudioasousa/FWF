
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signUp: (name: string, username: string, password: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedLocal = localStorage.getItem('gc_user_session');
    const savedSession = sessionStorage.getItem('gc_user_session');
    const saved = savedLocal || savedSession;
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    if (!supabase) return false;

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .eq('password', password);

    if (error || !users || users.length === 0) return false;

    const foundUser = users[0];
    
    // Atualizar status online no banco
    await supabase
      .from('users')
      .update({ is_online: true, last_seen: new Date().toISOString() })
      .eq('id', foundUser.id);

    const { password: _, ...userSession } = foundUser;
    const finalUserSession = { ...userSession, isOnline: true } as User;
    
    setUser(finalUserSession);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('gc_user_session', JSON.stringify(finalUserSession));
    
    return true;
  };

  const signUp = async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    if (!supabase) return { success: false, message: 'Serviço indisponível.' };

    const cleanUsername = username.toLowerCase().trim();
    
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', cleanUsername);

    if (existing && existing.length > 0) {
      return { success: false, message: 'Usuário já existe.' };
    }

    const { error } = await supabase.from('users').insert([{
      name,
      username: cleanUsername,
      password,
      role: 'OPERATOR',
      is_online: false
    }]);

    if (error) return { success: false, message: 'Erro ao criar conta.' };

    return { success: true, message: 'Conta criada com sucesso!' };
  };

  const logout = async () => {
    if (user && supabase) {
      // Tentar atualizar status offline no banco
      await supabase
        .from('users')
        .update({ is_online: false, last_seen: new Date().toISOString() })
        .eq('id', user.id);
    }
    
    setUser(null);
    localStorage.removeItem('gc_user_session');
    sessionStorage.removeItem('gc_user_session');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
