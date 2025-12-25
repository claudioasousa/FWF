import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { UsersIcon, BookOpenIcon, UserCheckIcon, BriefcaseIcon, PlusIcon, ClipboardListIcon } from '../components/Icons';
import { NavLink } from 'react-router-dom';

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
    const { students, courses, teachers, partners } = useData();

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

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto space-y-10 pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Painel de Gestão</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium">Controle operacional e métricas em tempo real.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3"></div>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Servidor Ativo</span>
                    </div>
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
                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Taxa de Sucesso</span>
                                <span className="text-xl font-black text-emerald-500">{studentStats.aproveitamento}%</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${studentStats.aproveitamento}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[48px] text-white flex items-center justify-between group overflow-hidden relative shadow-2xl shadow-blue-500/20">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-2 tracking-tighter">Expansão 2025</h2>
                            <p className="text-blue-200 font-medium max-w-sm">Novas parcerias corporativas abertas para o próximo semestre letivo.</p>
                            <button className="mt-6 bg-white text-blue-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95">Ver Parceiros</button>
                        </div>
                        <div className="text-9xl opacity-20 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">🏢</div>
                    </div>
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
                            <div className="text-center py-10 text-gray-300 font-black uppercase text-xs tracking-tighter">Vazio</div>
                        )}
                    </div>
                    <NavLink to="/alunos" className="mt-10 w-full py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all text-center block uppercase tracking-widest">Listagem Completa</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;