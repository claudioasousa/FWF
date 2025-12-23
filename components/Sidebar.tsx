
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, ClipboardListIcon, FileDownIcon } from './Icons';

const navItems = [
  { to: '/', text: 'Início', icon: <HomeIcon className="h-5 w-5" /> },
  { to: '/cursos', text: 'Cursos', icon: <BookOpenIcon className="h-5 w-5" /> },
  { to: '/alunos', text: 'Alunos', icon: <UsersIcon className="h-5 w-5" /> },
  { to: '/professores', text: 'Professores', icon: <UserCheckIcon className="h-5 w-5" /> },
  { to: '/parceiros', text: 'Parceiros', icon: <BriefcaseIcon className="h-5 w-5" /> },
  { to: '/enturmacao', text: 'Enturmação', icon: <ClipboardListIcon className="h-5 w-5" /> },
  { to: '/relatorios', text: 'Relatórios', icon: <FileDownIcon className="h-5 w-5" /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-shrink-0 flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Gestão Cursos</h1>
      </div>
      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                    isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white border-r-4 border-blue-500' : ''
                  }`
                }
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-center text-gray-400">Modo de Armazenamento Local</p>
      </div>
    </aside>
  );
};

export default Sidebar;
