
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
    const savedLocal = localStorage.getItem('gestao_cursos_session');
    const savedSession = sessionStorage.getItem('gestao_cursos_session');
    const saved = savedLocal || savedSession;
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();

      if (error || !data) return false;

      // Sanitizar dados sensíveis antes de salvar na sessão
      const { password: _, ...userSession } = data;
      setUser(userSession as User);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('gestao_cursos_session', JSON.stringify(userSession));
      
      // Limpar storage oposto para evitar conflitos de sessão
      if (rememberMe) sessionStorage.removeItem('gestao_cursos_session');
      else localStorage.removeItem('gestao_cursos_session');

      return true;
    } catch (err) {
      console.error('Erro na autenticação:', err);
      return false;
    }
  };

  const signUp = async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
      // Validar se o usuário já existe no sistema
      const { data: existing } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (existing) {
        return { success: false, message: 'O nome de usuário já está em uso.' };
      }

      const { error } = await supabase.from('users').insert([{
        name,
        username: username.toLowerCase(),
        password,
        role: 'OPERATOR' // Novos cadastros iniciam como operadores por padrão
      }]);

      if (error) throw error;

      return { success: true, message: 'Conta criada com sucesso! Você já pode entrar.' };
    } catch (err) {
      console.error('Erro no cadastro:', err);
      return { success: false, message: 'Falha ao processar cadastro. Tente novamente.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gestao_cursos_session');
    sessionStorage.removeItem('gestao_cursos_session');
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
