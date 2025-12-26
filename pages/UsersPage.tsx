
import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import UserForm from '../components/forms/UserForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon, ShieldIcon } from '../components/Icons';
import type { User } from '../types';

const UsersPage = () => {
    const { users, removeUser, refreshData } = useData();
    const { isAdmin, user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
        
        // Atualizar dados ao entrar na página
        refreshData();
        
        // Polling simples a cada 30 segundos para atualizar status online
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (user: User) => {
        if (user.id === currentUser?.id) {
            alert('Você não pode excluir o seu próprio usuário enquanto está logado.');
            return;
        }
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            removeUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const formatLastSeen = (dateString?: string) => {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-4">
                        <ShieldIcon className="h-10 w-10 text-blue-600" />
                        Gestão de Acesso
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Controle de permissões e credenciais do sistema.</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
                >
                    <PlusIcon className="h-5 w-5" />
                    Novo Usuário
                </button>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuário</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Login</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Papel</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-blue-50/20 dark:hover:bg-gray-700/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center font-black text-blue-600">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">{u.name} {u.id === currentUser?.id && '(Você)'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-500 dark:text-gray-400 font-medium">
                                        @{u.username}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center justify-center">
                                            {u.isOnline ? (
                                                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                                                    <span className="relative flex h-2 w-2">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Online</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800 opacity-60">
                                                        <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                                        <span className="text-[9px] font-black text-gray-500 uppercase">Offline</span>
                                                    </div>
                                                    <span className="text-[8px] text-gray-400 mt-1 font-bold">Visto em: {formatLastSeen(u.lastSeen)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                            u.role === 'ADMIN' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(u)}
                                                className="p-3 bg-gray-50 dark:bg-gray-900 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u)}
                                                disabled={u.id === currentUser?.id}
                                                className={`p-3 rounded-xl transition-all ${
                                                    u.id === currentUser?.id 
                                                        ? 'bg-transparent text-gray-200 cursor-not-allowed' 
                                                        : 'bg-gray-50 dark:bg-gray-900 text-rose-500 hover:bg-rose-500 hover:text-white'
                                                }`}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
                <div className="p-2">
                    <UserForm 
                        userToEdit={editingUser} 
                        onSave={() => setIsModalOpen(false)} 
                        onCancel={() => setIsModalOpen(false)} 
                    />
                </div>
            </Modal>

            <ConfirmationDialog 
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Remover Acesso"
                message={`Você tem certeza que deseja remover o acesso de ${userToDelete?.name}? Esta ação é irreversível.`}
            />
        </div>
    );
};

export default UsersPage;
