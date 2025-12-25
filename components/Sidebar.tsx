
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, ClipboardListIcon, FileDownIcon, XIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { to: '/', text: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, show: true },
    { to: '/cursos', text: 'Cursos', icon: <BookOpenIcon className="h-5 w-5" />, show: true },
    { to: '/alunos', text: 'Estudantes', icon: <UsersIcon className="h-5 w-5" />, show: true },
    { to: '/professores', text: 'Docentes', icon: <UserCheckIcon className="h-5 w-5" />, show: true },
    { to: '/parceiros', text: 'Parceiros', icon: <BriefcaseIcon className="h-5 w-5" />, show: true },
    { to: '/enturmacao', text: 'Enturmação', icon: <ClipboardListIcon className="h-5 w-5" />, show: isAdmin },
    { to: '/relatorios', text: 'Relatórios', icon: <FileDownIcon className="h-5 w-5" />, show: true },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[50] lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[55] w-72 bg-white dark:bg-gray-800 
        flex-shrink-0 flex flex-col h-full border-r border-gray-100 dark:border-gray-700
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-3xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">G</div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Gestão</h1>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-rose-500 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.filter(item => item.show).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `group flex items-center px-6 py-4 rounded-[20px] transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-transform duration-300 group-hover:scale-110`}>{item.icon}</span>
                  <span className="ml-4">{item.text}</span>
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-[10px]">
                  {user?.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</p>
                </div>
             </div>
             <button 
               onClick={logout}
               className="w-full py-2.5 bg-white dark:bg-gray-800 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl border border-rose-50 dark:border-rose-900/20 hover:bg-rose-50 transition-all active:scale-95"
             >
               Sair do Sistema
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
