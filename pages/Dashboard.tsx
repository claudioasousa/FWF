
import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, PlusIcon, ClipboardListIcon } from '../components/Icons';
import { NavLink } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className={`p-4 bg-${color}-50 dark:bg-${color}-900/30 rounded-2xl group-hover:rotate-6 transition-transform`}>
            {icon}
        </div>
        <div className="ml-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-black mb-1">{title}</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
        </div>
    </div>
);

const QuickAction = ({ to, label, icon, bg }: { to: string; label: string; icon: React.ReactNode; bg: string }) => (
    <NavLink to={to} className={`${bg} p-4 rounded-2xl flex items-center justify-between group hover:scale-[1.02] active:scale-95 transition-all text-white shadow-lg`}>
        <span className="font-black text-sm uppercase tracking-tight">{label}</span>
        <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
            {icon}
        </div>
    </NavLink>
);

const Dashboard = () => {
    const { students, courses, teachers, partners } = useData();

    const studentStats = useMemo(() => {
        return {
            cursando: students.filter(s => s.status === 'CURSANDO').length,
            concluidos: students.filter(s => s.status === 'APROVADO').length,
            evasao: students.filter(s => s.status === 'DESISTENTE').length
        }
    }, [students]);

    const recentStudents = useMemo(() => {
        return [...students].reverse().slice(0, 5);
    }, [students]);

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto pb-10">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Portal Admin</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Acompanhamento em tempo real da rede educacional.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase text-gray-400">v2.0 Estável</span>
                </div>
            </header>

            {/* ATALHOS RÁPIDOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <QuickAction to="/alunos" label="Nova Matrícula" icon={<PlusIcon className="h-5 w-5" />} bg="bg-blue-600" />
                <QuickAction to="/cursos" label="Novo Curso" icon={<BookOpenIcon className="h-5 w-5" />} bg="bg-indigo-600" />
                <QuickAction to="/enturmacao" label="Distribuir Turmas" icon={<ClipboardListIcon className="h-5 w-5" />} bg="bg-emerald-600" />
            </div>

            {/* CARDS PRINCIPAIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Educandos" value={students.length} icon={<UsersIcon className="h-7 w-7 text-blue-600" />} color="blue" />
                <StatCard title="Cursos" value={courses.length} icon={<BookOpenIcon className="h-7 w-7 text-emerald-600" />} color="emerald" />
                <StatCard title="Docentes" value={teachers.length} icon={<UserCheckIcon className="h-7 w-7 text-amber-600" />} color="amber" />
                <StatCard title="Parceiros" value={partners.length} icon={<BriefcaseIcon className="h-7 w-7 text-indigo-600" />} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SITUAÇÃO ACADÊMICA */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <h2 className="text-2xl font-black mb-8">Performance Acadêmica</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-50 dark:border-blue-900/30">
                                <p className="text-[10px] font-black uppercase text-blue-400 mb-2">Em curso</p>
                                <p className="text-4xl font-black text-blue-700 dark:text-blue-300">{studentStats.cursando}</p>
                            </div>
                            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-50 dark:border-emerald-900/30">
                                <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Sucesso (Aprov)</p>
                                <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{studentStats.concluidos}</p>
                            </div>
                            <div className="p-6 bg-rose-50/50 dark:bg-rose-900/10 rounded-3xl border border-rose-50 dark:border-rose-900/30">
                                <p className="text-[10px] font-black uppercase text-rose-400 mb-2">Desistência</p>
                                <p className="text-4xl font-black text-rose-700 dark:text-rose-300">{studentStats.evasao}</p>
                            </div>
                        </div>
                        <div className="mt-10 flex justify-end">
                            <NavLink to="/relatorios" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-2 rounded-xl text-sm font-black text-gray-600 dark:text-gray-300 transition-colors">Exportar Relatórios PDF</NavLink>
                        </div>
                        <div className="absolute bottom-[-50px] left-[-30px] text-[180px] text-blue-500/5 select-none pointer-events-none font-black italic">DATA</div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-10 rounded-[40px] shadow-2xl shadow-blue-500/30 text-white relative group overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-3">Expansão de Cursos</h2>
                            <p className="text-blue-100 max-w-md font-medium">Novas parcerias corporativas e editais estão disponíveis para planejamento.</p>
                            <NavLink to="/parceiros" className="mt-8 inline-flex bg-white text-blue-700 px-8 py-3 rounded-2xl font-black hover:bg-blue-50 hover:shadow-lg transition-all active:scale-95">Gerenciar Parceiros</NavLink>
                        </div>
                        <div className="absolute top-10 right-10 text-9xl opacity-20 group-hover:scale-125 transition-transform duration-700">🏢</div>
                    </div>
                </div>

                {/* ATIVIDADE RECENTE */}
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h2 className="text-2xl font-black mb-8 flex items-center">
                        Últimos Ingressos
                        <span className="ml-3 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-[10px] rounded-lg">LIVE</span>
                    </h2>
                    <div className="space-y-8 flex-1">
                        {recentStudents.length > 0 ? recentStudents.map(s => (
                            <div key={s.id} className="flex items-center gap-5 group cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-black text-blue-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{s.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 py-10">
                                <span className="text-6xl mb-4">🌪️</span>
                                <p className="font-bold uppercase text-xs">Sem atividade</p>
                            </div>
                        )}
                    </div>
                    <NavLink to="/alunos" className="mt-10 text-center py-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-[10px] font-black text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all tracking-widest uppercase">Ver Listagem Completa</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
