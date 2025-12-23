
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

// FIX: Use React.PropsWithChildren to correctly type components that accept children.
const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
