
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import type { Student } from '../types';

const EnrollmentPage = () => {
    const { students, courses, updateStudent } = useData();
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
    const [searchAvailable, setSearchAvailable] = useState('');
    const [searchEnrolled, setSearchEnrolled] = useState('');

    const classOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    const { enrolledStudents, unenrolledStudents } = useMemo(() => {
        if (!selectedCourseId) return { enrolledStudents: [], unenrolledStudents: students };
        
        const enrolled = students.filter(s => s.courseId === selectedCourseId);
        const unenrolled = students.filter(s => !s.courseId || s.courseId !== selectedCourseId);
        
        const filteredEnrolled = enrolled.filter(s => 
            s.name.toLowerCase().includes(searchEnrolled.toLowerCase()) || 
            s.cpf.includes(searchEnrolled.replace(/\D/g, ''))
        );
        
        const filteredUnenrolled = unenrolled.filter(s => 
            s.name.toLowerCase().includes(searchAvailable.toLowerCase()) || 
            s.cpf.includes(searchAvailable.replace(/\D/g, ''))
        );

        return { enrolledStudents: filteredEnrolled, unenrolledStudents: filteredUnenrolled };
    }, [students, selectedCourseId, searchAvailable, searchEnrolled]);

    const handleEnroll = (student: Student) => {
        updateStudent({ ...student, courseId: selectedCourseId });
    };

    const handleUnenroll = (student: Student) => {
        updateStudent({ ...student, courseId: '', class: '' });
    };

    const handleClassChange = (student: Student, newClass: string) => {
        updateStudent({ ...student, class: newClass });
    };

    const getSelectedCourseName = () => {
        const c = courses.find(item => item.id === selectedCourseId);
        return c ? `${c.name} (${c.period})` : 'Nenhum curso selecionado';
    };

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Gestão de Turmas</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Distribua os alunos em seus respectivos cursos e designe as turmas oficiais.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Curso Alvo</label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full md:max-w-md p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-800 dark:text-gray-200 transition-all"
                    >
                        <option value="" disabled>Selecione um curso para gerenciar...</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name} — {course.period}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden lg:block">
                    <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Total Matriculados</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-300">{enrolledStudents.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LADO ESQUERDO: DISPONÍVEIS */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black flex items-center">
                            <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mr-3 text-xl">🔍</span>
                            Disponíveis
                        </h2>
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder="Filtrar por nome ou CPF..." 
                        value={searchAvailable}
                        onChange={(e) => setSearchAvailable(e.target.value)}
                        className="mb-6 w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        <ul className="space-y-3">
                            {unenrolledStudents.length > 0 ? unenrolledStudents.map(student => (
                                <li key={student.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-between group hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all">
                                    <div className="min-w-0 pr-4">
                                      <p className="font-black text-gray-800 dark:text-white truncate">{student.name}</p>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleEnroll(student)} 
                                        disabled={!selectedCourseId}
                                        className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                                    >
                                        Matricular
                                    </button>
                                </li>
                            )) : (
                                <div className="text-center py-20 text-gray-400">
                                    <p className="text-3xl mb-2">🏜️</p>
                                    <p className="text-xs font-bold uppercase">Nenhum aluno disponível</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* LADO DIREITO: MATRICULADOS */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black flex items-center">
                            <span className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mr-3 text-xl">🎓</span>
                            Nesta Turma
                        </h2>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Buscar nesta turma..." 
                        value={searchEnrolled}
                        onChange={(e) => setSearchEnrolled(e.target.value)}
                        className="mb-6 w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        <ul className="space-y-3">
                            {enrolledStudents.length > 0 ? enrolledStudents.map(student => (
                                <li key={student.id} className="p-4 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-between group">
                                    <div className="flex-1 min-w-0 pr-4">
                                      <p className="font-black text-emerald-900 dark:text-emerald-300 truncate">{student.name}</p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <label className="text-[9px] font-black text-emerald-600/60 dark:text-emerald-400/40 uppercase">Designar Turma:</label>
                                        <select 
                                            value={student.class || ''} 
                                            onChange={(e) => handleClassChange(student, e.target.value)}
                                            className="text-[10px] font-black bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                                        >
                                            <option value="">A definir</option>
                                            {classOptions.map(letter => (
                                                <option key={letter} value={letter}>TURMA {letter}</option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                    <button 
                                        onClick={() => handleUnenroll(student)} 
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all border border-rose-100 dark:border-rose-900/30 shadow-sm"
                                    >
                                        Remover
                                    </button>
                                </li>
                            )) : (
                                <div className="text-center py-20 text-gray-400">
                                    <p className="text-3xl mb-2">📜</p>
                                    <p className="text-xs font-bold uppercase">Lista vazia para este curso</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentPage;
