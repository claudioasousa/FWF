
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import type { User } from '../../types';

interface UserFormProps {
  userToEdit: User | null;
  onSave: () => void;
  onCancel: () => void;
}

const UserForm = ({ userToEdit, onSave, onCancel }: UserFormProps) => {
  const { addUser, updateUser } = useData();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'OPERATOR' as User['role'],
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        username: userToEdit.username,
        password: userToEdit.password || '',
        role: userToEdit.role,
      });
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userToEdit) {
      updateUser({ ...userToEdit, ...formData });
    } else {
      addUser(formData);
    }
    onSave();
  };

  const labelClass = "block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-2 ml-1";
  const inputClass = "w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-white dark:border-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Nome Completo</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Ex: Maria Souza" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Usuário (Login)</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className={inputClass} placeholder="mariasouza" />
        </div>
        <div>
          <label className={labelClass}>Senha de Acesso</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Nível de Permissão</label>
        <div className="grid grid-cols-2 gap-3">
            <button 
                type="button" 
                onClick={() => setFormData(p => ({...p, role: 'OPERATOR'}))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${formData.role === 'OPERATOR' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-transparent opacity-60'}`}
            >
                <span className="text-sm font-black mb-1">Operador</span>
                <span className="text-[9px] font-bold text-gray-400 text-center">Visualização e edições básicas</span>
            </button>
            <button 
                type="button" 
                onClick={() => setFormData(p => ({...p, role: 'ADMIN'}))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${formData.role === 'ADMIN' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800 bg-transparent opacity-60'}`}
            >
                <span className="text-sm font-black mb-1">Admin</span>
                <span className="text-[9px] font-bold text-gray-400 text-center">Controle total e gestão de acesso</span>
            </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-600 transition-all">Cancelar</button>
        <button type="submit" className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-[10px] uppercase tracking-widest">
          {userToEdit ? 'Salvar Alterações' : 'Criar Usuário'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
