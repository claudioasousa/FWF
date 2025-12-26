
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, Course, Partner, User } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  partners: Partner[];
  users: User[];
  loading: boolean;
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: s },
        { data: t },
        { data: c },
        { data: p },
        { data: u }
      ] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('teachers').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('users').select('*')
      ]);

      if (s) setStudents(s);
      if (t) setTeachers(t);
      if (c) setCourses(c);
      if (p) setPartners(p);
      if (u) setUsers(u);
    } catch (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureAdminUser = async () => {
    try {
      // Verifica se o usuário específico claudioasousa já existe
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', 'claudioasousa')
        .maybeSingle();

      if (!existingUser && !error) {
        // Cria o usuário administrador conforme solicitado
        await supabase.from('users').insert([{
          name: 'Claudio A. Sousa',
          username: 'claudioasousa',
          password: 'cas661010',
          role: 'ADMIN'
        }]);
        await fetchData();
        console.log('Usuário claudioasousa criado com sucesso.');
      }
    } catch (err) {
      console.error('Falha ao verificar/criar usuário admin padrão:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      await ensureAdminUser();
    };
    init();
  }, []);

  const refreshData = async () => fetchData();

  const add = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert([data]);
    if (error) throw error;
    await fetchData();
  };

  const update = async (table: string, data: any) => {
    const { id, ...updates } = data;
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const remove = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const addStudent = (data: any) => add('students', data);
  const updateStudent = (data: any) => update('students', data);
  const removeStudent = (id: string) => remove('students', id);

  const addTeacher = (data: any) => add('teachers', data);
  const updateTeacher = (data: any) => update('teachers', data);
  const removeTeacher = (id: string) => remove('teachers', id);

  const addCourse = (data: any) => add('courses', data);
  const updateCourse = (data: any) => update('courses', data);
  const removeCourse = (id: string) => remove('courses', id);

  const addPartner = (data: any) => add('partners', data);
  const updatePartner = (data: any) => update('partners', data);
  const removePartner = (id: string) => remove('partners', id);

  const addUser = (data: any) => add('users', data);
  const updateUser = (data: any) => update('users', data);
  const removeUser = (id: string) => remove('users', id);

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, refreshData,
      addStudent, updateStudent, removeStudent,
      addTeacher, updateTeacher, removeTeacher,
      addCourse, updateCourse, removeCourse,
      addPartner, updatePartner, removePartner,
      addUser, updateUser, removeUser
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
