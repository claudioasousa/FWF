
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Student, Course } from '../types';

const EnrollmentPage = () => {
    const { students, courses, updateStudent } = useData();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
    const [searchAvailable, setSearchAvailable] = useState('');
    const [searchEnrolled, setSearchEnrolled] = useState('');

    // Safety check: redirect if not admin
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

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
        if (!selectedCourseId) return;

        const targetCourse = courses.find(c => c.id === selectedCourseId);
        if (!targetCourse) return;

        // Check if student (CPF) has a course in the same turn/period with overlapping dates
        const cleanCPF = student.cpf.replace(/\D/g, '');
        const conflict = students.find(s => {
            if (s.id === student.id) return false;
            
            const sCleanCPF = s.cpf.replace(/\D/g, '');
            if (sCleanCPF === cleanCPF && s.courseId) {
                const otherCourse = courses.find(c => c.id === s.courseId);
                if (otherCourse && otherCourse.period === targetCourse.period) {
                    // Date overlap check
                    const overlap = (targetCourse.startDate <= otherCourse.endDate) && 
                                    (otherCourse.startDate <= targetCourse.endDate);
                    return overlap;
                }
            }
            return false;
        });

        if (conflict) {
            const conflictCourse = courses.find(c => c.id === conflict.courseId);
            alert(`Conflito de Horário: Este aluno já está matriculado no curso "${conflictCourse?.name}" no mesmo turno (${targetCourse.period}) com datas coincidentes.`);
            return;
        }

        updateStudent({ ...student, courseId: selectedCourseId });
    };

    const handleUnenroll = (student: Student) => {
        updateStudent({ ...student, courseId: '', class: '' });
    };

    const handleClassChange = (student: Student, newClass: string) => {
        updateStudent({ ...student, class: newClass });
    };

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Enturmação</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Distribua os alunos entre as letras A até H.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Curso Ativo para Gestão</label>
                <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full md:max-w-md p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                    <option value="" disabled>Selecione um curso...</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name} — {course.period}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* DISPONÍVEIS */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black mb-6">Disponíveis</h2>
                    <input 
                        type="text" 
                        placeholder="Filtrar por nome ou CPF..." 
                        value={searchAvailable}
                        onChange={(e) => setSearchAvailable(e.target.value)}
                        className="mb-6 w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {unenrolledStudents.length > 0 ? unenrolledStudents.map(student => (
                            <li key={student.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-between group border border-transparent hover:border-blue-100 transition-all">
                                <div className="min-w-0 pr-4">
                                  <p className="font-black text-gray-800 dark:text-white truncate">{student.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
                                </div>
                                <button 
                                    onClick={() => handleEnroll(student)} 
                                    disabled={!selectedCourseId}
                                    className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                                >
                                    Matricular
                                </button>
                            </li>
                        )) : <p className="text-center text-gray-400 py-10">Nenhum aluno encontrado.</p>}
                    </ul>
                </div>

                {/* MATRICULADOS */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black mb-6">Neste Curso</h2>
                    <input 
                        type="text" 
                        placeholder="Filtrar nesta turma..." 
                        value={searchEnrolled}
                        onChange={(e) => setSearchEnrolled(e.target.value)}
                        className="mb-6 w-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {enrolledStudents.length > 0 ? enrolledStudents.map(student => (
                            <li key={student.id} className="p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl flex items-center justify-between border border-blue-100/50">
                                <div className="flex-1 min-w-0 pr-4">
                                  <p className="font-black text-gray-800 dark:text-white truncate">{student.name}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Turma:</label>
                                    <select 
                                        value={student.class || ''} 
                                        onChange={(e) => handleClassChange(student, e.target.value)}
                                        className="text-[10px] font-black bg-white dark:bg-gray-800 border rounded px-2 py-0.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">-</option>
                                        {classOptions.map(letter => (
                                            <option key={letter} value={letter}>{letter}</option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                                <button onClick={() => handleUnenroll(student)} className="px-4 py-2 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-50 rounded-xl transition-all">
                                    Remover
                                </button>
                            </li>
                        )) : <p className="text-center text-gray-400 py-10">Nenhum aluno matriculado neste curso.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentPage;
