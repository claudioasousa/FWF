import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import type { Teacher } from '../../types';

interface TeacherFormProps {
  teacher: Teacher | null;
  onSave: () => void;
  onCancel: () => void;
}

const TeacherForm = ({ teacher, onSave, onCancel }: TeacherFormProps) => {
  const { addTeacher, updateTeacher } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    specialization: '',
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email || '',
        contact: formatPhone(teacher.contact),
        specialization: teacher.specialization,
      });
    }
  }, [teacher]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contact') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      contact: formData.contact.replace(/\D/g, '')
    };

    if (teacher) {
      updateTeacher({ ...teacher, ...finalData });
    } else {
      addTeacher(finalData);
    }
    onSave();
  };

  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight";
  const inputClass = "w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nome do Docente</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Ex: Prof. Dr. Carlos Alberto" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>E-mail Profissional</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="email@instituicao.com" />
        </div>
        <div>
          <label className={labelClass}>Celular / WhatsApp</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className={inputClass} placeholder="(00) 00000-0000" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Área de Especialização</label>
        <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className={inputClass} placeholder="Ex: Desenvolvimento Web, IA, Gestão" />
      </div>

      <div className="flex justify-end space-x-3 mt-8 border-t dark:border-gray-700 pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancelar</button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          {teacher ? 'Salvar Alterações' : 'Cadastrar Professor'}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;