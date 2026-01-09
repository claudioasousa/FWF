
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import type { Student, Teacher, Course, Partner, User } from '../types';

interface TableStatus {
  name: string;
  ok: boolean;
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

const CACHE_KEY = 'gc_data_cache_v1';
const OUTBOX_KEY = 'gc_outbox_queue_v1';

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [outbox, setOutbox] = useState<OutboxItem[]>(() => {
    const saved = localStorage.getItem(OUTBOX_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);

  useEffect(() => {
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
        console.error("Erro ao ler cache local", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      processOutbox();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [outbox]);

  const saveToCache = (data: any) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  const addToOutbox = (item: Omit<OutboxItem, 'id' | 'timestamp'>) => {
    const newItem: OutboxItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const newOutbox = [...outbox, newItem];
    setOutbox(newOutbox);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(newOutbox));
  };

  const processOutbox = useCallback(async () => {
    if (outbox.length === 0 || !navigator.onLine || !isConfigured) return;

    const remainingOutbox = [...outbox];
    
    for (const item of outbox) {
      try {
        let error = null;
        if (item.action === 'INSERT') {
          const { error: err } = await supabase.from(item.table).insert([item.payload]);
          error = err;
        } else if (item.action === 'UPDATE') {
          const { error: err } = await supabase.from(item.table).update(item.payload).eq('id', item.payload.id);
          error = err;
        } else if (item.action === 'DELETE') {
          const { error: err } = await supabase.from(item.table).delete().eq('id', item.payload.id);
          error = err;
        }

        if (!error || error.code === 'PGRST116') {
          const index = remainingOutbox.findIndex(i => i.id === item.id);
          if (index > -1) remainingOutbox.splice(index, 1);
        } else {
          break; // Para se houver erro de conexão
        }
      } catch (e) {
        break; 
      }
    }

    setOutbox(remainingOutbox);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(remainingOutbox));
    await refreshData();
  }, [outbox]);

  const refreshData = async () => {
    if (!navigator.onLine || !isConfigured) {
      setLoading(false);
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

      const statuses: TableStatus[] = [];
      const tables = ['Parceiros', 'Professores', 'Cursos', 'Alunos', 'Usuários'];

      results.forEach((res, idx) => {
        statuses.push({
          name: tables[idx],
          ok: res.status === 'fulfilled' && !res.value.error
        });
      });

      setTableStatuses(statuses);

      // Processar dados apenas das promessas que deram certo
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
    } catch (err) {
      console.warn('Falha na rede ao tentar sincronizar. Operando em modo offline.');
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAction = async (table: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any, updateLocalState: () => void) => {
    updateLocalState();
    
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
        await refreshData();
      } catch (e) {
        addToOutbox({ table, action, payload });
      }
    } else {
      addToOutbox({ table, action, payload });
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
      students, teachers, courses, partners, users, loading, isOffline, pendingSyncCount: outbox.length, tableStatuses, isConfigValid: isConfigured, refreshData,
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
