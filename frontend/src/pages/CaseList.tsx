import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';

export default function CaseList() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getCases();
                setCases(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
        return matchesSearch && matchesPriority;
    });

    const statusColors: Record<string, string> = {
        'new': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        'under_review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };

    const statusLabels: Record<string, string> = {
        'new': 'Nuevo',
        'under_review': 'En Revisión',
        'in_progress': 'En Progreso',
        'resolved': 'Resuelto'
    };

    const priorityColors: Record<string, string> = {
        'ALTA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/30',
        'MEDIA': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30',
        'BAJA': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30'
    };

    const priorityDotColors: Record<string, string> = {
        'ALTA': 'bg-red-500',
        'MEDIA': 'bg-amber-500',
        'BAJA': 'bg-emerald-500',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    if (loading) return <div className="p-8 text-center">Cargando casos...</div>;

    return (
        <>
            {/* Page Heading and Controls - SAME AS BEFORE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Panel de priorización</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal max-w-2xl">
                        Detección y gestión de vulnerabilidad en personas mayores y dependientes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Exportar CSV
                    </button>
                    <Link to="/cases/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Nuevo Caso
                    </Link>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                {/* Search */}
                <div className="w-full lg:max-w-md relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary focus:outline-none sm:text-sm shadow-sm"
                        placeholder="Buscar por nombre, DNI o expediente..."
                        type="text"
                    />
                </div>
                {/* Chips Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    <button
                        onClick={() => setPriorityFilter(null)}
                        className={`flex whitespace-nowrap items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${priorityFilter === null
                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-transparent hover:bg-slate-300'
                            }`}
                    >
                        Todos
                    </button>
                    <div className="h-auto w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                    <button
                        onClick={() => setPriorityFilter(priorityFilter === 'ALTA' ? null : 'ALTA')}
                        className={`flex whitespace-nowrap items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${priorityFilter === 'ALTA'
                            ? 'bg-red-100 text-red-800 border-red-300 ring-1 ring-red-300 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                    >
                        Vulnerabilidad Alta
                        {priorityFilter === 'ALTA' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <button
                        onClick={() => setPriorityFilter(priorityFilter === 'MEDIA' ? null : 'MEDIA')}
                        className={`flex whitespace-nowrap items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${priorityFilter === 'MEDIA'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 ring-1 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                            }`}
                    >
                        Vulnerabilidad Media
                        {priorityFilter === 'MEDIA' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <button
                        onClick={() => setPriorityFilter(priorityFilter === 'BAJA' ? null : 'BAJA')}
                        className={`flex whitespace-nowrap items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${priorityFilter === 'BAJA'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}
                    >
                        Vulnerabilidad Baja
                        {priorityFilter === 'BAJA' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[25%]">Nombre</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[10%]">Fecha</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[10%]">Edad</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[15%]">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[20%]">Nivel de Vulnerabilidad</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[20%]">Motivo Principal</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right w-[10%]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filteredCases.map((c) => {
                                // const level = c.priority || 'BAJA'; 
                                return (
                                    <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs mr-3">
                                                    {getInitials(c.fullName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{c.fullName}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">ID: {c.id.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                            {new Date().toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{c.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold capitalize ${statusColors[c.status] || statusColors['new']}`}>
                                                {statusLabels[c.status] || 'Nuevo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[c.priority || 'BAJA']}`}>
                                                <span className={`size-1.5 rounded-full mr-1.5 ${priorityDotColors[c.priority || 'BAJA']}`}></span>
                                                {c.priority || 'BAJA'} ({c.score || 0})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {c.priority_reason_codes && c.priority_reason_codes.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {c.priority_reason_codes.slice(0, 2).map((code) => (
                                                        <span key={code} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                            {code.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                    {c.priority_reason_codes.length > 2 && <span className="text-xs text-slate-400">+{c.priority_reason_codes.length - 2}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Sin alertas</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/history/${c.id}`} className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 inline-block mr-1" title="Ver Historial">
                                                <span className="material-symbols-outlined text-[20px]">history</span>
                                            </Link>
                                            <Link to={`/cases/${c.id}`} className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 inline-block" title="Ver Detalles">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredCases.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No hay casos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
