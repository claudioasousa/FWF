
import React, { ReactNode } from 'react';

// FIX: Use React.PropsWithChildren to correctly type components that accept children.
// This removes the `children` property from the interface and adds it via PropsWithChildren.
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal = ({ isOpen, onClose, title, children }: React.PropsWithChildren<ModalProps>) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
