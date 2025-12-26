
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon, SunIcon, MoonIcon } from './Icons';
import { useTheme } from '../hooks/useTheme';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Bloquear scroll do corpo quando o menu móvel estiver aberto
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden font-sans transition-colors duration-500">
      
      {/* Barra de Ações Superior (Mobile e Desktop) */}
      <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
        {/* Toggle Dark Mode */}
        <button 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-amber-400 rounded-full shadow-2xl shadow-black/10 dark:shadow-blue-500/10 hover:scale-110 active:scale-95 transition-all group"
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6 animate-[spin_3s_linear_infinite]" />
          ) : (
            <MoonIcon className="h-6 w-6 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Botão de Menu para Mobile */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 sm:p-10 lg:p-14">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
