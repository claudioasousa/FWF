
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
  infraError: string | null;
  pendingSyncCount: number;
  tableStatuses: TableStatus[];
  isConfigValid: boolean;
  refreshData: () => Promise<void>;
  testAllConnections: () => Promise<void>;
  syncOutbox: () => Promise<void>;
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

const isUUID = (id: any) => {
  if (typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

const MOCK_DATA = {
  partners: [{ id: 'p1', companyName: 'Parceiro Exemplo Local', responsible: 'Admin', contact: '0000000', address: 'Local' }],
  teachers: [{ id: 't1', name: 'Professor Exemplo Local', email: 'prof@local.com', contact: '0000000', specialization: 'Geral' }],
  courses: [{ id: 'c1', name: 'Curso Exemplo Local', workload: 40, startDate: '2024-01-01', endDate: '2024-12-31', startTime: '08:00', endTime: '12:00', period: 'Manhã', location: 'Local', status: 'Ativo', partnerId: 'p1', teacherIds: [] }],
  students: [],
  users: [{ id: 'u1', name: 'Admin Local', username: 'admin', role: 'ADMIN', isOnline: true }]
};

export const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [infraError, setInfraError] = useState<string | null>(null);
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
      } catch (e) { console.error("Cache corrupto"); }
    } else {
      setStudents(MOCK_DATA.students as any);
      setTeachers(MOCK_DATA.teachers as any);
      setCourses(MOCK_DATA.courses as any);
      setPartners(MOCK_DATA.partners as any);
      setUsers(MOCK_DATA.users as any);
    }
  }, []);

  const refreshData = async () => {
    if (!isConfigured) return;
    setLoading(true);
    try {
      const [p, t, c, s, u] = await Promise.all([
        supabase.from('partners').select('*'),
        supabase.from('teachers').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('students').select('*'),
        supabase.from('users').select('*').order('is_online', { ascending: false })
      ]);
      
      const newPartners = p.data ? p.data.map(i => ({ id: i.id, companyName: i.company_name, responsible: i.responsible, contact: i.contact, address: i.address })) : partners;
      const newTeachers = t.data || teachers;
      const newCourses = c.data ? c.data.map(i => ({ id: i.id, name: i.name, workload: i.workload, startDate: i.start_date, endDate: i.end_date, startTime: i.start_time, endTime: i.end_time, period: i.period, location: i.location, partnerId: i.partner_id, status: i.status, teacherIds: [] })) : courses;
      const newStudents = s.data ? s.data.map(i => ({ id: i.id, name: i.name, cpf: i.cpf, contact: i.contact, birthDate: i.birth_date, address: i.address, courseId: i.course_id, status: i.status, class: i.class })) : students;
      const newUsers = u.data ? u.data.map(i => ({ id: i.id, name: i.name, username: i.username, role: i.role, isOnline: i.is_online, lastSeen: i.last_seen })) : users;

      setPartners(newPartners);
      setTeachers(newTeachers);
      setCourses(newCourses);
      setStudents(newStudents);
      setUsers(newUsers);

      saveToCache({ students: newStudents, teachers: newTeachers, courses: newCourses, partners: newPartners, users: newUsers });
      setIsOffline(false);
      setInfraError(null);
    } catch (err) { 
      setIsOffline(true);
    } finally { setLoading(false); }
  };

  const testAllConnections = async () => {
    if (!isConfigured) {
      setTableStatuses(prev => prev.map(s => ({ ...s, ok: false, error: 'Configuração ausente' })));
      setInfraError("O sistema não possui chaves de API configuradas. Operando em modo de simulação local.");
      setIsOffline(true);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const tables = ['partners', 'teachers', 'courses', 'students', 'users'];
    try {
        const statuses = await Promise.all(tables.map(async t => {
          const { error } = await supabase.from(t).select('count', { count: 'exact', head: true });
          return { name: t, table: t, ok: !error, error: error?.message, testedAt: new Date().toLocaleTimeString() };
        }));
        setTableStatuses(statuses as any);
        
        const allOk = statuses.every(s => s.ok);
        if (allOk) {
            await refreshData();
            setIsOffline(false);
            setInfraError(null);
        } else {
            const firstError = statuses.find(s => !s.ok)?.error || 'Erro desconhecido na infraestrutura cloud.';
            setInfraError(`Falha na conexão com o banco de dados: ${firstError}`);
            setIsOffline(true);
        }
    } catch (e: any) {
        setIsOffline(true);
        setInfraError(`Erro de rede crítico: ${e.message || 'Não foi possível contatar o servidor.'}`);
    } finally {
        setLoading(false);
    }
  };

  const syncOutbox = async () => {
    if (!navigator.onLine || !isConfigured || outbox.length === 0) return;
    
    const items = [...outbox];
    const failed = [];
    
    for (const item of items) {
      try {
        let res;
        if ((item.action === 'UPDATE' || item.action === 'DELETE') && !isUUID(item.payload.id)) {
            failed.push(item);
            continue;
        }

        if (item.action === 'INSERT') {
          const { id: tempId, ...cleanPayload } = item.payload;
          res = await supabase.from(item.table).insert([cleanPayload]);
        } 
        else if (item.action === 'UPDATE') {
          const { id, ...rest } = item.payload;
          res = await supabase.from(item.table).update(rest).eq('id', id);
        }
        else if (item.action === 'DELETE') {
          res = await supabase.from(item.table).delete().eq('id', item.payload.id);
        }
        
        if (res?.error) throw res.error;
      } catch (e) {
        failed.push(item);
      }
    }
    
    setOutbox(failed);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(failed));
    
    if (failed.length === 0 || failed.length < items.length) {
        await refreshData();
    }
  };

  useEffect(() => {
    loadInitialData();
    testAllConnections();

    const handleOnline = () => {
      testAllConnections();
      syncOutbox();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setInfraError("Sua conexão de internet caiu. O sistema está em modo offline.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAction = async (table: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any, updateLocalState: () => void) => {
    const needsUuid = action === 'UPDATE' || action === 'DELETE';
    const hasValidUuid = payload.id && isUUID(payload.id);

    if (navigator.onLine && isConfigured && (!needsUuid || hasValidUuid)) {
      try {
        let res;
        if (action === 'INSERT') {
            const { id: tempId, ...cleanPayload } = payload;
            res = await supabase.from(table).insert([cleanPayload]);
        }
        else if (action === 'UPDATE') {
          const { id, ...rest } = payload;
          res = await supabase.from(table).update(rest).eq('id', id);
        }
        else if (action === 'DELETE') {
          res = await supabase.from(table).delete().eq('id', payload.id);
        }
        
        if (res?.error) throw res.error;
        await refreshData();
        return;
      } catch (e) {
        // Fallback para outbox em caso de erro momentâneo
      }
    }

    const newItem = { 
        id: Math.random().toString(36).substr(2, 9), 
        table, 
        action, 
        payload, 
        timestamp: Date.now() 
    };
    
    setOutbox(prev => {
      const up = [...prev, newItem];
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(up));
      return up;
    });

    updateLocalState();
  };

  const addStudent = (d: any) => handleAction('students', 'INSERT', { name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate, address: d.address, course_id: isUUID(d.courseId) ? d.courseId : null, status: d.status, class: d.class || null }, () => refreshData());
  const updateStudent = (d: any) => handleAction('students', 'UPDATE', { id: d.id, name: d.name, cpf: d.cpf, contact: d.contact, birth_date: d.birthDate, address: d.address, course_id: isUUID(d.courseId) ? d.courseId : null, status: d.status, class: d.class || null }, () => refreshData());
  const removeStudent = (id: string) => handleAction('students', 'DELETE', { id }, () => refreshData());
  
  const addCourse = (d: any) => handleAction('courses', 'INSERT', { name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate, start_time: d.startTime, end_time: d.endTime, period: d.period, location: d.location, partner_id: isUUID(d.partnerId) ? d.partnerId : null, status: d.status }, () => refreshData());
  const updateCourse = (d: any) => handleAction('courses', 'UPDATE', { id: d.id, name: d.name, workload: d.workload, start_date: d.startDate, end_date: d.endDate, start_time: d.startTime, end_time: d.endTime, period: d.period, location: d.location, partner_id: isUUID(d.partnerId) ? d.partnerId : null, status: d.status }, () => refreshData());
  const removeCourse = (id: string) => handleAction('courses', 'DELETE', { id }, () => refreshData());
  
  const addTeacher = (d: any) => handleAction('teachers', 'INSERT', d, () => refreshData());
  const updateTeacher = (d: any) => handleAction('teachers', 'UPDATE', d, () => refreshData());
  const removeTeacher = (id: string) => handleAction('teachers', 'DELETE', { id }, () => refreshData());
  
  const addPartner = (d: any) => handleAction('partners', 'INSERT', { company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address }, () => refreshData());
  const updatePartner = (d: any) => handleAction('partners', 'UPDATE', { id: d.id, company_name: d.companyName, responsible: d.responsible, contact: d.contact, address: d.address }, () => refreshData());
  const removePartner = (id: string) => handleAction('partners', 'DELETE', { id }, () => refreshData());
  
  const addUser = (d: any) => handleAction('users', 'INSERT', d, () => refreshData());
  const updateUser = (d: any) => handleAction('users', 'UPDATE', d, () => refreshData());
  const removeUser = (id: string) => handleAction('users', 'DELETE', { id }, () => refreshData());

  return (
    <DataContext.Provider value={{
      students, teachers, courses, partners, users, loading, isOffline, infraError, pendingSyncCount: outbox.length, tableStatuses, isConfigValid: isConfigured, refreshData, testAllConnections, syncOutbox,
      addStudent, updateStudent, removeStudent, addTeacher, updateTeacher, removeTeacher, addCourse, updateCourse, removeCourse, addPartner, updatePartner, removePartner, addUser, updateUser, removeUser
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
