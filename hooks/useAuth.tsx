
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signUp: (name: string, username: string, password: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = 'gc_auth_session_v69';

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar sessão salva ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      if (!isConfigured) {
        // Fallback para admin padrão em modo offline/sem config
        if (username === 'admin' && password === 'admin') {
          const mockUser: User = { id: 'mock', name: 'Admin Offline', username: 'admin', role: 'ADMIN', isOnline: true };
          setUser(mockUser);
          if (rememberMe) localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
          return true;
        }
        return false;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();

      if (error || !data) throw new Error('Não encontrado');

      const loggedUser: User = {
        id: data.id,
        name: data.name,
        username: data.username,
        role: data.role,
        isOnline: true
      };

      setUser(loggedUser);
      if (rememberMe) localStorage.setItem(AUTH_KEY, JSON.stringify(loggedUser));
      
      // Atualizar status online no banco
      await supabase.from('users').update({ is_online: true, last_seen: new Date().toISOString() }).eq('id', data.id);
      
      return true;
    } catch (err) {
      console.error("Erro login:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    if (!isConfigured) return { success: false, message: 'Banco de dados não configurado.' };
    
    try {
      const { error } = await supabase.from('users').insert([{
        name,
        username: username.toLowerCase(),
        password,
        role: 'OPERATOR'
      }]);

      if (error) {
        if (error.code === '23505') return { success: false, message: 'Este nome de usuário já existe.' };
        throw error;
      }

      return { success: true, message: 'Usuário criado com sucesso! Faça login.' };
    } catch (err) {
      return { success: false, message: 'Erro ao cadastrar. Tente novamente.' };
    }
  };

  const logout = () => {
    if (user && isConfigured) {
       supabase.from('users').update({ is_online: false }).eq('id', user.id);
    }
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
