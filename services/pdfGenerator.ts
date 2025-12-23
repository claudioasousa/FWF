
import type { Student, Course } from '../types';

// This assumes jsPDF and jsPDF-AutoTable are loaded from a CDN in index.html
declare const jspdf: any;

const generatePdf = (title: string, head: string[][], body: any[][]) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    (doc as any).autoTable({
        startY: 30,
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`${title.replace(/ /g, '_')}.pdf`);
};

export const generateStudentListPdf = (students: Student[]) => {
    const head = [['Nome', 'CPF', 'Data de Nascimento', 'Status']];
    const body = students.map(s => [s.name, s.cpf, new Date(s.birthDate).toLocaleDateString(), s.status]);
    
    generatePdf('Lista Geral de Alunos', head, body);
};

export const generateStudentsByCoursePdf = (students: Student[], course: Course) => {
    const head = [['Nome', 'CPF', 'Turma', 'Status']];
    const body = students.map(s => [s.name, s.cpf, s.class, s.status]);

    generatePdf(`Alunos do Curso - ${course.name}`, head, body);
};
