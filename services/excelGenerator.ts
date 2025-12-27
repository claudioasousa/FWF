
import * as XLSX from 'xlsx';
import type { Student, Course } from '../types';

/**
 * Formata CPF de forma segura
 */
const safeFormatCPF = (cpf: string = '') => {
  const digits = (cpf || '').replace(/\D/g, '');
  if (digits.length !== 11) return digits;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata Data de forma segura
 */
const safeFormatDate = (dateStr: string = '') => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
};

/**
 * Gera uma planilha Excel a partir de uma lista de estudantes.
 */
export const generateStudentListExcel = (students: Student[]) => {
    if (!students || students.length === 0) {
        alert("Não há dados de alunos para exportar no momento.");
        return;
    }

    const data = students.map(s => ({
        'Nome Completo': s.name || 'Sem Nome',
        'CPF': safeFormatCPF(s.cpf),
        'Contato': s.contact || 'N/A',
        'Data de Nascimento': safeFormatDate(s.birthDate),
        'Status Acadêmico': s.status || 'N/A',
        'Turma': s.class || '-'
    }));
    
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lista Geral");
        
        // Auto-ajuste de largura das colunas
        const maxWidths = data.reduce((acc: any, row: any) => {
            Object.keys(row).forEach((key, i) => {
                const val = String(row[key as keyof typeof row]);
                acc[i] = Math.max(acc[i] || 0, val.length, key.length);
            });
            return acc;
        }, []);
        worksheet['!cols'] = maxWidths.map((w: number) => ({ w: w + 2 }));

        XLSX.writeFile(workbook, "Lista_Geral_Alunos.xlsx");
    } catch (error) {
        console.error("Erro ao gerar Excel:", error);
        alert("Ocorreu um erro ao processar a planilha. Verifique o console.");
    }
};

/**
 * Gera uma planilha Excel para um curso específico (Pauta).
 */
export const generateStudentsByCourseExcel = (students: Student[], course: Course) => {
    if (!students || students.length === 0) {
        alert(`Não há alunos matriculados no curso "${course.name}" para exportar.`);
        return;
    }

    const data = students.map(s => ({
        'Nome': s.name || 'Sem Nome',
        'CPF': safeFormatCPF(s.cpf),
        'Turma': s.class || '-',
        'Situação': s.status || 'N/A'
    }));
    
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pauta");
        
        XLSX.writeFile(workbook, `Pauta_${course.name.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
    } catch (error) {
        console.error("Erro ao gerar Excel da pauta:", error);
        alert("Erro ao gerar pauta da turma.");
    }
};
