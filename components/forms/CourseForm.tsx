
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
    startTime: '',
    endTime: '',
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
        startTime: course.startTime || '',
        endTime: course.endTime || '',
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

  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 tracking-tight";
  const inputClass = "w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className={labelClass}>Nome do Curso</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Ex: Informática para Negócios" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass}>Carga Horária (h)</label>
              <input type="number" name="workload" value={formData.workload} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Concluído">Concluído</option>
              </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass}>Data de Início</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
              <label className={labelClass}>Data de Término</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass}>Hora de Início</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
              <label className={labelClass}>Hora de Término</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={labelClass}>Turno / Período</label>
              <select name="period" value={formData.period} onChange={handleChange} className={inputClass}>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
              </select>
          </div>
          <div>
              <label className={labelClass}>Local ou Polo</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className={inputClass} placeholder="Sala 01, Polo X..." />
          </div>
        </div>

        <div>
            <label className={labelClass}>Parceiro Estratégico</label>
            <select name="partnerId" value={formData.partnerId} onChange={handleChange} className={inputClass}>
                <option value="">Sem patrocínio direto</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
            </select>
        </div>

        <div>
            <label className={labelClass}>Corpo Docente Atribuído</label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-32 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
                {teachers.length > 0 ? teachers.map(t => (
                    <label key={t.id} className="flex items-center px-4 py-2 hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                        <input 
                            type="checkbox" 
                            checked={formData.teacherIds.includes(t.id)} 
                            onChange={() => toggleTeacher(t.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.name}</span>
                    </label>
                )) : (
                    <p className="p-4 text-xs text-center text-gray-400 font-bold uppercase italic">Nenhum professor cadastrado.</p>
                )}
            </div>
        </div>

      <div className="flex justify-end space-x-3 mt-8 border-t dark:border-gray-700 pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancelar</button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          {course ? 'Salvar Alterações' : 'Criar Novo Curso'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
