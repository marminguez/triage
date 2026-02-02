import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import type { Case } from '../types';

export default function Reports() {
    const [dateRange, setDateRange] = useState('este_mes');
    const [reportType, setReportType] = useState('todos');
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getCases()
            .then(data => setCases(data))
            .catch(err => console.error("Error loading cases for report:", err))
            .finally(() => setLoading(false));
    }, []);

    // Compute Real Stats
    const totalCases = cases.length;
    const highRiskCount = cases.filter(c => c.priority === 'ALTA').length;
    const mediumRiskCount = cases.filter(c => c.priority === 'MEDIA').length;
    const lowRiskCount = cases.filter(c => c.priority === 'BAJA').length;

    // AI Metrics
    const reprioritizedCount = cases.filter(c => c.previous_priority && c.previous_priority !== c.priority).length;
    const reprioritizedPercentage = totalCases > 0 ? Math.round((reprioritizedCount / totalCases) * 100) : 0;

    // Average Score
    const avgScore = totalCases > 0
        ? Math.round(cases.reduce((acc, curr) => acc + curr.score, 0) / totalCases)
        : 0;

    // Mock Data for Professional Table (Missing 'assignedTo' in backend)
    const professionals = [
        { name: "Dr. Ana García", role: "Trabajadora Social", cases: 42, highRisk: 12, responseTime: "2.5h", saturation: 85 },
        { name: "Carlos Ruiz", role: "Psicólogo", cases: 35, highRisk: 8, responseTime: "3.1h", saturation: 62 },
        { name: "Laura Menéndez", role: "Enfermera Gestora", cases: 28, highRisk: 15, responseTime: "1.8h", saturation: 92 },
        { name: "Equipo Guardia", role: "Rotativo", cases: 15, highRisk: 3, responseTime: "0.5h", saturation: 45 },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-[1200px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Informes de Triage</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Análisis histórico de vulnerabilidad, priorización e impacto.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="esta_semana">Esta Semana</option>
                            <option value="este_mes">Este Mes</option>
                            <option value="ultimo_trimestre">Último Trimestre</option>
                            <option value="anio">Este Año</option>
                        </select>
                        <select
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="todos">Todos los Reportes</option>
                            <option value="vulnerabilidad">Vulnerabilidad</option>
                            <option value="ia">Rendimiento IA</option>
                            <option value="impacto">Impacto Operativo</option>
                        </select>
                        <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Exportar
                        </button>
                    </div>
                </div>

                {/* AI Insight Box - Dynamic based on Risk */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary mt-1">auto_awesome</span>
                    <div>
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Análisis Inteligente</h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Actualmente hay <strong>{totalCases} casos activos</strong>. Se han identificado <strong>{highRiskCount} casos de prioridad ALTA</strong> ({totalCases > 0 ? Math.round((highRiskCount / totalCases) * 100) : 0}% del total).
                            La puntuación media de vulnerabilidad es de <strong>{avgScore}/100</strong>.
                        </p>
                    </div>
                </div>

                {/* Section: Vulnerability Evolution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white">Distribución de Vulnerabilidad</h3>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1.5 text-slate-500"><span className="size-2 rounded-full bg-red-500"></span>Alto ({highRiskCount})</span>
                                <span className="flex items-center gap-1.5 text-slate-500"><span className="size-2 rounded-full bg-yellow-400"></span>Medio ({mediumRiskCount})</span>
                                <span className="flex items-center gap-1.5 text-slate-500"><span className="size-2 rounded-full bg-green-400"></span>Bajo ({lowRiskCount})</span>
                            </div>
                        </div>
                        {/* Visualization using real portions */}
                        <div className="h-64 w-full flex items-end justify-center gap-8 px-8">
                            {/* High Risk Bar */}
                            <div className="flex flex-col items-center gap-2 w-24 group relative">
                                <div className="w-full bg-red-500 rounded-t-lg opacity-90 transition-all hover:opacity-100 relative group" style={{ height: `${totalCases ? (highRiskCount / totalCases) * 200 : 0}px`, minHeight: '4px' }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {highRiskCount} Casos
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Alta</span>
                            </div>
                            {/* Medium Risk Bar */}
                            <div className="flex flex-col items-center gap-2 w-24 group relative">
                                <div className="w-full bg-yellow-400 rounded-t-lg opacity-90 transition-all hover:opacity-100 relative group" style={{ height: `${totalCases ? (mediumRiskCount / totalCases) * 200 : 0}px`, minHeight: '4px' }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {mediumRiskCount} Casos
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Media</span>
                            </div>
                            {/* Low Risk Bar */}
                            <div className="flex flex-col items-center gap-2 w-24 group relative">
                                <div className="w-full bg-green-400 rounded-t-lg opacity-90 transition-all hover:opacity-100 relative group" style={{ height: `${totalCases ? (lowRiskCount / totalCases) * 200 : 0}px`, minHeight: '4px' }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {lowRiskCount} Casos
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Baja</span>
                            </div>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Puntuación Media</p>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter text-primary">{avgScore}</span>
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full mb-1">/ 100</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Casos Totales</p>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{totalCases}</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full mb-1">Activos</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Re-priorizados por IA</p>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{reprioritizedCount}</span>
                                <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full mb-1">{reprioritizedPercentage}% del total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: AI Engine Report */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined">psychology</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Rendimiento del Motor IA</h3>
                                <p className="text-xs text-slate-500">Métricas basadas en datos reales del sistema</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Cobertura de Puntuación</span>
                                    <span className="font-bold text-slate-900 dark:text-white">100%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Tasa de Re-priorización</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{reprioritizedPercentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.max(5, reprioritizedPercentage)}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Porcentaje de casos donde la IA ajustó la prioridad inicial basándose en factores de riesgo ocultos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Workload Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white">Carga de Trabajo Estimada</h3>
                                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Datos Demo</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Profesional</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Casos</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Riesgo Alto</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Saturación</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {professionals.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</p>
                                                <p className="text-xs text-slate-500">{p.role}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{p.cases}</td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-red-600 dark:text-red-400">{p.highRisk}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${p.saturation > 80 ? 'bg-red-500' : p.saturation > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${p.saturation}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{p.saturation}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
