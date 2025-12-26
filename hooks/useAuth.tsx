
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();

      if (error || !data) return false;

      const { password: _, ...userSession } = data;
      setUser(userSession as User);
      localStorage.setItem('auth_session', JSON.stringify(userSession));
      return true;
    } catch (err) {
      console.error('Erro na autenticação:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_session');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
