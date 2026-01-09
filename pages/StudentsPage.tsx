
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
      case 'CURSANDO': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
      case 'APROVADO': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20';
      case 'REPROVADO': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20';
      case 'DESISTENTE': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20';
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
    <div className="animate-fadeIn space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Estudantes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium">Controle acadêmico v6.9</p>
        </div>
        <button onClick={handleAdd} className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-[2rem] hover:bg-blue-700 flex items-center justify-center transition-all shadow-2xl shadow-blue-500/20 font-black text-[13px] uppercase tracking-widest active:scale-95">
          <PlusIcon className="h-5 w-5 mr-3" />
          Cadastrar Aluno
        </button>
      </div>

      <div className="relative group max-w-3xl">
        <input
          type="text"
          placeholder="Busque por nome, CPF ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-lg"
        />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
      </div>

      <div className="hidden lg:block">
        <div className="overflow-hidden bg-transparent">
          <table className="min-w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left">
                <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aluno</th>
                <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificação</th>
                <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curso/Turma</th>
                <th className="px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                  <tr key={student.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <td className="px-8 py-6 first:rounded-l-[2rem]">
                      <div className="flex items-center">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-5 text-white font-black text-xl shadow-lg shadow-blue-500/10">
                              {student.name.charAt(0)}
                          </div>
                          <div className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-500 font-mono font-bold tracking-tight">{formatCPFDisplay(student.cpf)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {getCourseName(student.courseId)}
                          {student.class && <span className="ml-3 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-black border border-slate-200 dark:border-white/5 uppercase">Turma {student.class}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-5 py-2 inline-flex text-[10px] font-black rounded-xl tracking-[0.1em] uppercase ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right last:rounded-r-[2rem]">
                      <div className="flex justify-end gap-3">
                          <button onClick={() => handleEdit(student)} className="p-3 text-blue-500 bg-blue-500/5 hover:bg-blue-500 hover:text-white rounded-2xl transition-all" title="Editar">
                              <EditIcon className="h-5 w-5" />
                          </button>
                          {isAdmin && (
                            <button onClick={() => handleDelete(student)} className="p-3 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all" title="Excluir">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
              )) : (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">Nenhum registro v6.9 localizado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-1 gap-6">
        {filteredStudents.map(student => (
            <div key={student.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mr-5 shadow-xl shadow-blue-500/20">{student.name.charAt(0)}</div>
                      <div>
                          <h3 className="font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{student.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatCPFDisplay(student.cpf)}</p>
                      </div>
                  </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] mb-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matrícula</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {getCourseName(student.courseId)}
                      {student.class && <span className="ml-3 font-black text-blue-500">Turma {student.class}</span>}
                  </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                  <span className={`px-4 py-2 text-[9px] font-black rounded-xl uppercase ${getStatusColor(student.status)}`}>
                      {student.status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(student)} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600"><EditIcon className="h-5 w-5" /></button>
                    {isAdmin && <button onClick={() => handleDelete(student)} className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600"><TrashIcon className="h-5 w-5" /></button>}
                  </div>
              </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Atualizar Perfil' : 'Cadastro v6.9'}>
        <div className="max-h-[85vh] overflow-y-auto px-1 custom-scrollbar">
            <StudentForm student={editingStudent} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <ConfirmationDialog 
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        title="Remover Registro"
        message={`Confirmar a exclusão permanente de ${studentToDelete?.name} do sistema v6.9?`}
      />
    </div>
  );
};

export default StudentsPage;