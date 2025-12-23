
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Modal from '../components/Modal';
import CourseForm from '../components/forms/CourseForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon, BookOpenIcon } from '../components/Icons';
import type { Course } from '../types';

const CoursesPage = () => {
  const { courses, partners, teachers, removeCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  
  // Estados de Filtro e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterPeriod, setFilterPeriod] = useState<string>('Todos');
  const [filterTeacher, setFilterTeacher] = useState<string>('Todos');
  const [filterPartner, setFilterPartner] = useState<string>('Todos');

  const getPartnerName = (partnerId?: string) => {
    if (!partnerId) return 'Nenhum';
    return partners.find(p => p.id === partnerId)?.companyName || 'N/A';
  };
  
  const getTeacherNames = (teacherIds: string[]) => {
    if (!teacherIds || teacherIds.length === 0) return 'Não atribuído';
    return teacherIds.map(id => teachers.find(t => t.id === id)?.name || 'N/A').join(', ');
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Inativo': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
      case 'Concluído': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Estatísticas Rápidas
  const stats = useMemo(() => {
    return {
      total: courses.length,
      active: courses.filter(c => c.status === 'Ativo').length,
      completed: courses.filter(c => c.status === 'Concluído').length,
      inactive: courses.filter(c => c.status === 'Inativo').length
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const statusMatch = filterStatus === 'Todos' || course.status === filterStatus;
      const periodMatch = filterPeriod === 'Todos' || course.period === filterPeriod;
      const teacherMatch = filterTeacher === 'Todos' || (course.teacherIds && course.teacherIds.includes(filterTeacher));
      const partnerMatch = filterPartner === 'Todos' || course.partnerId === filterPartner;
      const searchMatch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.location.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && periodMatch && teacherMatch && partnerMatch && searchMatch;
    });
  }, [courses, filterStatus, filterPeriod, filterTeacher, filterPartner, searchTerm]);

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

  const resetFilters = () => {
    setFilterStatus('Todos');
    setFilterPeriod('Todos');
    setFilterTeacher('Todos');
    setFilterPartner('Todos');
    setSearchTerm('');
  };

  const statusOptions = ['Todos', 'Ativo', 'Inativo', 'Concluído'];
  const periodOptions = ['Todos', 'Manhã', 'Tarde', 'Noite'];

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Catálogo de Cursos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie, filtre e acompanhe o status da sua oferta educacional.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center shadow-xl shadow-blue-500/30 transition-all font-bold group">
            <PlusIcon className="h-5 w-5 mr-2 group-hover:scale-125 transition-transform" />
            Criar Novo Curso
        </button>
      </div>

      {/* Cards de Estatísticas Rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Ativos', value: stats.active, color: 'emerald' },
          { label: 'Concluídos', value: stats.completed, color: 'indigo' },
          { label: 'Inativos', value: stats.inactive, color: 'rose' }
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
            <span className={`text-2xl font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Painel de Busca e Filtros */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Pesquisar curso por nome ou local..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-50 dark:border-gray-700">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Período</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Professor Responsável</label>
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Todos">Todos os Professores</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1">Parceiro / Patrocinador</label>
            <select
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Todos">Todos os Parceiros</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
            </select>
          </div>
        </div>
        
        { (filterStatus !== 'Todos' || filterPeriod !== 'Todos' || filterTeacher !== 'Todos' || filterPartner !== 'Todos' || searchTerm) && (
          <div className="flex justify-end pt-2">
            <button onClick={resetFilters} className="text-sm font-bold text-rose-500 hover:underline flex items-center">
              <TrashIcon className="h-4 w-4 mr-1" /> Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? filteredCourses.map(course => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col group">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusBadgeClass(course.status)}`}>
                  {course.status}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(course)} title="Editar" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(course)} title="Excluir" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-3 text-lg">⏱️</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Carga Horária</p>
                    <p className="font-bold dark:text-gray-300">{course.workload} horas</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-3 text-lg">🏢</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Parceiro</p>
                    <p className="font-bold dark:text-gray-300 truncate">{getPartnerName(course.partnerId)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-3 text-lg">👨‍🏫</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Professores</p>
                    <p className="font-bold dark:text-gray-300 line-clamp-1">{getTeacherNames(course.teacherIds)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Início em</span>
                <span className="text-xs font-bold dark:text-gray-400">{new Date(course.startDate).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-[11px] font-bold shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  {course.period} • {course.location}
                </span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Nada por aqui...</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Tente ajustar seus filtros ou busca para encontrar o que procura.</p>
            <button 
              onClick={resetFilters}
              className="mt-6 text-blue-600 dark:text-blue-400 font-black hover:underline px-6 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
            >
              Resetar Filtros
            </button>
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
        message={`Deseja excluir permanentemente o curso "${courseToDelete?.name}"? Todas as matrículas associadas perderão a referência.`}
      />
    </div>
  );
};

export default CoursesPage;
