
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, Course, Partner, User } from '../types';

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

// Helper para gerenciar o localStorage
const getLocal = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveLocal = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>(() => getLocal('students', []));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getLocal('teachers', []));
  const [courses, setCourses] = useState<Course[]>(() => getLocal('courses', []));
  const [partners, setPartners] = useState<Partner[]>(() => getLocal('partners', []));
  const [users, setUsers] = useState<User[]>(() => getLocal('users', [
    { id: '1', name: 'Administrador', username: 'admin', password: '123', role: 'ADMIN' }
  ]));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveLocal('students', students);
    saveLocal('teachers', teachers);
    saveLocal('courses', courses);
    saveLocal('partners', partners);
    saveLocal('users', users);
  }, [students, teachers, courses, partners, users]);

  const refreshData = async () => {
    // Sincronização manual com o localStorage se necessário
    setLoading(true);
    setStudents(getLocal('students', []));
    setTeachers(getLocal('teachers', []));
    setCourses(getLocal('courses', []));
    setPartners(getLocal('partners', []));
    setUsers(getLocal('users', []));
    setLoading(false);
  };

  const addStudent = async (data: any) => {
    const newId = Date.now().toString();
    setStudents(prev => [...prev, { ...data, id: newId }]);
  };
  const updateStudent = async (data: Student) => {
    setStudents(prev => prev.map(s => s.id === data.id ? data : s));
  };
  const removeStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addTeacher = async (data: any) => {
    const newId = Date.now().toString();
    setTeachers(prev => [...prev, { ...data, id: newId }]);
  };
  const updateTeacher = async (data: Teacher) => {
    setTeachers(prev => prev.map(i => i.id === data.id ? data : i));
  };
  const removeTeacher = async (id: string) => {
    setTeachers(prev => prev.filter(i => i.id !== id));
  };

  const addCourse = async (data: any) => {
    const newId = Date.now().toString();
    setCourses(prev => [...prev, { ...data, id: newId }]);
  };
  const updateCourse = async (data: Course) => {
    setCourses(prev => prev.map(i => i.id === data.id ? data : i));
  };
  const removeCourse = async (id: string) => {
    setCourses(prev => prev.filter(i => i.id !== id));
  };

  const addPartner = async (data: any) => {
    const newId = Date.now().toString();
    setPartners(prev => [...prev, { ...data, id: newId }]);
  };
  const updatePartner = async (data: Partner) => {
    setPartners(prev => prev.map(i => i.id === data.id ? data : i));
  };
  const removePartner = async (id: string) => {
    setPartners(prev => prev.filter(i => i.id !== id));
  };

  const addUser = async (data: any) => {
    const newId = Date.now().toString();
    setUsers(prev => [...prev, { ...data, id: newId }]);
  };
  const updateUser = async (data: User) => {
    setUsers(prev => prev.map(i => i.id === data.id ? data : i));
  };
  const removeUser = async (id: string) => {
    setUsers(prev => prev.filter(i => i.id !== id));
  };

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
