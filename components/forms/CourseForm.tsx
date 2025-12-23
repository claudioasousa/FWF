
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import type { Course } from '../../types';

interface CourseFormProps {
  course: Course | null;
  onSave: () => void;
  onCancel: () => void;
}

const CourseForm = ({ course, onSave, onCancel }: CourseFormProps) => {
  const { addCourse, updateCourse, teachers, partners } = useData();
  const [formData, setFormData] = useState({
    name: '',
    workload: 0,
    startDate: '',
    endDate: '',
    period: 'Manhã' as Course['period'],
    location: '',
    partnerId: '',
    teacherIds: [] as string[],
    status: 'Ativo' as Course['status'],
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        workload: course.workload,
        startDate: course.startDate,
        endDate: course.endDate,
        period: course.period,
        location: course.location,
        partnerId: course.partnerId || '',
        teacherIds: course.teacherIds || [],
        status: course.status || 'Ativo',
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'workload' ? parseInt(value) || 0 : value }));
  };

  const toggleTeacher = (teacherId: string) => {
    setFormData(prev => {
        const isSelected = prev.teacherIds.includes(teacherId);
        return {
            ...prev,
            teacherIds: isSelected 
                ? prev.teacherIds.filter(id => id !== teacherId)
                : [...prev.teacherIds, teacherId]
        };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course) {
      updateCourse({ ...course, ...formData });
    } else {
      addCourse(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Identificação do Curso</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Informática Básica"/>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Carga Horária (h)</label>
              <input type="number" name="workload" value={formData.workload} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold"/>
          </div>
          <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Estado Atual</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option value="Ativo">🟢 Ativo</option>
                  <option value="Inativo">🔴 Inativo</option>
                  <option value="Concluído">🔵 Concluído</option>
              </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Turno</label>
              <select name="period" value={formData.period} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option value="Manhã">🌅 Manhã</option>
                  <option value="Tarde">☀️ Tarde</option>
                  <option value="Noite">🌙 Noite</option>
              </select>
          </div>
          <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Início das Aulas</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold"/>
          </div>
        </div>

        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Local da Oferta</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Sala 02 ou Polo Virtual"/>
        </div>

        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Parceiro Estratégico</label>
            <select name="partnerId" value={formData.partnerId} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                <option value="">Sem Patrocínio Direto</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
            </select>
        </div>

        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Atribuir Docentes</label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-40 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                {teachers.length > 0 ? teachers.map(t => (
                    <label key={t.id} className="flex items-center px-4 py-2 hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                        <input 
                            type="checkbox" 
                            checked={formData.teacherIds.includes(t.id)} 
                            onChange={() => toggleTeacher(t.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.name}</span>
                    </label>
                )) : (
                    <p className="p-4 text-xs text-center text-gray-400 italic">Cadastre professores primeiro.</p>
                )}
            </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t dark:border-gray-700">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Cancelar</button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
                {course ? 'Salvar Alterações' : 'Criar Curso'}
            </button>
        </div>
    </form>
  );
};

export default CourseForm;
