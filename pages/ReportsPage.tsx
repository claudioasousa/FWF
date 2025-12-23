
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { generateStudentListPdf, generateStudentsByCoursePdf } from '../services/pdfGenerator';
import type { Course } from '../types';

const ReportsPage = () => {
    const { students, courses } = useData();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleGenerateStudentList = () => {
        generateStudentListPdf(students);
    };
    
    const handleGenerateStudentsByCourse = () => {
        if (selectedCourse) {
            const courseStudents = students.filter(s => s.courseId === selectedCourse.id);
            generateStudentsByCoursePdf(courseStudents, selectedCourse);
        } else {
            alert('Por favor, selecione um curso.');
        }
    };

    return (
        <div className="animate-fadeIn">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Relatórios e Exportação</h1>
              <p className="text-gray-600 dark:text-gray-400">Gere arquivos PDF para controle impresso.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-2xl mb-6">📁</div>
                    <h2 className="text-xl font-bold mb-2">Lista Geral de Alunos</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        Exporta todos os alunos registrados no sistema com seus dados básicos e situação cadastral.
                    </p>
                    <button
                        onClick={handleGenerateStudentList}
                        className="mt-auto w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        Exportar PDF Completo
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-2xl mb-6">🏫</div>
                    <h2 className="text-xl font-bold mb-2">Pauta por Turma</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                        Selecione um curso específico para gerar a lista de presença e pauta de alunos.
                    </p>
                    <select
                        onChange={(e) => {
                            const course = courses.find(c => c.id === e.target.value) || null;
                            setSelectedCourse(course);
                        }}
                        defaultValue=""
                        className="w-full p-3 mb-6 border border-gray-200 rounded-xl dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-green-500 font-medium"
                    >
                        <option value="" disabled>Escolha o curso...</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleGenerateStudentsByCourse}
                        disabled={!selectedCourse}
                        className="mt-auto w-full px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                    >
                        Gerar PDF da Turma
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
