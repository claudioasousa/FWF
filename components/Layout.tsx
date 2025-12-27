
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon } from './Icons';
import { useData } from '../hooks/useData';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isOffline, pendingSyncCount } = useData();

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
      
      {/* Indicadores de Rede e Sync */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-2 pointer-events-none">
        {isOffline && (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-2xl shadow-2xl animate-pulse border border-rose-500/20">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Você está offline</span>
            </div>
        )}
        
        {pendingSyncCount > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl shadow-2xl border border-blue-500/20">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{pendingSyncCount} Alterações na fila</span>
            </div>
        )}
      </div>

      <div className="fixed top-6 right-6 z-[90] pointer-events-auto">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-3.5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 active:scale-95 transition-all flex items-center justify-center"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="p-6 sm:p-10 lg:p-14 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
