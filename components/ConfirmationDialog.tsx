
import React from 'react';
import Modal from './Modal';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{message}</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button 
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    Cancelar Operação
                </button>
                <button 
                    onClick={onConfirm}
                    className="px-6 py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
                >
                    Sim, Confirmar Exclusão
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default ConfirmationDialog;
