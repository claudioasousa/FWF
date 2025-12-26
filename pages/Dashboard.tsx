
import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, PlusIcon, ClipboardListIcon, ShieldIcon } from '../components/Icons';
import { NavLink } from 'react-router-dom';
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
        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
    </NavLink>
);

const Dashboard = () => {
    const { students, courses, teachers, partners, loading, tableStatuses } = useData();
    const { isAdmin } = useAuth();
    const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopySQL = () => {
        navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const studentStats = useMemo(() => {
        return {
            cursando: students.filter(s => s.status === 'CURSANDO').length,
            concluidos: students.filter(s => s.status === 'APROVADO').length,
            evasao: students.filter(s => s.status === 'DESISTENTE').length,
            aproveitamento: students.length > 0 ? Math.round((students.filter(s => s.status === 'APROVADO').length / students.length) * 100) : 0
        }
    }, [students]);

    const recentStudents = useMemo(() => {
        return [...students].reverse().slice(0, 5);
    }, [students]);

    const connectionOk = tableStatuses.length > 0 && tableStatuses.every(s => s.ok);

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto space-y-10 pb-10">
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
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : (connectionOk ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse')} mr-3`}></div>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            {loading ? 'Sincronizando...' : (connectionOk ? 'Sistema Online' : 'Atenção Necessária')}
                        </span>
                    </button>
                </div>
            </header>

            {/* ATALHOS RÁPIDOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <QuickAction to="/alunos" label="Nova Matrícula" icon={<PlusIcon className="h-6 w-6" />} bg="bg-blue-600" />
                <QuickAction to="/cursos" label="Gerenciar Oferta" icon={<BookOpenIcon className="h-6 w-6" />} bg="bg-indigo-600" />
                <QuickAction to="/relatorios" label="Extrair PDF" icon={<ClipboardListIcon className="h-6 w-6" />} bg="bg-emerald-600" />
            </div>

            {/* CARDS PRINCIPAIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total de Alunos" value={students.length} icon={<UsersIcon className="h-8 w-8 text-blue-600" />} color="blue" trend="8" />
                <StatCard title="Cursos Ativos" value={courses.filter(c => c.status === 'Ativo').length} icon={<BookOpenIcon className="h-8 w-8 text-indigo-600" />} color="indigo" />
                <StatCard title="Professores" value={teachers.length} icon={<UserCheckIcon className="h-8 w-8 text-amber-600" />} color="amber" />
                <StatCard title="Patrocínios" value={partners.length} icon={<BriefcaseIcon className="h-8 w-8 text-emerald-600" />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* PERFORMANCE ACADÊMICA */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-black mb-8 tracking-tight">Performance Acadêmica</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Engajados</p>
                                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{studentStats.cursando}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-emerald-400 mb-1">Graduados</p>
                                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{studentStats.concluidos}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-rose-400 mb-1">Evasão</p>
                                <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{studentStats.evasao}</p>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-dashed border-blue-200 dark:border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600">
                                    <ShieldIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black dark:text-white">Infraestrutura Supabase</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Exporte e configure as tabelas do banco de dados.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsSchemaModalOpen(true)}
                                className="px-8 py-4 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-500/10"
                            >
                                Gerar Script SQL
                            </button>
                        </div>
                    )}
                </div>

                {/* ÚLTIMOS INGRESSOS */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black mb-8 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-ping"></span>
                        Novas Matrículas
                    </h2>
                    <div className="space-y-6">
                        {recentStudents.length > 0 ? recentStudents.map(s => (
                            <div key={s.id} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate leading-tight">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-300 font-black uppercase text-xs tracking-tighter">
                                {loading ? 'Carregando...' : 'Nenhuma matrícula'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL SCHEMA */}
            <Modal isOpen={isSchemaModalOpen} onClose={() => setIsSchemaModalOpen(false)} title="Exportar Schema para Supabase">
                <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Para habilitar a sincronização, copie o script abaixo e cole-o no 
                        <strong className="text-blue-600"> SQL Editor </strong> 
                        do seu painel Supabase. 
                        <br/><br/>
                        <span className="text-rose-500 font-bold">Importante:</span> Este script desativa o RLS para que o aplicativo possa salvar dados.
                    </p>
                    
                    <div className="relative group">
                        <pre className="bg-gray-900 text-blue-400 p-6 rounded-2xl text-[10px] font-mono overflow-x-auto max-h-[300px] custom-scrollbar border border-gray-800">
                            {DATABASE_SCHEMA_SQL}
                        </pre>
                        <button 
                            onClick={handleCopySQL}
                            className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'}`}
                        >
                            {copySuccess ? 'Copiado!' : 'Copiar SQL'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL SAÚDE DO SISTEMA */}
            <Modal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} title="Diagnóstico de Conexão">
                <div className="space-y-6">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Status das Tabelas</p>
                    <div className="space-y-3">
                        {tableStatuses.map(status => (
                            <div key={status.name} className={`p-4 rounded-2xl border flex items-center justify-between ${status.ok ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-sm uppercase">{status.name}</span>
                                </div>
                                <span className="text-[10px] font-black uppercase px-2 py-1 bg-white/50 rounded-lg">
                                    {status.ok ? 'Conectado' : 'Falhou'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {!connectionOk && (
                        <div className="bg-rose-100 p-4 rounded-2xl text-rose-800 text-xs font-bold leading-relaxed">
                            ⚠️ Uma ou mais tabelas não estão respondendo. Isso ocorre porque o script SQL não foi executado ou o RLS está bloqueando o acesso. Vá em "Gerar Script SQL" e execute o código no seu Supabase.
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
