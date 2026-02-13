import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Case, DailyCheckIn } from '../types';
import { AlertTriangle } from 'lucide-react';

export default function CaseDetail() {
    const { id } = useParams();
    const [caseItem, setCaseItem] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCheckInHistory, setShowCheckInHistory] = useState(false);
    const [checkInHistory, setCheckInHistory] = useState<DailyCheckIn[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (id) loadCase(id);
    }, [id]);

    const loadCase = async (caseId: string) => {
        try {
            const data = await api.getCase(caseId);
            setCaseItem(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCheckInHistory = async () => {
        if (!id) return;

        setLoadingHistory(true);
        try {
            const response = await api.getCheckIns(id);
            setCheckInHistory(response.checkIns || []);
            setShowCheckInHistory(true);
        } catch (err) {
            console.error('Error loading check-in history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const getCheckInBoost = (severity?: string): number => {
        switch (severity) {
            case 'critical': return 35;
            case 'high': return 20;
            case 'medium': return 10;
            default: return 0;
        }
    };

    if (loading) return <div className="p-8 text-center bg-white dark:bg-slate-900 dark:text-white">Cargando detalles...</div>;
    if (!caseItem) return <div className="p-8 text-center text-red-500">Caso no encontrado</div>;

    const checkInBoost = getCheckInBoost(caseItem.lastSeverity);
    const isCritical = caseItem.lastSeverity === 'critical';

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link to="/cases" className="flex items-center text-slate-500 hover:text-primary mb-6 transition font-medium">
                &larr; Volver al Listado
            </Link>

            {/* Critical Alert Banner */}
            {isCritical && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 flex items-center gap-3 shadow-lg animate-pulse">
                    <AlertTriangle size={24} />
                    <div>
                        <h3 className="font-bold text-lg">URGENTE: Revisar / Contactar hoy</h3>
                        <p className="text-sm">El paciente ha reportado una situación crítica en su último check-in.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{caseItem.fullName}</h1>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
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
                                                {code === 'CHECKIN_CRITICAL' && 'Check-in crítico (+35)'}
                                                {code === 'CHECKIN_HIGH' && 'Check-in alta severidad (+20)'}
                                                {code === 'CHECKIN_MEDIUM' && 'Check-in media severidad (+10)'}
                                                {!['NO_RESPONSE_48H', 'NO_RESPONSE_24H', 'NO_RESPONSE_12H', 'NO_CONTACT_7D', 'INCIDENTS_MANY', 'INCIDENT_SEVERE', 'ROUTINE_BREAK_MANY', 'LIVES_ALONE', 'MOBILITY_LIMIT', 'COGNITIVE_DIFF', 'CHECKIN_CRITICAL', 'CHECKIN_HIGH', 'CHECKIN_MEDIUM'].includes(code) && code}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No hay factores de riesgo activos.</p>
                            )}
                        </div>
                    </div>

                    {/* Check-In Signals Section */}
                    {caseItem.lastCheckInAt && (
                        <div className="md:col-span-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Señales recientes (Companion)</h3>
                            <div className={`p-4 rounded-lg border ${caseItem.lastSeverity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                                    caseItem.lastSeverity === 'high' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                                        caseItem.lastSeverity === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                                            'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase ${caseItem.lastSeverity === 'critical' ? 'bg-red-500 text-white' :
                                                    caseItem.lastSeverity === 'high' ? 'bg-orange-500 text-white' :
                                                        caseItem.lastSeverity === 'medium' ? 'bg-yellow-500 text-white' :
                                                            'bg-green-500 text-white'
                                                }`}>
                                                {caseItem.lastSeverity}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(caseItem.lastCheckInAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                {' '}
                                                {new Date(caseItem.lastCheckInAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                            <strong>Resumen:</strong> "{caseItem.lastCheckInSummary}"
                                        </p>
                                        {checkInBoost > 0 && (
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                <span className="material-symbols-outlined text-base align-middle mr-1">trending_up</span>
                                                Ajuste por check-in: +{checkInBoost} puntos
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={loadCheckInHistory}
                                    disabled={loadingHistory}
                                    className="text-sm text-primary hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    {loadingHistory ? 'Cargando...' : 'Ver historial de check-ins'}
                                </button>
                            </div>
                        </div>
                    )}

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

            {/* Check-In History Modal */}
            {showCheckInHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCheckInHistory(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Historial de Check-ins</h2>
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] p-6">
                            {checkInHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {checkInHistory.map((checkIn) => (
                                        <div key={checkIn.id} className={`p-4 rounded-lg border ${checkIn.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                                                checkIn.severity === 'high' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                                                    checkIn.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                                                        'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${checkIn.severity === 'critical' ? 'bg-red-500 text-white' :
                                                        checkIn.severity === 'high' ? 'bg-orange-500 text-white' :
                                                            checkIn.severity === 'medium' ? 'bg-yellow-500 text-white' :
                                                                'bg-green-500 text-white'
                                                    }`}>
                                                    {checkIn.severity}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(checkIn.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    {' '}
                                                    {new Date(checkIn.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">"{checkIn.freeText}"</p>
                                            {checkIn.redFlags && checkIn.redFlags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {checkIn.redFlags.map((flag, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                            {flag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-500 py-8">No hay check-ins registrados.</p>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={() => setShowCheckInHistory(false)}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
