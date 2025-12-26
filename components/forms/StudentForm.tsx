
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import type { Student, Course } from '../../types';

interface StudentFormProps {
  student: Student | null;
  onSave: () => void;
  onCancel: () => void;
}

const StudentForm = ({ student, onSave, onCancel }: StudentFormProps) => {
  const { addStudent, updateStudent, courses, students } = useData();
  const { isAdmin } = useAuth();
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

  const isEnrolled = student && !!student.courseId;
  // Regra: Bloquear apenas campos de enturmação para operadores se o aluno já estiver em um curso.
  const isEnrollmentReadOnly = isEnrolled && !isAdmin;

  const classOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        cpf: formatCPF(student.cpf),
        contact: formatPhone(student.contact),
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
      .slice(0, 14);
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 14);
    }
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    
    // Bloquear alteração se for campo restrito
    if (isEnrollmentReadOnly && ['courseId', 'class', 'status'].includes(name)) return;

    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === 'contact') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
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

    const cleanPhone = formData.contact.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Telefone inválido. Informe o DDD e o número.');
      return false;
    }

    if (!formData.courseId) return true;

    // Se o curso não mudou (edição de outros campos), não precisa validar conflito de novo
    if (student && student.courseId === formData.courseId) return true;

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (!selectedCourse) return true;

    const conflict = students.find(s => {
      if (student && s.id === student.id) return false;
      
      const sCleanCPF = s.cpf.replace(/\D/g, '');
      if (sCleanCPF === cleanCPF && s.courseId) {
        const otherCourse = courses.find(c => c.id === s.courseId);
        if (otherCourse && otherCourse.period === selectedCourse.period) {
           return true;
        }
      }
      return false;
    });

    if (conflict) {
      const conflictCourse = courses.find(c => c.id === conflict.courseId);
      setError(`Conflito de Turno: Este aluno já possui uma matrícula no turno ${selectedCourse.period} (Curso: ${conflictCourse?.name}).`);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnrollment()) return;

    const finalData = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ''),
      contact: formData.contact.replace(/\D/g, '')
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
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 mb-4 animate-fadeIn">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isEnrollmentReadOnly && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-3 mb-6">
            <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-widest">
              🔒 Vínculo Acadêmico Restrito
            </p>
            <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold">
              Alterações de Curso/Turma exigem permissão de Administrador. Dados de contato podem ser editados.
            </p>
          </div>
        )}

        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Nome Completo</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" 
              placeholder="Ex: João Silva" 
            />
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
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" 
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Celular</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required 
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" 
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Nascimento</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={formData.birthDate} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" 
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Situação</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  disabled={isEnrollmentReadOnly}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all ${isEnrollmentReadOnly ? 'opacity-70 bg-gray-50 dark:bg-gray-800' : ''}`}
                >
                    <option value="CURSANDO">Cursando</option>
                    <option value="APROVADO">Aprovado</option>
                    <option value="REPROVADO">Reprovado</option>
                    <option value="DESISTENTE">Desistente</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Endereço</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all" 
              placeholder="Rua, número, bairro" 
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Curso</label>
              <select 
                name="courseId" 
                value={formData.courseId} 
                onChange={handleChange} 
                disabled={isEnrollmentReadOnly}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all font-medium ${isEnrollmentReadOnly ? 'opacity-70 bg-gray-50 dark:bg-gray-800' : ''}`}
              >
                  <option value="">Nenhum curso</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.period})</option>)}
              </select>
          </div>
          <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight">Letra da Turma</label>
              <select 
                name="class" 
                value={formData.class} 
                onChange={handleChange} 
                disabled={isEnrollmentReadOnly}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all ${isEnrollmentReadOnly ? 'opacity-70 bg-gray-50 dark:bg-gray-800' : ''}`}
              >
                  <option value="">-</option>
                  {classOptions.map(letter => <option key={letter} value={letter}>Turma {letter}</option>)}
              </select>
          </div>
        </div>

      <div className="flex justify-end space-x-3 mt-8 border-t dark:border-gray-700 pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
          Cancelar
        </button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          {student ? 'Salvar Alterações' : 'Confirmar Matrícula'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
