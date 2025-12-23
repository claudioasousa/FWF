
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Modal from '../components/Modal';
import StudentForm from '../components/forms/StudentForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
import type { Student } from '../types';

const StudentsPage = () => {
  const { students, courses, removeStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const getCourseName = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.name || 'Não Matriculado';
  };

  const formatCPFDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return value;
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CURSANDO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
      case 'APROVADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
      case 'REPROVADO': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
      case 'DESISTENTE': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.cpf.includes(term.replace(/\D/g, '')) ||
      getCourseName(student.courseId).toLowerCase().includes(term)
    );
  }, [students, searchTerm, courses]);

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
  };
  
  const confirmDelete = () => {
    if (studentToDelete) {
      removeStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Quadro de Alunos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gestão centralizada de matrículas e informações acadêmicas.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400">🔍</span>
          </div>
          <button onClick={handleAdd} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 flex items-center justify-center transition-all shadow-xl shadow-blue-500/30 font-black">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Aluno
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Educando</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Documento (CPF)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Curso Matriculado</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Situação</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-50 dark:divide-gray-700">
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-4 text-blue-600 font-black">
                            {student.name.charAt(0)}
                        </div>
                        <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{student.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg w-fit">
                        {formatCPFDisplay(student.cpf)}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {getCourseName(student.courseId)}
                        {student.class && <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-black">TURMA {student.class}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-full tracking-wider ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(student)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all" title="Editar">
                            <EditIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(student)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all" title="Remover">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="text-5xl mb-4">👤</div>
                    <h3 className="text-lg font-bold text-gray-400 uppercase tracking-tighter">Nenhum aluno encontrado</h3>
                    <p className="text-xs text-gray-400 mt-1">Tente ajustar seus critérios de busca ou cadastre um novo educando.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Editar Registro' : 'Cadastro de Educando'}>
        <div className="max-h-[85vh] overflow-y-auto px-1">
            <StudentForm student={editingStudent} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <ConfirmationDialog 
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        title="Encerrar Registro"
        message={`Você está prestes a remover o aluno "${studentToDelete?.name}". Todas as informações de frequência e notas vinculadas a este CPF serão excluídas permanentemente. Deseja continuar?`}
      />
    </div>
  );
};

export default StudentsPage;
