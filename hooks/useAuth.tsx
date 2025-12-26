
import React, { createContext, useContext, useState } from 'react';
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
    const users: User[] = JSON.parse(localStorage.getItem('gc_users') || '[]');
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password);

    if (!foundUser) return false;

    const { password: _, ...userSession } = foundUser;
    setUser(userSession as User);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('gc_user_session', JSON.stringify(userSession));
    
    return true;
  };

  const signUp = async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    const users: User[] = JSON.parse(localStorage.getItem('gc_users') || '[]');
    const cleanUsername = username.toLowerCase().trim();
    
    if (users.find(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Usuário já existe.' };
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username: cleanUsername,
      password,
      role: 'OPERATOR' as const
    };

    localStorage.setItem('gc_users', JSON.stringify([...users, newUser]));
    return { success: true, message: 'Conta criada com sucesso!' };
  };

  const logout = () => {
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
