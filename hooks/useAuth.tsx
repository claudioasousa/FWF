
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

// Usuário padrão para acesso direto sem login
const DEFAULT_USER: User = {
  id: 'system-admin',
  name: 'Administrador do Sistema',
  username: 'admin',
  role: 'ADMIN',
  isOnline: true
};

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user] = useState<User | null>(DEFAULT_USER);

  const login = async (): Promise<boolean> => {
    return true;
  };

  const signUp = async (): Promise<{success: boolean, message: string}> => {
    return { success: true, message: 'Operação não disponível em modo sem login.' };
  };

  const logout = () => {
    // Sem ação pois a tela de login foi removida
    console.log("Logout desativado.");
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
