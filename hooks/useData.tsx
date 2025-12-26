
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

const STORAGE_KEYS = {
  STUDENTS: 'gc_students',
  TEACHERS: 'gc_teachers',
  COURSES: 'gc_courses',
  PARTNERS: 'gc_partners',
  USERS: 'gc_users',
};

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      setStudents(JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]'));
      setTeachers(JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]'));
      setCourses(JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]'));
      setPartners(JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERS) || '[]'));
      
      const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      if (savedUsers.length === 0) {
        const initialUsers = [
          { id: '1', name: 'Claudio A. Sousa', username: 'claudioasousa', password: 'cas661010', role: 'ADMIN' },
          { id: '2', name: 'Administrador', username: 'admin', password: 'admin', role: 'ADMIN' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        setUsers(initialUsers);
      } else {
        setUsers(savedUsers);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = (key: string, data: any, setter: Function) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const refreshData = async () => {}; // No-op em local storage

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, refreshData,
      addStudent: (d) => save(STORAGE_KEYS.STUDENTS, [...students, { ...d, id: generateId() }], setStudents),
      updateStudent: (d) => save(STORAGE_KEYS.STUDENTS, students.map(s => s.id === d.id ? d : s), setStudents),
      removeStudent: (id) => save(STORAGE_KEYS.STUDENTS, students.filter(s => s.id !== id), setStudents),
      
      addTeacher: (d) => save(STORAGE_KEYS.TEACHERS, [...teachers, { ...d, id: generateId() }], setTeachers),
      updateTeacher: (d) => save(STORAGE_KEYS.TEACHERS, teachers.map(t => t.id === d.id ? d : t), setTeachers),
      removeTeacher: (id) => save(STORAGE_KEYS.TEACHERS, teachers.filter(t => t.id !== id), setTeachers),
      
      addCourse: (d) => save(STORAGE_KEYS.COURSES, [...courses, { ...d, id: generateId() }], setCourses),
      updateCourse: (d) => save(STORAGE_KEYS.COURSES, courses.map(c => c.id === d.id ? d : c), setCourses),
      removeCourse: (id) => save(STORAGE_KEYS.COURSES, courses.filter(c => c.id !== id), setCourses),
      
      addPartner: (d) => save(STORAGE_KEYS.PARTNERS, [...partners, { ...d, id: generateId() }], setPartners),
      updatePartner: (d) => save(STORAGE_KEYS.PARTNERS, partners.map(p => p.id === d.id ? d : p), setPartners),
      removePartner: (id) => save(STORAGE_KEYS.PARTNERS, partners.filter(p => p.id !== id), setPartners),
      
      addUser: (d) => save(STORAGE_KEYS.USERS, [...users, { ...d, id: generateId() }], setUsers),
      updateUser: (d) => save(STORAGE_KEYS.USERS, users.map(u => u.id === d.id ? d : u), setUsers),
      removeUser: (id) => save(STORAGE_KEYS.USERS, users.filter(u => u.id !== id), setUsers),
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
