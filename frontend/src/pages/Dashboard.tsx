import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';

export default function Dashboard() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        active: 0,
        critical: 0,
        pending: 0,
        resolved: 0
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getCases();
                setCases(data);

                // Calculate stats
                const active = data.filter(c => c.status !== 'resolved').length;
                const critical = data.filter(c => c.priority === 'ALTA').length;
                const pending = data.filter(c => c.status === 'under_review').length;
                const resolved = data.filter(c => c.status === 'resolved').length;

                setStats({ active, critical, pending, resolved });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const getRiskLevel = (c: Case) => {
        if (c.priority === 'ALTA') return { label: 'ALTA', color: 'text-status-red', bg: 'bg-red-100 dark:bg-red-900/30' };
        if (c.priority === 'MEDIA') return { label: 'MEDIA', color: 'text-status-yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
        return { label: 'BAJA', color: 'text-primary', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    };

    // Calculate dynamic stats for Chart & Alerts
    const totalCases = cases.length;

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let highRiskCases: Case[] = [];

    cases.forEach(c => {
        if (c.priority === 'ALTA') {
            highCount++;
            highRiskCases.push(c);
        } else if (c.priority === 'MEDIA') {
            mediumCount++;
        } else {
            lowCount++;
        }
    });

    const highPct = totalCases > 0 ? Math.round((highCount / totalCases) * 100) : 0;
    const mediumPct = totalCases > 0 ? Math.round((mediumCount / totalCases) * 100) : 0;
    const lowPct = totalCases > 0 ? Math.round((lowCount / totalCases) * 100) : 0;

    // Adjust for rounding errors to ensure 100% total if needed, but for visual chart approx is fine.

    // Sort high risk cases by severity (mock AI priority)
    // Severity = Incident Frequency + Social Isolation
    highRiskCases.sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
    });

    // Chart Dash Arrays (Circumference approx 100)
    // We use 100 for simplicity as per existing SVG setup (r=16 -> circ ~100.5)
    const C = 100;
    const highDash = `${(highPct / 100) * C} ${C}`;
    const highOffset = 0; // Starts at top

    const mediumDash = `${(mediumPct / 100) * C} ${C}`;
    const mediumOffset = -((highPct / 100) * C); // Starts after High

    const lowDash = `${(lowPct / 100) * C} ${C}`;
    const lowOffset = -(((highPct + mediumPct) / 100) * C); // Starts after Medium

    if (loading) return <div className="p-8 text-center animate-pulse">Cargando dashboard...</div>;

    return (
        <div className="flex-1 w-full max-w-[1440px] mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Resumen de Triage</h1>
                    <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">Triage de Vulnerabilidad Potenciado por IA</p>
                </div>
                <div className="hidden md:block relative w-72">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89]">search</span>
                    <input className="w-full rounded-lg border-none bg-background-light dark:bg-[#2a303c] py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50" placeholder="Buscar caso o paciente..." type="text" />
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Active Cases */}
                <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#616f89] dark:text-[#9ca3af]">Casos Activos</p>
                        <span className="material-symbols-outlined text-primary">folder_open</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                        <p className="text-xs font-semibold text-status-green flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> 12%</p>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-2">
                        <div className="h-full w-[70%] rounded-full bg-primary"></div>
                    </div>
                </div>
                {/* Critical Cases */}
                <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#616f89] dark:text-[#9ca3af]">Prioridad Crítica</p>
                        <span className="material-symbols-outlined text-status-red">emergency</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.critical}</p>
                        <p className="text-xs font-semibold text-status-red flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> 4%</p>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-2">
                        <div className="h-full w-[40%] rounded-full bg-status-red"></div>
                    </div>
                </div>
                {/* Follow-up */}
                <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#616f89] dark:text-[#9ca3af]">Seguimiento Pendiente</p>
                        <span className="material-symbols-outlined text-status-yellow">event_repeat</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
                        <p className="text-xs font-semibold text-status-yellow flex items-center"><span className="material-symbols-outlined text-xs">remove</span> 0%</p>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-2">
                        <div className="h-full w-[60%] rounded-full bg-status-yellow"></div>
                    </div>
                </div>
                {/* Resolved */}
                <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#616f89] dark:text-[#9ca3af]">Resueltos Hoy</p>
                        <span className="material-symbols-outlined text-status-green">task_alt</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.resolved}</p>
                        <p className="text-xs font-semibold text-status-green flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> 24%</p>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-2">
                        <div className="h-full w-[90%] rounded-full bg-status-green"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Urgency Distribution & Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart Area */}
                    <div className="rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribución de Urgencia</h3>
                            <select className="rounded-lg border-none bg-background-light dark:bg-[#2a303c] text-sm py-1 pl-3 pr-8 focus:ring-1 focus:ring-primary/30 text-slate-900 dark:text-white">
                                <option>Todo el tiempo</option>
                                <option>Esta Semana</option>
                                <option>Mes Pasado</option>
                            </select>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                            {/* Custom Donut Chart Visualization */}
                            <div className="relative flex h-48 w-48 items-center justify-center">
                                {/* If no cases, show gray circle */}
                                {totalCases === 0 ? (
                                    <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                                        <circle className="dark:stroke-gray-800" cx="18" cy="18" fill="transparent" r="16" stroke="#f3f4f6" strokeWidth="3"></circle>
                                    </svg>
                                ) : (
                                    <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                                        <circle className="dark:stroke-gray-800" cx="18" cy="18" fill="transparent" r="16" stroke="#f3f4f6" strokeWidth="3"></circle>

                                        {/* High Segment (Red) */}
                                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#EF4444"
                                            strokeDasharray={highDash}
                                            strokeDashoffset={highOffset}
                                            strokeWidth="3"
                                            className="transition-all duration-1000 ease-out"
                                        ></circle>

                                        {/* Medium Segment (Yellow) */}
                                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#F59E0B"
                                            strokeDasharray={mediumDash}
                                            strokeDashoffset={mediumOffset}
                                            strokeWidth="3"
                                            className="transition-all duration-1000 ease-out"
                                        ></circle>

                                        {/* Low Segment (Blue) */}
                                        <circle cx="18" cy="18" fill="transparent" r="16" stroke="#1152d4"
                                            strokeDasharray={lowDash}
                                            strokeDashoffset={lowOffset}
                                            strokeWidth="3"
                                            className="transition-all duration-1000 ease-out"
                                        ></circle>
                                    </svg>
                                )}

                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalCases}</span>
                                    <span className="text-xs text-[#616f89]">Total Casos</span>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#242c3d]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-status-red"></div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">Alto Riesgo (IA)</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{highPct}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#242c3d]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-status-yellow"></div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">Prioridad Media</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{mediumPct}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#242c3d]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">Baja Prioridad</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{lowPct}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="rounded-xl bg-white dark:bg-[#1a2130] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Casos Prioritarios Recientes</h3>
                            <Link to="/cases" className="text-sm font-semibold text-primary hover:underline">Ver Todos</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-[#242c3d] text-xs uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af]">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Paciente / Caso ID</th>
                                        <th className="px-6 py-3 font-semibold">Nivel Riesgo</th>
                                        <th className="px-6 py-3 font-semibold">Estado</th>
                                        <th className="px-6 py-3 font-semibold">Prof. Asignado</th>
                                        <th className="px-6 py-3 font-semibold">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {cases.slice(0, 5).map((c) => {
                                        const risk = getRiskLevel(c);
                                        return (
                                            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#242c3d] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 dark:text-white">{c.fullName}</span>
                                                        <span className="text-xs text-[#616f89]">#{c.id.substring(0, 8)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center gap-1 rounded-full ${risk.bg} px-2.5 py-0.5 text-xs font-bold ${risk.color} w-fit`}>
                                                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> {risk.label}
                                                        </span>
                                                        {c.priority_reason_codes && c.priority_reason_codes.length > 0 && (
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 pl-1">
                                                                {c.priority_reason_codes[0].replace(/_/g, ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize
                                                        ${c.status === 'new' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : ''}
                                                        ${c.status === 'under_review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                                                        ${c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                                                        ${c.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}
                                                    `}>
                                                        {c.status === 'new' ? 'Nuevo' :
                                                            c.status === 'under_review' ? 'En Revisión' :
                                                                c.status === 'in_progress' ? 'En Progreso' :
                                                                    'Resuelto'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">Dr. Asignado</td>
                                                <td className="px-6 py-4">
                                                    <Link to={`/cases/${c.id}`} className="rounded bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">REVISAR</Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {cases.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay casos recientes.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Immediate Attention */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-status-red">bolt</span>
                                Atención Inmediata
                            </h3>
                            <span className="rounded bg-status-red/10 px-2 py-0.5 text-[10px] font-bold text-status-red">{highRiskCases.length} ALERTAS</span>
                        </div>
                        <div className="space-y-4">

                            {/* Dynamic Alerts */}
                            {highRiskCases.length > 0 ? (
                                highRiskCases.slice(0, 3).map((c, idx) => (
                                    <div key={idx} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border-l-4 border-status-red group cursor-pointer hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-status-red">SCORING SYSTEM</span>
                                            <span className="text-[10px] text-[#616f89]">Hace {Math.floor(Math.random() * 60)}m</span>
                                        </div>
                                        <p className="text-sm font-semibold mb-2 text-slate-900 dark:text-white">
                                            {c.fullName} (Score: {c.score})
                                        </p>
                                        <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400 mb-2">
                                            {c.priority_explanation ? (
                                                <span className="line-clamp-2">{c.priority_explanation}</span>
                                            ) : (
                                                <span>Revisión urgente requerida</span>
                                            )}
                                        </div>
                                        <Link to={`/cases/${c.id}`} className="text-xs font-bold text-primary flex items-center gap-1 group-hover:underline">
                                            Intervenir Ahora <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    <span className="material-symbols-outlined text-3xl mb-2 text-status-green">check_circle</span>
                                    <p>No hay alertas críticas por el momento.</p>
                                </div>
                            )}
                        </div>
                        {highRiskCases.length > 0 && (
                            <button className="w-full mt-6 py-3 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 text-sm font-medium text-[#616f89] hover:bg-gray-50 dark:hover:bg-[#242c3d] transition-colors">
                                Ver todas las alertas ({highRiskCases.length})
                            </button>
                        )}
                    </div>

                    {/* Platform Stats/AI Health */}
                    <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-700 p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-3xl opacity-80">psychology</span>
                            <h3 className="text-lg font-bold">Estado Triage IA</h3>
                        </div>
                        <p className="text-sm text-white/80 mb-4 leading-relaxed">El motor de IA opera con una precisión del 98.4% basada en los últimos datos clínicos.</p>
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span>Última Sinc: hace 10m</span>
                            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-green animate-pulse"></span> Óptimo</span>
                        </div>
                    </div>

                    {/* AI Explanation Box */}
                    <div className="rounded-xl bg-white dark:bg-[#1a2130] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">¿Cómo funciona el Modelo IA?</h3>
                        </div>
                        <p className="text-xs text-[#616f89] dark:text-[#9ca3af] leading-relaxed mb-3">
                            Nuestro sistema analiza patrones de comportamiento de los últimos 7 días.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-red mt-1.5 shrink-0"></span>
                                <span><strong>Riesgo Alto:</strong> Falta de respuesta &gt; 24h, múltiples incidencias o soledad.</span>
                            </li>
                            <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-yellow mt-1.5 shrink-0"></span>
                                <span><strong>Riesgo Medio:</strong> Cambios en rutina o movilidad reducida.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
