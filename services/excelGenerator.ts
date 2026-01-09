
import * as XLSX from 'xlsx';
import type { Student, Course } from '../types';

/**
 * Formata CPF de forma segura
 */
const safeFormatCPF = (cpf: string = '') => {
  const digits = String(cpf || '').replace(/\D/g, '');
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
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return String(dateStr);
  }
};

/**
 * Gera uma planilha Excel a partir de uma lista de estudantes.
 */
export const generateStudentListExcel = (students: Student[]) => {
    console.log("Iniciando exportação de Excel com", students?.length, "alunos");
    
    if (!students || students.length === 0) {
        alert("Não há dados de alunos para exportar no momento.");
        return;
    }

    // Criar array de objetos limpos para o Excel
    const data = students.map(s => ({
        'Nome Completo': String(s.name || 'Sem Nome'),
        'CPF': safeFormatCPF(s.cpf),
        'Contato': String(s.contact || 'N/A'),
        'Data de Nascimento': safeFormatDate(s.birthDate),
        'Status Acadêmico': String(s.status || 'N/A'),
        'Turma': String(s.class || '-')
    }));
    
    try {
        // Criar a planilha a partir do JSON
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Criar um novo livro de trabalho (Workbook)
        const workbook = XLSX.utils.book_new();
        
        // Adicionar a planilha ao livro
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Alunos");
        
        // Auto-ajuste de largura das colunas
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            const maxWidths = keys.map(key => {
                let max = key.length;
                data.forEach(row => {
                    const val = String(row[key as keyof typeof row] || "");
                    if (val.length > max) max = val.length;
                });
                return { wch: max + 2 };
            });
            worksheet['!cols'] = maxWidths;
        }

        // Tentar escrever o arquivo
        XLSX.writeFile(workbook, "Lista_Geral_Alunos.xlsx", { compression: true });
        console.log("Excel exportado com sucesso.");
    } catch (error) {
        console.error("Erro crítico ao gerar Excel:", error);
        alert("Falha técnica ao gerar o arquivo Excel. Detalhes no console.");
    }
};

/**
 * Gera uma planilha Excel para um curso específico (Pauta).
 */
export const generateStudentsByCourseExcel = (students: Student[], course: Course) => {
    if (!students || students.length === 0) {
        alert(`Não há alunos matriculados no curso "${course?.name || 'selecionado'}" para exportar.`);
        return;
    }

    const data = students.map(s => ({
        'Nome': String(s.name || 'Sem Nome'),
        'CPF': safeFormatCPF(s.cpf),
        'Turma': String(s.class || '-'),
        'Situação': String(s.status || 'N/A')
    }));
    
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pauta da Turma");
        
        // Auto-ajuste simples
        const keys = Object.keys(data[0]);
        worksheet['!cols'] = keys.map(() => ({ wch: 20 }));

        const fileName = `Pauta_${String(course?.name || 'Curso').replace(/[^a-z0-9]/gi, '_')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error("Erro ao gerar Excel da pauta:", error);
        alert("Erro técnico ao gerar pauta da turma.");
    }
};
