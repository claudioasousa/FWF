
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal = ({ isOpen, onClose, title, children }: React.PropsWithChildren<ModalProps>) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[150] flex justify-center items-center p-4 transition-all" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;