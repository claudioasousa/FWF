
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
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
                Cancelar
            </button>
            <button 
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Confirmar Exclusão
            </button>
        </div>
    </Modal>
  );
};

export default ConfirmationDialog;
