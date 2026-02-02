import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';
import CaseForm from './CaseForm.1'; // Reusing the form component
import Layout from '../components/Layout';

export default function PatientHistory() {
    const { id } = useParams<{ id: string }>();
    const [caseItem, setCaseItem] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await api.getCase(id);
                setCaseItem(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Cargando historial...</div>;
    if (!caseItem) return <div className="p-10 text-center">Paciente no encontrado.</div>;

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar: Patient Profile */}
                <aside className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 mb-4 ring-4 ring-primary/10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551185887-a5a14387d843?w=400&h=400&fit=crop")' }}></div>
                            <h1 className="text-[#111318] dark:text-white text-xl font-bold leading-normal">{caseItem.fullName}</h1>
                            <p className="text-[#616f89] dark:text-slate-400 text-sm">ID: {caseItem.id.substring(0, 8)} • {caseItem.age} años</p>

                            <div className="flex flex-col items-center gap-2 mt-3">
                                {/* Dynamic Priority Badge */}
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${caseItem.priority === 'ALTA' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        caseItem.priority === 'MEDIA' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {caseItem.priority === 'ALTA' ? 'warning' : caseItem.priority === 'MEDIA' ? 'remove' : 'check_circle'}
                                    </span>
                                    Prioridad {caseItem.priority || 'BAJA'}
                                </div>

                                {/* Dynamic Status Badge */}
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize
                                     ${caseItem.status === 'new' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                                        caseItem.status === 'under_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                            caseItem.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}
                                    `}>
                                    {caseItem.status === 'new' ? 'Nuevo' :
                                        caseItem.status === 'under_review' ? 'En Revisión' :
                                            caseItem.status === 'in_progress' ? 'En Progreso' :
                                                'Resuelto'}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#616f89] dark:text-slate-400">location_on</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#616f89] dark:text-slate-400 font-medium">Residencia</span>
                                    <span className="text-sm font-medium">Madrid, España</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#616f89] dark:text-slate-400">call</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#616f89] dark:text-slate-400 font-medium">Contacto</span>
                                    <span className="text-sm font-medium">+34 91 123 45 67</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#616f89] dark:text-slate-400">emergency</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#616f89] dark:text-slate-400 font-medium">Contacto Emergencia</span>
                                    <span className="text-sm font-medium">Ana García (Hija)</span>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Toggle */}
                        <div className="mt-6 bg-[#25D366]/10 rounded-lg p-4 border border-[#25D366]/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#25D366] font-bold text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">chat</span>
                                        Chatbot WhatsApp
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!!caseItem?.whatsapp_chatbot_enabled}
                                        onChange={async (e) => {
                                            if (!caseItem) return;
                                            const newValue = e.target.checked;
                                            // Optimistic update
                                            setCaseItem(prev => prev ? ({ ...prev, whatsapp_chatbot_enabled: newValue }) : null);
                                            try {
                                                await api.updateCase(caseItem.id, { whatsapp_chatbot_enabled: newValue });
                                            } catch (err) {
                                                console.error(err);
                                                // Revert on error
                                                setCaseItem(prev => prev ? ({ ...prev, whatsapp_chatbot_enabled: !newValue }) : null);
                                                alert("Error al actualizar el estado del chat.");
                                            }
                                        }}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#25D366]/50 dark:peer-focus:ring-[#25D366]/80 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#25D366]"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                                {caseItem?.whatsapp_chatbot_enabled
                                    ? "Activo: El asistente virtual enviará recordatorios y responderá dudas básicas."
                                    : "Inactivo: Actívalo para permitir que el paciente reciba ayuda por WhatsApp."
                                }
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md">
                                <span className="material-symbols-outlined">person</span>
                                <p className="text-sm font-semibold">Perfil Médico</p>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111318] dark:text-slate-300 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 cursor-pointer transition-all">
                                <span className="material-symbols-outlined">history</span>
                                <p className="text-sm font-medium">Historial de Atención</p>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111318] dark:text-slate-300 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 cursor-pointer transition-all">
                                <span className="material-symbols-outlined">medication</span>
                                <p className="text-sm font-medium">Medicamentos</p>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111318] dark:text-slate-300 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 cursor-pointer transition-all">
                                <span className="material-symbols-outlined">psychology</span>
                                <p className="text-sm font-medium">Análisis IA</p>
                                <span className="ml-auto bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Nuevo</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111318] dark:text-slate-300 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 cursor-pointer transition-all">
                                <span className="material-symbols-outlined">description</span>
                                <p className="text-sm font-medium">Documentos</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                            <button className="w-full bg-[#1152d4] text-white py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-[#0e43ad] transition-all">
                                Actualizar Estado
                            </button>
                            <div className="flex items-center gap-2 text-xs text-[#616f89] dark:text-slate-400 px-2 cursor-pointer hover:text-primary">
                                <span className="material-symbols-outlined text-sm">visibility_off</span>
                                <span>Modo Privado</span>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Breadcrumbs and Header */}
                    <div className="flex flex-col gap-1">
                        <nav className="flex items-center gap-2 text-[#616f89] dark:text-slate-400 text-sm font-medium mb-2">
                            <Link className="hover:text-primary" to="/cases">Pacientes</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-[#111318] dark:text-white">Perfil de {caseItem.fullName}</span>
                        </nav>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <h2 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Perfil de Paciente e Historial</h2>
                                <p className="text-[#616f89] dark:text-slate-400 text-sm">Caso de Prioridad {caseItem.priority || 'BAJA'} • Última actualización hace 2 horas por Dra. Sarah Smith</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-[#f0f2f4] dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Exportar Informe
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-all">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Nuevo Incidente
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Segmented Filter */}
                    <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-[#f0f2f4] dark:border-slate-800 max-w-fit">
                        <label className="flex cursor-pointer h-9 items-center justify-center rounded-md px-6 bg-white dark:bg-slate-800 shadow-sm text-[#111318] dark:text-white text-sm font-bold">
                            <span>Clínico</span>
                        </label>
                        <label className="flex cursor-pointer h-9 items-center justify-center rounded-md px-6 text-[#616f89] dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            <span>Atención Social</span>
                        </label>
                        <label className="flex cursor-pointer h-9 items-center justify-center rounded-md px-6 text-[#616f89] dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            <span>Ayuda Gubernamental</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Timeline Section */}
                        <div className="xl:col-span-2 flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold">Línea de Tiempo de Atención</h3>
                                    <button className="text-primary text-sm font-bold hover:underline">Ver Todo</button>
                                </div>
                                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-slate-200 dark:before:via-slate-800 before:to-slate-100 dark:before:to-slate-900">
                                    {/* Incident 1: Urgent */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <span className="material-symbols-outlined text-sm">emergency</span>
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10 shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-red-700 dark:text-red-400">Urgencias: Palpitaciones</div>
                                                <time className="text-xs font-medium text-red-600 dark:text-red-400/80">24 Oct, 08:30 AM</time>
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Paciente ingresada tras síncope en domicilio. Alta con ajuste de betabloqueantes. Requiere seguimiento.</div>
                                        </div>
                                    </div>
                                    {/* Incident 2: Social */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <span className="material-symbols-outlined text-sm">groups</span>
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-[#111318] dark:text-white">Visita Trabajadora Social</div>
                                                <time className="text-xs font-medium text-slate-400">22 Oct, 02:15 PM</time>
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Revisión rutinaria del entorno. Se observan dificultades de movilidad en el baño. Solicitada instalación de barras de apoyo.</div>
                                        </div>
                                    </div>
                                    {/* Incident 3: Government */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <span className="material-symbols-outlined text-sm">account_balance</span>
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-[#111318] dark:text-white">Aprobación de Beneficios</div>
                                                <time className="text-xs font-medium text-slate-400">18 Oct, 09:00 AM</time>
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Ayuda a la vivienda aprobada para el próximo año fiscal. Confirmación enviada a la paciente.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Medication Block */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-primary">pill</span>
                                    <h3 className="text-lg font-bold">Medicamentos Actuales</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-[#f6f6f8] dark:bg-slate-800 border-l-4 border-primary">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm">Succinato de Metoprolol</span>
                                            <span className="text-[10px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded text-[#616f89] dark:text-slate-300">50mg</span>
                                        </div>
                                        <p className="text-xs text-[#616f89] dark:text-slate-400 mb-2">1 tableta una vez al día (mañana)</p>
                                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Adherente
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[#f6f6f8] dark:bg-slate-800 border-l-4 border-amber-400">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm">Atorvastatina</span>
                                            <span className="text-[10px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded text-[#616f89] dark:text-slate-300">20mg</span>
                                        </div>
                                        <p className="text-xs text-[#616f89] dark:text-slate-400 mb-2">1 tableta al acostarse</p>
                                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                            <span className="material-symbols-outlined text-sm">pending</span>
                                            Revisión Pendiente
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* AI Insights and Next Steps */}
                        <div className="flex flex-col gap-6">
                            {/* AI Insights Block */}
                            <div className="bg-gradient-to-br from-[#1152d4] to-[#0c3da1] rounded-xl p-6 shadow-lg text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined">psychology</span>
                                        <h3 className="font-bold">Recomendaciones IA</h3>
                                    </div>
                                    <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Insight IA</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                            Prioridad Inmediata
                                        </p>
                                        <p className="text-xs text-white/80 leading-relaxed">Riesgo de reingreso elevado en un 34% por visita reciente a urgencias y problemas de movilidad. Programar evaluación domiciliaria.</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">task_alt</span>
                                            Acción Recomendada
                                        </p>
                                        <p className="text-xs text-white/80 leading-relaxed">Derivación a Fisioterapia Geriátrica para programa de prevención de caídas en 48 horas.</p>
                                    </div>
                                </div>
                                <button className="w-full mt-4 bg-white text-primary py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
                                    Aprobar Acciones
                                </button>
                            </div>
                            {/* Next Steps & Checklist */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                                <h3 className="text-lg font-bold mb-4">Próximos Pasos</h3>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all">
                                        <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#111318] dark:text-white">Llamar a la hija para actualizar</span>
                                            <span className="text-xs text-[#616f89] dark:text-slate-400">Vence hoy, 5:00 PM</span>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all">
                                        <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#111318] dark:text-white">Actualizar Registro de Medicación</span>
                                            <span className="text-xs text-[#616f89] dark:text-slate-400">Revisar cambios de urgencias</span>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all">
                                        <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#111318] dark:text-white">Reunión de Coordinación</span>
                                            <span className="text-xs text-[#616f89] dark:text-slate-400">26 Oct, 11:00 AM</span>
                                        </div>
                                    </label>
                                </div>
                                <button className="w-full mt-4 flex items-center justify-center gap-1 text-[#616f89] dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Añadir Tarea
                                </button>
                            </div>
                            {/* Professional Team */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                                <h3 className="text-sm font-bold text-[#616f89] dark:text-slate-400 uppercase tracking-widest mb-4">Equipo Asignado</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaCPUfgK9t42yObL5cDIKWJW8OgIrzhNJ57yrTNdwSvjrrvwirOYU8bo5diaEUxp-mjQnT7shMCVCzTSLoYJgls2XpvM8lGjX7XQdAoAlzlPHGU48IaDrgFTF2UQn0hCz72PdIWjzF4Q7G-DvHssGMb6eGkO8-iZtnT_lV3JENW6ql56xfuWJjhT25d2NNM2NOUWETnMdEHZwYrlLkBTBd-qudW8i_rwJWBGRT5V9rcZL-IhltJiSzUalr6pt1Z4SC2QoPIqntxy8W')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">Dra. Sarah Smith</span>
                                                <span className="text-[10px] text-[#616f89]">Médico de Cabecera</span>
                                            </div>
                                        </div>
                                        <button className="text-primary"><span className="material-symbols-outlined text-lg">chat</span></button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbg8YAMcEfYpQqeM-rx2I-pOgM80rwowgjiiJYGYev-s4-4A6py6k7SX0IJVUwwRP9sfbZULPl9PhJpfSbzIkCoNlp8QW1cq4C9bmy3i1ayXT8rk8AhbFZLD5V_Ga2kZYWu-uw1ciNHSen2tTz9cW9zLPSg7yQt8QwFOdp6Vjrsj7ByP6PVOCoZLLbIY_lW-8DC3gjOSNoJw9UIA-_DaD3DL_BvO9zoZnOdZWlPFLbfhwBh4fstTfjWrFLubOeaHLQ_dv_9IXGLqt-')" }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">Maria Garcia</span>
                                                <span className="text-[10px] text-[#616f89]">Trabajadora Social</span>
                                            </div>
                                        </div>
                                        <button className="text-primary"><span className="material-symbols-outlined text-lg">chat</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for New Incident */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            {/* We reuse the CaseForm component but we might need to adjust it to handle closure/redirect. 
                                Since CaseForm internally redirects to /cases, this matches the requirement: 
                                "si se abre otro caso... se registrará como nuevo... estará en una nueva línea"
                            */}
                            <CaseForm />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
