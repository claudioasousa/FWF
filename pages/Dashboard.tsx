import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
// Fix: Added ShieldIcon to the import list from icons component
import { UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, PlusIcon, ClipboardListIcon, ShieldIcon } from '../components/Icons';
import { NavLink } from 'react-router';
import { DATABASE_SCHEMA_SQL } from '../constants/databaseSchema';
import Modal from '../components/Modal';

const StatCard = ({ title, value, icon, gradient, color }: { title: string; value: number; icon: React.ReactNode; gradient: string; color: string }) => (
    <div className={`group relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>
        {/* Decorative Gradient Background */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity blur-3xl`}></div>
        
        <div className="flex justify-between items-start relative z-10">
            <div className={`p-5 rounded-3xl bg-slate-50 dark:bg-white/5 text-${color}-600 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-${color}-500 group-hover:to-${color}-700 group-hover:text-white transition-all duration-500`}>
                {icon}
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</span>
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-mono">{value}</span>
            </div>
        </div>
        
        <div className="mt-8 relative z-10">
          <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${gradient} w-[70%] group-hover:w-full transition-all duration-1000`}></div>
          </div>
        </div>
    </div>
);

const QuickAction = ({ to, label, icon, gradient }: { to: string; label: string; icon: React.ReactNode; gradient: string }) => (
    <NavLink to={to} className={`bg-gradient-to-br ${gradient} p-8 rounded-[2.5rem] flex items-center justify-between group hover:shadow-2xl hover:scale-[1.02] transition-all text-white relative overflow-hidden active:scale-95`}>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
        <span className="font-black text-[13px] uppercase tracking-widest relative z-10">{label}</span>
        <div className="p-4 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform relative z-10">
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

    const handleCopySQL = () => {
        navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const connectionOk = isConfigValid && tableStatuses.length > 0 && tableStatuses.every(s => s.ok);

    return (
        <div className="animate-fadeIn space-y-12 pb-20">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-200 dark:border-blue-500/20">
                            Version 6.9 Pro
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Management</span>
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.8]">Painel Geral</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-6 text-xl font-medium max-w-xl">Bem-vindo à nova interface v6.9. Seus dados estão sincronizados e seguros.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsHealthModalOpen(true)}
                        className={`px-6 py-4 rounded-2xl glass flex items-center gap-4 shadow-xl active:scale-95 transition-all`}
                    >
                        <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : (connectionOk ? 'bg-emerald-500' : 'bg-rose-500')} shadow-[0_0_12px_rgba(16,185,129,0.5)]`}></div>
                        <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-[0.2em]">
                            {loading ? 'Verificando...' : (connectionOk ? 'Cloud Connect' : 'Network Error')}
                        </span>
                    </button>
                    {isAdmin && (
                        <button 
                            onClick={() => setIsSchemaModalOpen(true)}
                            className="p-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            title="Script SQL"
                        >
                            <ShieldIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <QuickAction to="/alunos" label="Nova Matrícula" icon={<PlusIcon className="h-6 w-6" />} gradient="from-blue-600 to-indigo-700" />
                <QuickAction to="/cursos" label="Gerir Oferta" icon={<BookOpenIcon className="h-6 w-6" />} gradient="from-violet-600 to-purple-700" />
                <QuickAction to="/relatorios" label="Extrair Dados" icon={<ClipboardListIcon className="h-6 w-6" />} gradient="from-emerald-500 to-teal-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                <StatCard title="Estudantes" value={students.length} icon={<UsersIcon className="h-8 w-8" />} gradient="from-blue-500 to-blue-700" color="blue" />
                <StatCard title="Cursos" value={courses.filter(c => c.status === 'Ativo').length} icon={<BookOpenIcon className="h-8 w-8" />} gradient="from-indigo-500 to-indigo-700" color="indigo" />
                <StatCard title="Docentes" value={teachers.length} icon={<UserCheckIcon className="h-8 w-8" />} gradient="from-amber-500 to-orange-700" color="amber" />
                <StatCard title="Empresas" value={partners.length} icon={<BriefcaseIcon className="h-8 w-8" />} gradient="from-emerald-500 to-emerald-700" color="emerald" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter">Fluxo Acadêmico</h2>
                                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Tempo Real</p>
                            </div>
                            <button onClick={refreshData} className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Sincronizar</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                            {[
                                { label: 'Cursando', val: studentStats.cursando, color: 'blue' },
                                { label: 'Aprovados', val: studentStats.concluidos, color: 'emerald' },
                                { label: 'Evasão', val: studentStats.evasao, color: 'rose' }
                            ].map((item) => (
                                <div key={item.label} className="p-8 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:scale-105 transition-transform duration-500">
                                    <p className={`text-[10px] font-black uppercase text-${item.color}-500 mb-2 tracking-[0.2em]`}>{item.label}</p>
                                    <p className={`text-4xl font-mono font-black text-slate-900 dark:text-white`}>{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5">
                    <h2 className="text-3xl font-black tracking-tighter mb-10">Últimas Atividades</h2>
                    <div className="space-y-8">
                        {students.slice(-4).reverse().map(s => (
                            <div key={s.id} className="flex items-center gap-5 group">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10 flex items-center justify-center font-black text-blue-600 group-hover:scale-110 transition-transform">
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Matrícula Realizada</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${s.status === 'CURSANDO' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals with premium styling */}
            <Modal isOpen={isSchemaModalOpen} onClose={() => setIsSchemaModalOpen(false)} title="Terminal de Dados">
                <div className="space-y-6">
                    <div className="p-6 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-2xl">
                        <p className="text-[12px] text-blue-600 dark:text-blue-300 font-black uppercase tracking-widest leading-loose">
                            Implementação de Segurança v6.9: Use este script para provisionar tabelas em ambientes de produção.
                        </p>
                    </div>
                    <div className="relative group">
                        <pre className="bg-slate-950 text-emerald-400 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto max-h-[450px] custom-scrollbar border border-white/5">
                            {DATABASE_SCHEMA_SQL}
                        </pre>
                        <button 
                            onClick={handleCopySQL}
                            className={`absolute top-6 right-6 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {copySuccess ? 'Sucesso!' : 'Copiar Terminal'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} title="Diagnóstico Cloud">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {tableStatuses.map(status => (
                            <div key={status.name} className={`p-6 rounded-[2rem] border transition-all ${status.ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${status.ok ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                        <span className="font-black text-xs uppercase tracking-[0.2em]">{status.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${status.ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                        {status.ok ? 'Ativo' : 'Erro'}
                                    </span>
                                </div>
                                {status.error && <p className="mt-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg line-clamp-1">{status.error}</p>}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={testAllConnections}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30"
                    >
                        Revalidar Infraestrutura
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;