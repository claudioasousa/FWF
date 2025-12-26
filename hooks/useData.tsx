
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Student, Teacher, Course, Partner, User } from '../types';

interface TableStatus {
  name: string;
  ok: boolean;
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

  const refreshData = async () => {
    if (!supabase) return;
    setLoading(true);
    const statuses: TableStatus[] = [];

    try {
      // Fetch Partners
      const { data: pData, error: pErr } = await supabase.from('partners').select('*');
      if (pData) setPartners(pData.map(p => ({
        id: p.id,
        companyName: p.company_name,
        responsible: p.responsible,
        contact: p.contact,
        address: p.address
      })));
      statuses.push({ name: 'Parceiros', ok: !pErr });

      // Fetch Teachers
      const { data: tData, error: tErr } = await supabase.from('teachers').select('*');
      if (tData) setTeachers(tData);
      statuses.push({ name: 'Professores', ok: !tErr });

      // Fetch Courses
      const { data: cData, error: cErr } = await supabase.from('courses').select('*');
      if (cData) setCourses(cData.map(c => ({
        id: c.id,
        name: c.name,
        workload: c.workload,
        startDate: c.start_date,
        endDate: c.end_date,
        startTime: c.start_time,
        endTime: c.end_time,
        period: c.period,
        location: c.location,
        partnerId: c.partner_id,
        status: c.status,
        teacherIds: []
      })));
      statuses.push({ name: 'Cursos', ok: !cErr });

      // Fetch Students
      const { data: sData, error: sErr } = await supabase.from('students').select('*');
      if (sData) setStudents(sData.map(s => ({
        id: s.id,
        name: s.name,
        cpf: s.cpf,
        contact: s.contact,
        birthDate: s.birth_date,
        address: s.address,
        courseId: s.course_id,
        status: s.status,
        class: s.class
      })));
      statuses.push({ name: 'Alunos', ok: !sErr });

      // Fetch Users
      const { data: uData, error: uErr } = await supabase.from('users').select('*').order('is_online', { ascending: false });
      if (uData) setUsers(uData.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        role: u.role,
        isOnline: u.is_online,
        lastSeen: u.last_seen
      })));
      statuses.push({ name: 'Usuários', ok: !uErr });

      setTableStatuses(statuses);
    } catch (err) {
      console.error('Erro ao sincronizar com Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // CRUD Operations
  const addStudent = async (d: Omit<Student, 'id'>) => {
    await supabase.from('students').insert([{
      name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate,
      address: d.address, course_id: d.courseId || null, status: d.status, class: d.class
    }]);
    await refreshData();
  };

  const updateStudent = async (d: Student) => {
    await supabase.from('students').update({
      name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate,
      address: d.address, course_id: d.courseId || null, status: d.status, class: d.class
    }).eq('id', d.id);
    await refreshData();
  };

  const removeStudent = async (id: string) => {
    await supabase.from('students').delete().eq('id', id);
    await refreshData();
  };

  const addCourse = async (d: Omit<Course, 'id'>) => {
    await supabase.from('courses').insert([{
      name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate,
      start_time: d.startTime, end_time: d.endTime, period: d.period,
      location: d.location, partner_id: d.partnerId || null, status: d.status
    }]);
    await refreshData();
  };

  const updateCourse = async (d: Course) => {
    await supabase.from('courses').update({
      name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate,
      start_time: d.startTime, end_time: d.endTime, period: d.period,
      location: d.location, partner_id: d.partnerId || null, status: d.status
    }).eq('id', d.id);
    await refreshData();
  };

  const removeCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    await refreshData();
  };

  const addTeacher = async (d: Omit<Teacher, 'id'>) => {
    await supabase.from('teachers').insert([d]);
    await refreshData();
  };

  const updateTeacher = async (d: Teacher) => {
    await supabase.from('teachers').update(d).eq('id', d.id);
    await refreshData();
  };

  const removeTeacher = async (id: string) => {
    await supabase.from('teachers').delete().eq('id', id);
    await refreshData();
  };

  const addPartner = async (d: Omit<Partner, 'id'>) => {
    await supabase.from('partners').insert([{
      company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address
    }]);
    await refreshData();
  };

  const updatePartner = async (d: Partner) => {
    await supabase.from('partners').update({
      company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address
    }).eq('id', d.id);
    await refreshData();
  };

  const removePartner = async (id: string) => {
    await supabase.from('partners').delete().eq('id', id);
    await refreshData();
  };

  const addUser = async (d: Omit<User, 'id'>) => {
    await supabase.from('users').insert([{
      name: d.name,
      username: d.username,
      password: d.password,
      role: d.role,
      is_online: false
    }]);
    await refreshData();
  };

  const updateUser = async (d: User) => {
    await supabase.from('users').update({
      name: d.name,
      username: d.username,
      password: d.password,
      role: d.role
    }).eq('id', d.id);
    await refreshData();
  };

  const removeUser = async (id: string) => {
    await supabase.from('users').delete().eq('id', id);
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, tableStatuses, refreshData,
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
