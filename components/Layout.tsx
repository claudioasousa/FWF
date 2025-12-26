
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon, SunIcon, MoonIcon } from './Icons';
import { useTheme } from '../hooks/useTheme';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans">
      
      {/* Barra de Ações Superior Flutuante */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
        {/* Toggle Dark Mode Profissional */}
        <button 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          className="relative overflow-hidden p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all group"
        >
          <div className="relative z-10 flex items-center justify-center">
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-amber-400 animate-[spin_10s_linear_infinite]" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-600 group-hover:-rotate-12 transition-transform" />
            )}
          </div>
          {/* Efeito de brilho ao redor */}
          <div className={`absolute inset-0 opacity-20 transition-opacity blur-lg ${theme === 'dark' ? 'bg-amber-400' : 'bg-indigo-600'}`}></div>
        </button>

        {/* Botão de Menu para Mobile */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-3.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Overlay decorativo de background no modo escuro */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="p-6 sm:p-10 lg:p-14 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;