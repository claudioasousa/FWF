
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, ClipboardListIcon, FileDownIcon, XIcon } from './Icons';

const navItems = [
  { to: '/', text: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
  { to: '/cursos', text: 'Cursos', icon: <BookOpenIcon className="h-5 w-5" /> },
  { to: '/alunos', text: 'Estudantes', icon: <UsersIcon className="h-5 w-5" /> },
  { to: '/professores', text: 'Docentes', icon: <UserCheckIcon className="h-5 w-5" /> },
  { to: '/parceiros', text: 'Parceiros', icon: <BriefcaseIcon className="h-5 w-5" /> },
  { to: '/enturmacao', text: 'Enturmação', icon: <ClipboardListIcon className="h-5 w-5" /> },
  { to: '/relatorios', text: 'Relatórios', icon: <FileDownIcon className="h-5 w-5" /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay Escurecido com Desfoque */}
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
        {/* Header do Sidebar */}
        <div className="p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">G</div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Gestão</h1>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-rose-500 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Itens de Navegação */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
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
              {/* FIX: Using children as a function to access the 'isActive' state from NavLink context */}
              {({ isActive }) => (
                <>
                  <span className={`transition-transform duration-300 group-hover:scale-110`}>{item.icon}</span>
                  <span className="ml-4">{item.text}</span>
                  {/* Indicador de item ativo */}
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Rodapé do Sidebar */}
        <div className="p-8">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Suporte Técnico</p>
             <p className="text-xs font-bold text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 cursor-pointer">Central de Ajuda</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;