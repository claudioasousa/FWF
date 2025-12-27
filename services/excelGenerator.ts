
import * as XLSX from 'xlsx';
import type { Student, Course } from '../types';

/**
 * Gera uma planilha Excel a partir de uma lista de estudantes.
 */
export const generateStudentListExcel = (students: Student[]) => {
    const data = students.map(s => ({
        'Nome Completo': s.name,
        'CPF': s.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
        'Contato': s.contact,
        'Data de Nascimento': new Date(s.birthDate).toLocaleDateString('pt-BR'),
        'Status Acadêmico': s.status,
        'Turma': s.class || 'N/A'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");
    
    // Auto-ajuste de largura das colunas (básico)
    const maxWidths = data.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key, i) => {
            const val = String(row[key]);
            acc[i] = Math.max(acc[i] || 0, val.length, key.length);
        });
        return acc;
    }, []);
    worksheet['!cols'] = maxWidths.map((w: number) => ({ w: w + 2 }));

    XLSX.writeFile(workbook, "Lista_Geral_Alunos.xlsx");
};

/**
 * Gera uma planilha Excel para um curso específico (Pauta).
 */
export const generateStudentsByCourseExcel = (students: Student[], course: Course) => {
    const data = students.map(s => ({
        'Nome': s.name,
        'CPF': s.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
        'Turma': s.class || '-',
        'Status': s.status
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pauta da Turma");
    
    XLSX.writeFile(workbook, `Pauta_${course.name.replace(/ /g, '_')}.xlsx`);
};
