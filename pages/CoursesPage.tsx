
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import CourseForm from '../components/forms/CourseForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
import type { Course } from '../types';

const CoursesPage = () => {
  const { courses, partners, teachers, removeCourse } = useData();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartner, setFilterPartner] = useState<string>('Todos');

  const getPartnerName = (partnerId?: string) => {
    if (!partnerId) return 'Nenhum';
    return partners.find(p => p.id === partnerId)?.companyName || 'N/A';
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Inativo': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
      case 'Concluído': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const partnerMatch = filterPartner === 'Todos' || course.partnerId === filterPartner;
      const searchMatch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.location.toLowerCase().includes(searchTerm.toLowerCase());
      return partnerMatch && searchMatch;
    });
  }, [courses, filterPartner, searchTerm]);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    setCourseToDelete(course);
  };
  
  const confirmDelete = () => {
    if (courseToDelete) {
      removeCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cursos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie a oferta educacional e parceiros.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center shadow-xl shadow-blue-500/30 transition-all font-bold group">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Curso
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Buscar curso por nome ou local..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          <div className="md:w-64">
            <select
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Todos">Todos os Parceiros</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
            </select>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? filteredCourses.map(course => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col group">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusBadgeClass(course.status)}`}>
                  {course.status}
                </span>
                <div className="flex gap-1">
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(course)} className="p-2 text-gray-400 hover:text-blue-600 transition-all">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(course)} className="p-2 text-gray-400 hover:text-red-600 transition-all">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {!isAdmin && (
                    <span className="text-[9px] font-black text-gray-300 uppercase py-2">Somente Leitura</span>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {course.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-3">⏱️</span>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Carga Horária</p>
                    <p className="font-bold dark:text-gray-300">{course.workload} horas</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-3">🏢</span>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Parceiro</p>
                    <p className="font-bold dark:text-gray-300 truncate">{getPartnerName(course.partnerId)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-xs font-bold dark:text-gray-400">{course.period}</span>
              <span className="inline-block px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-[11px] font-bold shadow-sm text-gray-600 dark:text-gray-400">
                {course.location}
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhum curso encontrado.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? 'Editar Curso' : 'Novo Curso'}>
        <div className="max-h-[80vh] overflow-y-auto px-1">
          <CourseForm course={editingCourse} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
        </div>
      </Modal>

      <ConfirmationDialog 
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={confirmDelete}
        title="Remover Curso"
        message={`Deseja excluir o curso "${courseToDelete?.name}"?`}
      />
    </div>
  );
};

export default CoursesPage;
