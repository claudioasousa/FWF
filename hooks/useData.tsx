
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, Course, Partner, User } from '../types';
import { api } from '../services/api';

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

  const refreshData = async () => {
    try {
      setLoading(true);
      const [s, t, c, p, u] = await Promise.all([
        api.get('/students'),
        api.get('/teachers'),
        api.get('/courses'),
        api.get('/partners'),
        api.get('/users')
      ]);
      setStudents(s);
      setTeachers(t);
      setCourses(c);
      setPartners(p);
      setUsers(u);
    } catch (err) {
      console.error("Falha ao conectar com o banco de dados SQL local. Certifique-se que o servidor bridge está rodando.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addStudent = async (data: any) => { await api.post('/students', data); refreshData(); };
  const updateStudent = async (data: any) => { await api.put(`/students/${data.id}`, data); refreshData(); };
  const removeStudent = async (id: string) => { await api.delete(`/students/${id}`); refreshData(); };

  const addTeacher = async (data: any) => { await api.post('/teachers', data); refreshData(); };
  const updateTeacher = async (data: any) => { await api.put(`/teachers/${data.id}`, data); refreshData(); };
  const removeTeacher = async (id: string) => { await api.delete(`/teachers/${id}`); refreshData(); };

  const addCourse = async (data: any) => { await api.post('/courses', data); refreshData(); };
  const updateCourse = async (data: any) => { await api.put(`/courses/${data.id}`, data); refreshData(); };
  const removeCourse = async (id: string) => { await api.delete(`/courses/${id}`); refreshData(); };

  const addPartner = async (data: any) => { await api.post('/partners', data); refreshData(); };
  const updatePartner = async (data: any) => { await api.put(`/partners/${data.id}`, data); refreshData(); };
  const removePartner = async (id: string) => { await api.delete(`/partners/${id}`); refreshData(); };

  const addUser = async (data: any) => { await api.post('/users', data); refreshData(); };
  const updateUser = async (data: any) => { await api.put(`/users/${data.id}`, data); refreshData(); };
  const removeUser = async (id: string) => { await api.delete(`/users/${id}`); refreshData(); };

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
