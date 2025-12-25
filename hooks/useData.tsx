
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, Course, Partner, User } from '../types';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  partners: Partner[];
  users: User[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  removeStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  removeTeacher: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  removeCourse: (id: string) => void;
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  updatePartner: (partner: Partner) => void;
  removePartner: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem('students') || '[]'));
  const [teachers, setTeachers] = useState<Teacher[]>(() => JSON.parse(localStorage.getItem('teachers') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('courses') || '[]'));
  const [partners, setPartners] = useState<Partner[]>(() => JSON.parse(localStorage.getItem('partners') || '[]'));
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);
    // Usuário inicial padrão se não houver nenhum
    return [{ id: 'admin-init', username: 'claudio', name: 'Claudio (Admin)', role: 'ADMIN', password: 'qwe123' }];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('partners', JSON.stringify(partners));
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [students, teachers, courses, partners, users]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStudent = (s: Omit<Student, 'id'>) => setStudents([...students, { ...s, id: generateId() }]);
  const updateStudent = (s: Student) => setStudents(students.map(item => item.id === s.id ? s : item));
  const removeStudent = (id: string) => setStudents(students.filter(item => item.id !== id));

  const addTeacher = (t: Omit<Teacher, 'id'>) => setTeachers([...teachers, { ...t, id: generateId() }]);
  const updateTeacher = (t: Teacher) => setTeachers(teachers.map(item => item.id === t.id ? t : item));
  const removeTeacher = (id: string) => setTeachers(teachers.filter(item => item.id !== id));

  const addCourse = (c: Omit<Course, 'id'>) => setCourses([...courses, { ...c, id: generateId() }]);
  const updateCourse = (c: Course) => setCourses(courses.map(item => item.id === c.id ? c : item));
  const removeCourse = (id: string) => setCourses(courses.filter(item => item.id !== id));

  const addPartner = (p: Omit<Partner, 'id'>) => setPartners([...partners, { ...p, id: generateId() }]);
  const updatePartner = (p: Partner) => setPartners(partners.map(item => item.id === p.id ? p : item));
  const removePartner = (id: string) => setPartners(partners.filter(item => item.id !== id));

  const addUser = (u: Omit<User, 'id'>) => setUsers([...users, { ...u, id: generateId() }]);
  const updateUser = (u: User) => setUsers(users.map(item => item.id === u.id ? u : item));
  const removeUser = (id: string) => setUsers(users.filter(item => item.id !== id));

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users,
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
