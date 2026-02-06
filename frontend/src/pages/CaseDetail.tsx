import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';
// import { ArrowLeft, Clock } from 'lucide-react';

export default function CaseDetail() {
    const { id } = useParams();
    const [caseItem, setCaseItem] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadCase(id);
    }, [id]);

    const loadCase = async (caseId: string) => {
        try {
            const data = await api.getCase(caseId);
            setCaseItem(data);
            setCaseItem(data);
            // setEditForm(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <div className="p-8 text-center bg-white dark:bg-slate-900 dark:text-white">Cargando detalles...</div>;
    if (!caseItem) return <div className="p-8 text-center text-red-500">Caso no encontrado</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link to="/cases" className="flex items-center text-slate-500 hover:text-primary mb-6 transition font-medium">
                {/* <ArrowLeft size={18} className="mr-1" /> */}
                &larr; Volver al Listado
            </Link>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{caseItem.fullName}</h1>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                            {/* <Clock size={14} className="mr-1" /> */}
                            Creado el {new Date(caseItem.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize
                        ${caseItem.status === 'new' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : ''}
                        ${caseItem.status === 'under_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                        ${caseItem.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                        ${caseItem.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                    `}>
                        {caseItem.status === 'new' ? 'Nuevo' :
                            caseItem.status === 'under_review' ? 'En Revisión' :
                                caseItem.status === 'in_progress' ? 'En Progreso' :
                                    'Resuelto'}
                    </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Demografía</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-500 dark:text-slate-400">Edad</label>
                                <p className="font-medium text-lg text-slate-900 dark:text-white">{caseItem.age} años</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Evaluación de Vulnerabilidad</h3>

                        {/* Priority Badge */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className={`flex flex-col items-center justify-center h-20 w-20 rounded-full border-4 ${caseItem.priority === 'ALTA' ? 'border-red-500 text-red-600 bg-red-50' :
                                caseItem.priority === 'MEDIA' ? 'border-amber-500 text-amber-600 bg-amber-50' :
                                    'border-emerald-500 text-emerald-600 bg-emerald-50'
                                }`}>
                                <span className="text-2xl font-black">{caseItem.score || 0}</span>
                                <span className="text-[10px] font-bold uppercase">Puntos</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                                    Prioridad {caseItem.priority || 'BAJA'}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-snug">
                                    {caseItem.priority_explanation || 'Sin factores de riesgo detectados.'}
                                </p>
                            </div>
                        </div>

                        {/* Reasons List */}
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Factores Detectados</h4>
                            {caseItem.priority_reason_codes && caseItem.priority_reason_codes.length > 0 ? (
                                <ul className="space-y-2">
                                    {caseItem.priority_reason_codes.map((code) => (
                                        <li key={code} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-base text-primary mt-0.5">check_circle</span>
                                            <span>
                                                {code === 'NO_RESPONSE_48H' && 'Sin respuesta (>48h) (+20)'}
                                                {code === 'NO_RESPONSE_24H' && 'Sin respuesta (>24h) (+12)'}
                                                {code === 'NO_RESPONSE_12H' && 'Sin respuesta (>12h) (+6)'}
                                                {code === 'NO_CONTACT_7D' && 'Sin contacto (>7d) (+10)'}
                                                {code === 'INCIDENTS_MANY' && 'Incidencias múltiples (+18)'}
                                                {code === 'INCIDENT_SEVERE' && 'Incidencia grave (+22)'}
                                                {code === 'ROUTINE_BREAK_MANY' && 'Rupturas rutina múltiples (+15)'}
                                                {code === 'LIVES_ALONE' && 'Vive solo (+8)'}
                                                {code === 'MOBILITY_LIMIT' && 'Problemas movilidad (+6)'}
                                                {code === 'COGNITIVE_DIFF' && 'Dificultad cognitiva (+6)'}
                                                {!['NO_RESPONSE_48H', 'NO_RESPONSE_24H', 'NO_RESPONSE_12H', 'NO_CONTACT_7D', 'INCIDENTS_MANY', 'INCIDENT_SEVERE', 'ROUTINE_BREAK_MANY', 'LIVES_ALONE', 'MOBILITY_LIMIT', 'COGNITIVE_DIFF'].includes(code) && code}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No hay factores de riesgo activos.</p>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notas del Caso</h3>
                        <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {caseItem.notes || 'Sin notas disponibles.'}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <Link
                        to={`/cases/${caseItem.id}/edit`}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm"
                    >
                        Editar Caso
                    </Link>
                </div>
            </div>
        </div>
    );
}
