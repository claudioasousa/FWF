
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import type { Student, Teacher, Course, Partner, User } from '../types';

interface TableStatus {
  name: string;
  table: string;
  ok: boolean;
  error?: string;
  testedAt?: string;
}

interface OutboxItem {
  id: string;
  table: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: number;
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  partners: Partner[];
  users: User[];
  loading: boolean;
  isOffline: boolean;
  pendingSyncCount: number;
  tableStatuses: TableStatus[];
  isConfigValid: boolean;
  refreshData: () => Promise<void>;
  testAllConnections: () => Promise<void>;
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

const CACHE_KEY = 'gc_data_cache_v2';
const OUTBOX_KEY = 'gc_outbox_queue_v2';

const MOCK_DATA = {
  partners: [
    { id: 'p1', companyName: 'Parceiro Exemplo Local', responsible: 'Admin', contact: '0000000', address: 'Local' }
  ],
  teachers: [
    { id: 't1', name: 'Professor Exemplo Local', email: 'prof@local.com', contact: '0000000', specialization: 'Geral' }
  ],
  courses: [
    { id: 'c1', name: 'Curso Exemplo Local', workload: 40, startDate: '2024-01-01', endDate: '2024-12-31', startTime: '08:00', endTime: '12:00', period: 'Manhã', location: 'Local', status: 'Ativo', partnerId: 'p1', teacherIds: [] }
  ],
  students: [],
  users: [
    { id: 'u1', name: 'Admin Local', username: 'admin', role: 'ADMIN', isOnline: true }
  ]
};

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine || !isConfigured);
  const [outbox, setOutbox] = useState<OutboxItem[]>(() => {
    const saved = localStorage.getItem(OUTBOX_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([
    { name: 'Parceiros', table: 'partners', ok: false },
    { name: 'Professores', table: 'teachers', ok: false },
    { name: 'Cursos', table: 'courses', ok: false },
    { name: 'Alunos', table: 'students', ok: false },
    { name: 'Usuários', table: 'users', ok: false },
  ]);

  const saveToCache = useCallback((data: any) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  }, []);

  const loadInitialData = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setStudents(data.students || []);
        setTeachers(data.teachers || []);
        setCourses(data.courses || []);
        setPartners(data.partners || []);
        setUsers(data.users || []);
      } catch (e) {
        console.error("Erro ao ler cache");
      }
    } else {
      setStudents(MOCK_DATA.students as any);
      setTeachers(MOCK_DATA.teachers as any);
      setCourses(MOCK_DATA.courses as any);
      setPartners(MOCK_DATA.partners as any);
      setUsers(MOCK_DATA.users as any);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const testAllConnections = async () => {
    if (!isConfigured) {
      setTableStatuses(prev => prev.map(s => ({ ...s, ok: false, error: 'Banco não configurado', testedAt: new Date().toLocaleTimeString() })));
      setLoading(false);
      return;
    }

    setLoading(true);
    const newStatuses: TableStatus[] = [];
    const tables = [
      { name: 'Parceiros', table: 'partners' },
      { name: 'Professores', table: 'teachers' },
      { name: 'Cursos', table: 'courses' },
      { name: 'Alunos', table: 'students' },
      { name: 'Usuários', table: 'users' },
    ];

    for (const t of tables) {
      try {
        const { error } = await supabase.from(t.table).select('count', { count: 'exact', head: true });
        newStatuses.push({
          ...t,
          ok: !error,
          error: error ? `${error.code}: ${error.message}` : undefined,
          testedAt: new Date().toLocaleTimeString()
        });
      } catch (e) {
        newStatuses.push({
          ...t,
          ok: false,
          error: 'Erro de Rede',
          testedAt: new Date().toLocaleTimeString()
        });
      }
    }

    setTableStatuses(newStatuses);
    setLoading(false);
    if (newStatuses.every(s => s.ok)) await refreshData();
  };

  const refreshData = async () => {
    if (!isConfigured) {
      setLoading(false);
      setIsOffline(true);
      return;
    }
    
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        supabase.from('partners').select('*'),
        supabase.from('teachers').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('students').select('*'),
        supabase.from('users').select('*').order('is_online', { ascending: false })
      ]);

      if (results[0].status === 'fulfilled' && results[0].value.data) {
        setPartners(results[0].value.data.map(p => ({
          id: p.id, companyName: p.company_name, responsible: p.responsible, contact: p.contact, address: p.address
        })));
      }
      if (results[1].status === 'fulfilled' && results[1].value.data) {
        setTeachers(results[1].value.data);
      }
      if (results[2].status === 'fulfilled' && results[2].value.data) {
        setCourses(results[2].value.data.map(c => ({
          id: c.id, name: c.name, workload: c.workload, startDate: c.start_date, endDate: c.end_date,
          startTime: c.start_time, endTime: c.end_time, period: c.period, location: c.location,
          partnerId: c.partner_id, status: c.status, teacherIds: []
        })));
      }
      if (results[3].status === 'fulfilled' && results[3].value.data) {
        setStudents(results[3].value.data.map(s => ({
          id: s.id, name: s.name, cpf: s.cpf, contact: s.contact, birthDate: s.birth_date,
          address: s.address, courseId: s.course_id, status: s.status, class: s.class
        })));
      }
      if (results[4].status === 'fulfilled' && results[4].value.data) {
        setUsers(results[4].value.data.map(u => ({
          id: u.id, name: u.name, username: u.username, role: u.role, isOnline: u.is_online, lastSeen: u.last_seen
        })));
      }

      saveToCache({ students, teachers, courses, partners, users });
      setIsOffline(false);
    } catch (err) {
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) {
      testAllConnections();
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  const handleAction = async (table: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any, updateLocalState: () => void) => {
    updateLocalState();
    setTimeout(() => saveToCache({ students, teachers, courses, partners, users }), 100);

    if (navigator.onLine && isConfigured) {
      try {
        let error;
        if (action === 'INSERT') {
          const { error: err } = await supabase.from(table).insert([payload]);
          error = err;
        } else if (action === 'UPDATE') {
          const { error: err } = await supabase.from(table).update(payload).eq('id', payload.id);
          error = err;
        } else if (action === 'DELETE') {
          const { error: err } = await supabase.from(table).delete().eq('id', payload.id);
          error = err;
        }
        if (error) throw error;
      } catch (e) {
        const newItem: OutboxItem = { id: Math.random().toString(36).substr(2, 9), table, action, payload, timestamp: Date.now() };
        setOutbox(prev => {
          const updated = [...prev, newItem];
          localStorage.setItem(OUTBOX_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  const addStudent = (d: Omit<Student, 'id'>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const payload = { name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate, address: d.address, course_id: d.courseId || null, status: d.status, class: d.class };
    return handleAction('students', 'INSERT', payload, () => setStudents(p => [...p, { ...d, id: tempId } as Student]));
  };

  const updateStudent = (d: Student) => {
    const payload = { id: d.id, name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate, address: d.address, course_id: d.courseId || null, status: d.status, class: d.class };
    return handleAction('students', 'UPDATE', payload, () => setStudents(p => p.map(s => s.id === d.id ? d : s)));
  };

  const removeStudent = (id: string) => {
    return handleAction('students', 'DELETE', { id }, () => setStudents(p => p.filter(s => s.id !== id)));
  };

  const addCourse = (d: Omit<Course, 'id'>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const payload = { name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate, start_time: d.startTime, end_time: d.endTime, period: d.period, location: d.location, partner_id: d.partnerId || null, status: d.status };
    return handleAction('courses', 'INSERT', payload, () => setCourses(p => [...p, { ...d, id: tempId } as Course]));
  };

  const updateCourse = (d: Course) => {
    const payload = { id: d.id, name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate, start_time: d.startTime, end_time: d.endTime, period: d.period, location: d.location, partner_id: d.partnerId || null, status: d.status };
    return handleAction('courses', 'UPDATE', payload, () => setCourses(p => p.map(c => c.id === d.id ? d : c)));
  };

  const removeCourse = (id: string) => {
    return handleAction('courses', 'DELETE', { id }, () => setCourses(p => p.filter(c => c.id !== id)));
  };

  const addTeacher = (d: Omit<Teacher, 'id'>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    return handleAction('teachers', 'INSERT', d, () => setTeachers(p => [...p, { ...d, id: tempId } as Teacher]));
  };

  const updateTeacher = (d: Teacher) => {
    return handleAction('teachers', 'UPDATE', d, () => setTeachers(p => p.map(t => t.id === d.id ? d : t)));
  };

  const removeTeacher = (id: string) => {
    return handleAction('teachers', 'DELETE', { id }, () => setTeachers(p => p.filter(t => t.id !== id)));
  };

  const addPartner = (d: Omit<Partner, 'id'>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const payload = { company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address };
    return handleAction('partners', 'INSERT', payload, () => setPartners(p => [...p, { ...d, id: tempId } as Partner]));
  };

  const updatePartner = (d: Partner) => {
    const payload = { id: d.id, company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address };
    return handleAction('partners', 'UPDATE', payload, () => setPartners(p => p.map(pt => pt.id === d.id ? d : pt)));
  };

  const removePartner = (id: string) => {
    return handleAction('partners', 'DELETE', { id }, () => setPartners(p => p.filter(pt => pt.id !== id)));
  };

  const addUser = (d: Omit<User, 'id'>) => handleAction('users', 'INSERT', d, () => refreshData());
  const updateUser = (d: User) => handleAction('users', 'UPDATE', d, () => setUsers(p => p.map(u => u.id === d.id ? d : u)));
  const removeUser = (id: string) => handleAction('users', 'DELETE', { id }, () => setUsers(p => p.filter(u => u.id !== id)));

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, isOffline, pendingSyncCount: outbox.length, tableStatuses, isConfigValid: isConfigured, refreshData, testAllConnections,
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
