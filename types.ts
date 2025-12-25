
export type UserRole = 'ADMIN' | 'OPERATOR';

export interface User {
  username: string;
  name: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  contact: string;
  birthDate: string;
  address: string;
  courseId: string;
  status: 'CURSANDO' | 'APROVADO' | 'REPROVADO' | 'DESISTENTE';
  class: string; 
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  contact: string;
  specialization: string;
}

export interface Partner {
  id:string;
  companyName: string;
  responsible: string;
  contact: string;
  address: string;
}

export interface Course {
  id: string;
  name: string;
  workload: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  location: string;
  partnerId?: string;
  teacherIds: string[];
  status: 'Ativo' | 'Inativo' | 'Concluído';
}
