
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import type { Student, Course } from '../../types';

interface StudentFormProps {
  student: Student | null;
  onSave: () => void;
  onCancel: () => void;
}

const StudentForm = ({ student, onSave, onCancel }: StudentFormProps) => {
  const { addStudent, updateStudent, courses, students } = useData();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    contact: '',
    birthDate: '',
    address: '',
    courseId: '',
    status: 'CURSANDO' as Student['status'],
    class: '',
  });

  const classOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        cpf: formatCPF(student.cpf),
        contact: student.contact,
        birthDate: student.birthDate,
        address: student.address,
        courseId: student.courseId,
        status: student.status,
        class: student.class,
      });
    }
  }, [student]);

  function formatCPF(value: string) {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateEnrollment = () => {
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      setError('CPF inválido. Deve conter 11 dígitos.');
      return false;
    }

    if (!formData.courseId) return true;

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (!selectedCourse) return true;

    // Busca conflitos: mesmo CPF em curso no mesmo período
    const conflict = students.find(s => {
      if (student && s.id === student.id) return false;
      
      const sCleanCPF = s.cpf.replace(/\D/g, '');
      if (sCleanCPF === cleanCPF) {
        const otherCourse = courses.find(c => c.id === s.courseId);
        // Se o outro curso for no mesmo período, gera conflito
        return otherCourse && otherCourse.period === selectedCourse.period;
      }
      return false;
    });

    if (conflict) {
      const conflictCourse = courses.find(c => c.id === conflict.courseId);
      setError(`Conflito: Este CPF já possui matrícula no período ${selectedCourse.period} (Curso: ${conflictCourse?.name}).`);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnrollment()) return;

    const finalData = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, '')
    };

    if (student) {
      updateStudent({ ...student, ...finalData });
    } else {
      addStudent(finalData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 mb-4 animate-pulse">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Nome Completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" placeholder="Ex: João Silva" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">CPF</label>
                <input 
                  type="text" 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={handleChange} 
                  required 
                  placeholder="000.000.000-00"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 outline-none transition-all dark:bg-gray-700 ${error?.includes('CPF') ? 'border-red-500 ring-red-200' : 'dark:border-gray-600 focus:ring-blue-500'}`} 
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Nascimento</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Curso</label>
            <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all font-medium">
                <option value="">Nenhum curso selecionado</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.period}
                  </option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Letra da Turma</label>
                <select name="class" value={formData.class} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all">
                    <option value="">Sem Turma</option>
                    {classOptions.map(letter => (
                        <option key={letter} value={letter}>Turma {letter}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Situação</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all">
                    <option value="CURSANDO">Cursando</option>
                    <option value="APROVADO">Aprovado</option>
                    <option value="REPROVADO">Reprovado</option>
                    <option value="DESISTENTE">Desistente</option>
                </select>
            </div>
        </div>

      <div className="flex justify-end space-x-3 mt-8 border-t dark:border-gray-700 pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancelar</button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          {student ? 'Salvar Alterações' : 'Confirmar Matrícula'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
