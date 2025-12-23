
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Modal from '../components/Modal';
import TeacherForm from '../components/forms/TeacherForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
import type { Teacher } from '../types';

const TeachersPage = () => {
  const { teachers, removeTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const handleAdd = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };
  
  const confirmDelete = () => {
    if (teacherToDelete) {
      removeTeacher(teacherToDelete.id);
      setTeacherToDelete(null);
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Corpo Docente</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os professores e instrutores do sistema.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/20 transition-all font-bold">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Professor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar docente por nome, e-mail ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeachers.length > 0 ? filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-2xl transition-all group">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              👨‍🏫
            </div>
            <h3 className="font-black text-lg mb-1 dark:text-white leading-tight">{teacher.name}</h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mb-4 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
              {teacher.specialization}
            </p>
            
            <div className="space-y-1 mb-6 w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 break-all font-medium">{teacher.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{teacher.contact}</p>
            </div>
            
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleEdit(teacher)} title="Editar" className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-colors">
                <EditIcon className="h-5 w-5" />
              </button>
              <button onClick={() => handleDelete(teacher)} title="Excluir" className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 font-bold">Nenhum professor encontrado para sua busca.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeacher ? 'Editar Docente' : 'Novo Docente'}>
        <TeacherForm teacher={editingTeacher} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmationDialog 
        isOpen={!!teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={confirmDelete}
        title="Remover Docente"
        message={`Confirma a exclusão do professor ${teacherToDelete?.name}? Essa ação removerá o registro permanentemente.`}
      />
    </div>
  );
};

export default TeachersPage;
