
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import StudentForm from '../components/forms/StudentForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
import type { Student } from '../types';

const StudentsPage = () => {
  const { students, courses, removeStudent } = useData();
  const { isAdmin } = useAuth();
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
      case 'APROVADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-blue-200';
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
    <div className="animate-fadeIn max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Estudantes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Controle acadêmico e emissão de certificados.</p>
        </div>
        <button onClick={handleAdd} className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 flex items-center justify-center transition-all shadow-xl shadow-blue-500/20 font-black active:scale-95">
          <PlusIcon className="h-5 w-5 mr-2" />
          Cadastrar Aluno
        </button>
      </div>

      <div className="relative group">
        <input
          type="text"
          placeholder="Busque por nome, CPF ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-lg"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors text-xl">🔍</span>
      </div>

      <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm rounded-[40px] overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Documento</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Matrícula</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredStudents.length > 0 ? filteredStudents.map(student => {
                const isEnrolled = !!student.courseId;
                const canEdit = isAdmin || !isEnrolled;

                return (
                  <tr key={student.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 text-white font-black shadow-lg shadow-blue-500/20">
                              {student.name.charAt(0)}
                          </div>
                          <div className="text-sm font-black text-gray-900 dark:text-white">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-xs text-gray-500 font-mono font-bold">{formatCPFDisplay(student.cpf)}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {getCourseName(student.courseId)}
                          {student.class && <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-black border border-gray-200 dark:border-gray-600">TURMA {student.class}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-xl tracking-wider ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit ? (
                            <button onClick={() => handleEdit(student)} className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl transition-all" title="Editar">
                                <EditIcon className="h-5 w-5" />
                            </button>
                          ) : (
                            <span className="p-3 text-gray-300 dark:text-gray-600 cursor-not-allowed" title="Edição bloqueada (Aluno Enturmado)">
                              🔒
                            </span>
                          )}
                          {isAdmin && (
                            <button onClick={() => handleDelete(student)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all" title="Excluir">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold uppercase text-xs">Nenhum registro encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-1 gap-4">
        {filteredStudents.length > 0 ? filteredStudents.map(student => {
          const isEnrolled = !!student.courseId;
          const canEdit = isAdmin || !isEnrolled;

          return (
            <div key={student.id} className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black mr-4">{student.name.charAt(0)}</div>
                      <div>
                          <h3 className="font-black text-gray-900 dark:text-white leading-tight">{student.name}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatCPFDisplay(student.cpf)}</p>
                      </div>
                  </div>
                  <span className={`px-3 py-1 text-[9px] font-black rounded-lg ${getStatusColor(student.status)}`}>
                      {student.status}
                  </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl mb-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Matrícula Atual</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {getCourseName(student.courseId)}
                      {student.class && <span className="ml-2 font-black text-blue-500">Turma {student.class}</span>}
                  </p>
              </div>
              <div className="flex gap-2">
                  {canEdit ? (
                    <button onClick={() => handleEdit(student)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-black text-[10px] uppercase text-gray-600 dark:text-gray-300">Editar</button>
                  ) : (
                    <div className="flex-1 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl font-black text-[10px] uppercase text-gray-400 text-center flex items-center justify-center gap-2">
                      🔒 Bloqueado
                    </div>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleDelete(student)} className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl font-black text-[10px] uppercase text-red-600">Excluir</button>
                  )}
              </div>
            </div>
          );
        }) : <div className="text-center py-20 text-gray-400 font-black">LISTA VAZIA</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Editar Registro' : 'Novo Aluno'}>
        <div className="max-h-[85vh] overflow-y-auto px-1 custom-scrollbar">
            <StudentForm student={editingStudent} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <ConfirmationDialog 
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        title="Encerrar Matrícula"
        message={`Você deseja excluir permanentemente o aluno ${studentToDelete?.name}?`}
      />
    </div>
  );
};

export default StudentsPage;
