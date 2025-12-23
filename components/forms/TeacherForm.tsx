
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
        contact: teacher.contact,
        specialization: teacher.specialization,
      });
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacher) {
      updateTeacher({ ...teacher, ...formData });
    } else {
      addTeacher(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-semibold mb-1">Nome Completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">Telefone / Outro Contato</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
            <label className="block text-sm font-semibold mb-1">Especialização / Formação</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      <div className="flex justify-end space-x-3 mt-8">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">Salvar Docente</button>
      </div>
    </form>
  );
};

export default TeacherForm;
