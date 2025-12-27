
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { generateStudentListPdf, generateStudentsByCoursePdf } from '../services/pdfGenerator';
import { generateStudentListExcel, generateStudentsByCourseExcel } from '../services/excelGenerator';
import type { Course } from '../types';

const ReportsPage = () => {
    const { students, courses } = useData();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleGeneratePdfList = () => generateStudentListPdf(students);
    const handleGenerateExcelList = () => generateStudentListExcel(students);
    
    const handleGeneratePdfByCourse = () => {
        if (selectedCourse) {
            const courseStudents = students.filter(s => s.courseId === selectedCourse.id);
            generateStudentsByCoursePdf(courseStudents, selectedCourse);
        } else {
            alert('Por favor, selecione um curso.');
        }
    };

    const handleGenerateExcelByCourse = () => {
        if (selectedCourse) {
            const courseStudents = students.filter(s => s.courseId === selectedCourse.id);
            generateStudentsByCourseExcel(courseStudents, selectedCourse);
        } else {
            alert('Por favor, selecione um curso.');
        }
    };

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto space-y-10">
            <header className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Relatórios e Exportação</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Extraia dados em PDF para impressão ou Planilha para análise.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* LISTA GERAL */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[28px] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                        📁
                    </div>
                    <h2 className="text-2xl font-black mb-3">Lista Geral de Alunos</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed text-sm">
                        Exporta todos os alunos registrados no sistema com seus dados básicos, CPFs e situação cadastral atualizada.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-auto">
                        <button
                            onClick={handleGeneratePdfList}
                            className="px-6 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                        >
                            Exportar PDF
                        </button>
                        <button
                            onClick={handleGenerateExcelList}
                            className="px-6 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                        >
                            Exportar Planilha (XLSX)
                        </button>
                    </div>
                </div>

                {/* PAUTA POR TURMA */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-[28px] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                        🏫
                    </div>
                    <h2 className="text-2xl font-black mb-3">Pauta por Turma</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm">
                        Selecione um curso específico para gerar a lista de presença e pauta de alunos matriculados.
                    </p>
                    
                    <select
                        onChange={(e) => {
                            const course = courses.find(c => c.id === e.target.value) || null;
                            setSelectedCourse(course);
                        }}
                        defaultValue=""
                        className="w-full p-4 mb-8 border border-gray-100 rounded-2xl dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    >
                        <option value="" disabled>Escolha o curso desejado...</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name} ({course.period})</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-auto">
                        <button
                            onClick={handleGeneratePdfByCourse}
                            disabled={!selectedCourse}
                            className="px-6 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                        >
                            Gerar PDF
                        </button>
                        <button
                            onClick={handleGenerateExcelByCourse}
                            disabled={!selectedCourse}
                            className="px-6 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                        >
                            Gerar Planilha (XLSX)
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-800/50">
                <div className="flex gap-4 items-start">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h4 className="font-black text-blue-900 dark:text-blue-300 text-sm uppercase tracking-wider mb-1">Dica de Gestão</h4>
                        <p className="text-blue-700/70 dark:text-blue-400/70 text-xs font-medium leading-relaxed">
                            As planilhas (XLSX) são ideais para importar dados em outros softwares ou criar gráficos de desempenho personalizados. 
                            Os arquivos PDF são otimizados para impressão em folha A4 e assinaturas físicas de presença.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
