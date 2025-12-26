
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, Course, Partner, User } from '../types';
import { supabase } from '../lib/supabase';

interface TableStatus {
  name: string;
  ok: boolean;
  error?: string;
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  partners: Partner[];
  users: User[];
  loading: boolean;
  tableStatuses: TableStatus[];
  refreshData: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (teacher: Teacher) => Promise<void>;
  removeTeacher: (id: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  removeCourse: (id: string) => Promise<void>;
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (partner: Partner) => Promise<void>;
  removePartner: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const statuses: TableStatus[] = [];
    
    try {
      const tables = ['students', 'teachers', 'courses', 'partners', 'users'];
      
      const results = await Promise.all(
        tables.map(table => supabase.from(table).select('*', { count: 'exact', head: false }))
      );

      results.forEach((res, index) => {
        const tableName = tables[index];
        if (res.error) {
          statuses.push({ name: tableName, ok: false, error: res.error.message });
        } else {
          statuses.push({ name: tableName, ok: true });
          if (tableName === 'students') setStudents(res.data || []);
          if (tableName === 'teachers') setTeachers(res.data || []);
          if (tableName === 'courses') setCourses(res.data || []);
          if (tableName === 'partners') setPartners(res.data || []);
          if (tableName === 'users') setUsers(res.data || []);
        }
      });

      setTableStatuses(statuses);
    } catch (error) {
      console.error('Erro crítico de conexão:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureInitialUsers = async () => {
    try {
      const usersToCreate = [
        { name: 'Claudio A. Sousa', username: 'claudioasousa', password: 'cas661010', role: 'ADMIN' },
        { name: 'Administrador Padrão', username: 'admin', password: 'admin', role: 'ADMIN' }
      ];

      for (const userData of usersToCreate) {
        const { data: existing } = await supabase
          .from('users')
          .select('username')
          .eq('username', userData.username)
          .maybeSingle();

        if (!existing) {
          await supabase.from('users').insert([userData]);
        }
      }
    } catch (err) {
      console.debug("Tabelas não prontas para inserção de usuários padrão.");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      await ensureInitialUsers();
    };
    init();
  }, []);

  const handleError = (error: any, action: string) => {
    console.error(`Erro detalhado em ${action}:`, error);
    let msg = `Erro ao ${action}: ${error.message}`;
    
    if (error.code === '42P01') {
      msg = "Tabela não encontrada. Você precisa rodar o NOVO Script SQL no Supabase.";
    } else if (error.code === '42703') {
      msg = "Coluna não encontrada. Rode o novo script SQL para corrigir os nomes das colunas.";
    } else if (error.message.includes('row-level security')) {
      msg = "Permissão negada (RLS). Rode o novo script SQL para desativar o RLS das tabelas.";
    } else if (error.code === '23505') {
      msg = "Este registro já existe (duplicidade de CPF ou Usuário).";
    }
    
    alert(msg);
  };

  const add = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert([data]);
    if (error) {
      handleError(error, `cadastrar em ${table}`);
      throw error;
    }
    await fetchData();
  };

  const update = async (table: string, data: any) => {
    const { id, created_at, ...updates } = data;
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) {
      handleError(error, `atualizar em ${table}`);
      throw error;
    }
    await fetchData();
  };

  const remove = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      handleError(error, `excluir em ${table}`);
      throw error;
    }
    await fetchData();
  };

  const refreshData = async () => fetchData();

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, tableStatuses, refreshData,
      addStudent: (d) => add('students', d),
      updateStudent: (d) => update('students', d),
      removeStudent: (id) => remove('students', id),
      addTeacher: (d) => add('teachers', d),
      updateTeacher: (d) => update('teachers', d),
      removeTeacher: (id) => remove('teachers', id),
      addCourse: (d) => add('courses', d),
      updateCourse: (d) => update('courses', d),
      removeCourse: (id) => remove('courses', id),
      addPartner: (d) => add('partners', d),
      updatePartner: (d) => update('partners', d),
      removePartner: (id) => remove('partners', id),
      addUser: (d) => add('users', d),
      updateUser: (d) => update('users', d),
      removeUser: (id) => remove('users', id)
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
