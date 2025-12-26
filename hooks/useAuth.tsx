
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

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
    const savedLocal = localStorage.getItem('gestao_cursos_user_session');
    const savedSession = sessionStorage.getItem('gestao_cursos_user_session');
    const saved = savedLocal || savedSession;
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase().trim())
        .eq('password', password)
        .single();

      if (error || !data) return false;

      // Remove a senha antes de persistir no estado/storage
      const { password: _, ...userSession } = data;
      const finalUser = userSession as User;
      
      setUser(finalUser);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('gestao_cursos_user_session', JSON.stringify(finalUser));
      
      // Limpa storage oposto
      if (rememberMe) sessionStorage.removeItem('gestao_cursos_user_session');
      else localStorage.removeItem('gestao_cursos_user_session');

      return true;
    } catch (err) {
      console.error('Auth Error:', err);
      return false;
    }
  };

  const signUp = async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
      const cleanUsername = username.toLowerCase().trim();
      
      const { data: existing } = await supabase
        .from('users')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existing) {
        return { success: false, message: 'Este usuário já está cadastrado.' };
      }

      const { error } = await supabase.from('users').insert([{
        name,
        username: cleanUsername,
        password,
        role: 'OPERATOR'
      }]);

      if (error) throw error;

      return { success: true, message: 'Conta criada! Faça login para continuar.' };
    } catch (err) {
      return { success: false, message: 'Erro ao conectar com o banco de dados.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gestao_cursos_user_session');
    sessionStorage.removeItem('gestao_cursos_user_session');
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
