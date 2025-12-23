
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon } from './Icons';

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden font-sans">
      {/* Botão de Menu Flutuante para Mobile */}
      <div className="lg:hidden fixed top-6 right-6 z-[60]">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all"
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
