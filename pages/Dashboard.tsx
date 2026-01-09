
import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, PlusIcon, ClipboardListIcon } from '../components/Icons';
// Fix: Import from react-router to resolve missing member error in some environments
import { NavLink } from 'react-router';
import { DATABASE_SCHEMA_SQL } from '../constants/databaseSchema';
import Modal from '../components/Modal';

const StatCard = ({ title, value, icon, color, trend }: { title: string; value: number; icon: React.ReactNode; color: string; trend?: string }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
        <div className="flex justify-between items-start z-10">
            <div className={`p-4 bg-${color}-50 dark:bg-${color}-900/30 rounded-3xl group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            {trend && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                    +{trend}% ↗
                </span>
            )}
        </div>
        <div className="mt-8 z-10">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">{title}</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">{value}</p>
        </div>
        <div className={`absolute -bottom-10 -right-10 text-9xl opacity-5 group-hover:scale-150 transition-transform duration-1000 select-none pointer-events-none text-${color}-600`}>
            {icon}
        </div>
    </div>
);

const QuickAction = ({ to, label, icon, bg }: { to: string; label: string; icon: React.ReactNode; bg: string }) => (
    <NavLink to={to} className={`${bg} p-6 rounded-3xl flex items-center justify-between group hover:shadow-2xl transition-all text-white relative overflow-hidden active:scale-95`}>
        <span className="font-black text-sm uppercase tracking-wider relative z-10">{label}</span>
        <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform relative z-10">
            {icon}
        </div>
    </NavLink>
);

const Dashboard = () => {
    const { students, courses, teachers, partners, loading, tableStatuses, refreshData, testAllConnections, isConfigValid } = useData();
    const { isAdmin } = useAuth();
    const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const studentStats = useMemo(() => {
        return {
            cursando: students.filter(s => s.status === 'CURSANDO').length,
            concluidos: students.filter(s => s.status === 'APROVADO').length,
            evasao: students.filter(s => s.status === 'DESISTENTE').length,
        }
    }, [students]);

    const recentStudents = useMemo(() => {
        return [...students].reverse().slice(0, 5);
    }, [students]);

    const handleCopySQL = () => {
        navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const connectionOk = isConfigValid && tableStatuses.length > 0 && tableStatuses.every(s => s.ok);

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto space-y-10 pb-10">
            {!isConfigValid && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-500 p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white text-3xl shrink-0">⚠️</div>
                    <div>
                        <h3 className="text-rose-600 dark:text-rose-400 font-black text-xl mb-1">Acesso Offline Ativado</h3>
                        <p className="text-rose-700 dark:text-rose-300 text-sm font-bold opacity-80 leading-relaxed">
                            O sistema detectou que a URL do Supabase não foi configurada. Você pode usar o app normalmente para testes locais, mas os dados não serão salvos na nuvem. 
                            Atualize <code>lib/supabase.ts</code> para sincronizar.
                        </p>
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Painel de Gestão</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium">Controle operacional e métricas em tempo real.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsHealthModalOpen(true)}
                        className={`px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${connectionOk ? 'border-emerald-100' : 'border-rose-100'} flex items-center transition-all hover:scale-105`}
                    >
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : (connectionOk ? 'bg-emerald-500' : 'bg-rose-500')} mr-3`}></div>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            {loading ? 'Verificando...' : (connectionOk ? 'Supabase Online' : 'Status: Local / Erro')}
                        </span>
                    </button>
                    {isAdmin && (
                        <button 
                            onClick={() => setIsSchemaModalOpen(true)}
                            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-900/20"
                        >
                            Script SQL
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <QuickAction to="/alunos" label="Nova Matrícula" icon={<PlusIcon className="h-6 w-6" />} bg="bg-blue-600" />
                <QuickAction to="/cursos" label="Gerenciar Oferta" icon={<BookOpenIcon className="h-6 w-6" />} bg="bg-indigo-600" />
                <QuickAction to="/relatorios" label="Extrair PDF" icon={<ClipboardListIcon className="h-6 w-6" />} bg="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total de Alunos" value={students.length} icon={<UsersIcon className="h-8 w-8 text-blue-600" />} color="blue" />
                <StatCard title="Cursos Ativos" value={courses.filter(c => c.status === 'Ativo').length} icon={<BookOpenIcon className="h-8 w-8 text-indigo-600" />} color="indigo" />
                <StatCard title="Professores" value={teachers.length} icon={<UserCheckIcon className="h-8 w-8 text-amber-600" />} color="amber" />
                <StatCard title="Patrocínios" value={partners.length} icon={<BriefcaseIcon className="h-8 w-8 text-emerald-600" />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black tracking-tight">Status Acadêmico</h2>
                            <button onClick={refreshData} className="text-[10px] font-black uppercase text-blue-500 hover:underline">Atualizar Dados</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl text-center">
                                <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Cursando</p>
                                <p className="text-3xl font-black text-blue-600">{studentStats.cursando}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl text-center">
                                <p className="text-[10px] font-black uppercase text-emerald-400 mb-1">Aprovados</p>
                                <p className="text-3xl font-black text-emerald-600">{studentStats.concluidos}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl text-center">
                                <p className="text-[10px] font-black uppercase text-rose-400 mb-1">Evasão</p>
                                <p className="text-3xl font-black text-rose-600">{studentStats.evasao}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black mb-8">Novas Matrículas</h2>
                    <div className="space-y-6">
                        {recentStudents.length > 0 ? recentStudents.map(s => (
                            <div key={s.id} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{s.status}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-gray-400 font-bold uppercase text-[10px]">Sem dados</p>
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={isSchemaModalOpen} onClose={() => setIsSchemaModalOpen(false)} title="Script SQL Purificado">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-2xl">
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                            Crie seu banco de dados no Supabase e execute este script no SQL Editor para configurar as tabelas automaticamente.
                        </p>
                    </div>
                    <div className="relative">
                        <pre className="bg-gray-900 text-emerald-400 p-6 rounded-2xl text-[10px] font-mono overflow-x-auto max-h-[400px] custom-scrollbar border border-gray-800">
                            {DATABASE_SCHEMA_SQL}
                        </pre>
                        <button 
                            onClick={handleCopySQL}
                            className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {copySuccess ? 'Copiado!' : 'Copiar SQL'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} title="Teste de Conexões">
                <div className="space-y-4">
                    {!isConfigValid && (
                         <div className="p-6 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-3xl border border-rose-100 dark:border-rose-900/50">
                            <h4 className="font-black text-xs uppercase mb-2">🔴 Erro de DNS Detectado</h4>
                            <p className="text-xs font-medium leading-relaxed">
                                O navegador não consegue resolver o servidor do Supabase. <br/><br/>
                                <b>Solução:</b> Acesse <code>lib/supabase.ts</code> e insira uma URL válida como <code>https://abcxyz.supabase.co</code>. 
                                Atualmente o sistema ignora a URL para evitar travar a interface.
                            </p>
                         </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-2">
                        {tableStatuses.map(status => (
                            <div key={status.name} className={`p-4 rounded-2xl border flex flex-col gap-1 ${status.ok ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' : 'bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-xs uppercase tracking-tight">{status.name}</span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${status.ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                        {status.ok ? 'Sucesso' : 'Erro'}
                                    </span>
                                </div>
                                {status.error && <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 truncate">{status.error}</p>}
                                <p className="text-[8px] text-gray-400 font-medium">Último teste: {status.testedAt || 'Nunca'}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            onClick={testAllConnections}
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Testando...' : 'Re-testar Todas Conexões'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
