
import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  HomeIcon, UsersIcon, BookOpenIcon, UserCheckIcon, 
  BriefcaseIcon, ClipboardListIcon, FileDownIcon, 
  ShieldIcon, XIcon, SunIcon, MoonIcon 
} from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/', text: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, show: true },
    { to: '/cursos', text: 'Cursos', icon: <BookOpenIcon className="h-5 w-5" />, show: true },
    { to: '/alunos', text: 'Estudantes', icon: <UsersIcon className="h-5 w-5" />, show: true },
    { to: '/professores', text: 'Docentes', icon: <UserCheckIcon className="h-5 w-5" />, show: true },
    { to: '/parceiros', text: 'Parceiros', icon: <BriefcaseIcon className="h-5 w-5" />, show: true },
    { to: '/enturmacao', text: 'Enturmação', icon: <ClipboardListIcon className="h-5 w-5" />, show: isAdmin },
    { to: '/relatorios', text: 'Relatórios', icon: <FileDownIcon className="h-5 w-5" />, show: true },
    { to: '/usuarios', text: 'Gestão', icon: <ShieldIcon className="h-5 w-5" />, show: isAdmin },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[110] lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[120] w-80 lg:static lg:translate-x-0
        flex flex-col h-screen transition-all duration-500 p-6
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full glass rounded-[2.5rem] shadow-2xl shadow-blue-500/5 relative overflow-hidden border border-white/20 dark:border-white/5">
          
          <div className="absolute top-8 right-8 text-[8px] font-black uppercase tracking-tighter opacity-20 dark:opacity-40 rotate-90 origin-right">
            Build 2025.02
          </div>

          <div className="p-8 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30">
                G
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">GESTÃO</h1>
                <p className="text-[10px] font-bold text-blue-500 tracking-widest mt-1 uppercase">v6.9 Enterprise</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.filter(item => item.show).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `group flex items-center px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-[12px] uppercase tracking-wider ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 translate-x-1' 
                      : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/10'
                  }`
                }
              >
                <span className="transition-transform duration-300 group-hover:scale-125">{item.icon}</span>
                <span className="ml-4">{item.text}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-6 space-y-4">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5 hover:scale-[1.02] transition-transform"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>

            <div className="p-4 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200/50 dark:border-white/5 shadow-inner">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight leading-none">{user?.name.split(' ')[0]}</p>
                      <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">{user?.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                    title="Sair do sistema"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
