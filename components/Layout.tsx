
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon } from './Icons';
import { useData } from '../hooks/useData';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOffline, pendingSyncCount, syncOutbox } = useData();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await syncOutbox();
    setIsSyncing(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background Blobs for Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Networking Toasts */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        {isOffline && (
            <div className="flex items-center gap-3 px-6 py-3 bg-rose-500 text-white rounded-2xl shadow-2xl animate-bounce border border-white/20 backdrop-blur-md">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Offline Mode</span>
            </div>
        )}
        
        {pendingSyncCount > 0 && (
            <button 
                onClick={handleManualSync}
                className={`flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md pointer-events-auto active:scale-95 transition-all group ${isSyncing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
            >
                <div className={`w-2 h-2 bg-white rounded-full ${isSyncing ? 'animate-spin' : 'animate-pulse'}`}></div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                    {isSyncing ? 'Sincronizando...' : `${pendingSyncCount} Ações Pendentes`}
                </span>
                {!isSyncing && <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-2">Sincronizar Agora</span>}
            </button>
        )}
      </div>

      <div className="fixed top-8 left-8 z-[90] lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white dark:bg-slate-900 text-blue-600 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 active:scale-90 transition-transform"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="p-6 sm:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
