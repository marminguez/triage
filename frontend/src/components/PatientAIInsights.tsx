import { useState } from 'react';
import type { Case } from '../types';

interface PatientAIInsightsProps {
    caseItem: Case;
}

export default function PatientAIInsights({ caseItem }: PatientAIInsightsProps) {
    const [actionsApproved, setActionsApproved] = useState(false);

    const actionLogs = [
        { action: 'Derivación a fisioterapia geriátrica', date: 'Jan 24, 2024', author: 'Sarah Jenkins' },
        { action: 'Llamada a Centro de salud', date: 'Jan 22, 2024', author: 'Tarea automatizada' },
    ];

    const nextSteps = [
        { text: 'Llamar a la hija para actualizar', sub: 'Vence hoy, 5:00 PM', urgent: true },
        { text: 'Actualizar Registro de Medicación', sub: 'Revisar cambios de urgencias', urgent: false },
        { text: 'Reunión de Coordinación', sub: '28 Oct, 11:00 AM', urgent: false },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Recomendaciones IA Card */}
            <div className="bg-[#1152d4] rounded-xl p-5 shadow-lg text-white">
                {/* Header — all on one line */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-white/80 text-base">location_on</span>
                        <span className="text-xs font-bold text-white/90 uppercase tracking-wide">Recomendaciones IA</span>
                    </div>
                    <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                        INSIGHT IA
                    </span>
                </div>

                {/* Prioridad Inmediata */}
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-yellow-300 text-base">bolt</span>
                        <p className="text-sm font-bold text-white">Prioridad Inmediata</p>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed pl-6">
                        Riesgo de reingreso elevado en un 34% por visita reciente a urgencias y problemas de movilidad. Programar evaluación domiciliaria.
                    </p>
                </div>

                {/* Acción Recomendada */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-white/70 text-base">task_alt</span>
                        <p className="text-sm font-bold text-white">Acción Recomendada</p>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed pl-6">
                        Derivación a Fisioterapia Geriátrica para programa de prevención de caídas en 48 horas.
                    </p>
                </div>

                {/* Approve Button */}
                <button
                    onClick={() => setActionsApproved(true)}
                    disabled={actionsApproved}
                    className="w-full bg-white text-[#1152d4] py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-default"
                >
                    {actionsApproved ? 'Acciones Aprobadas ✓' : 'Aprobar Acciones'}
                </button>
            </div>

            {/* Registro de Acciones Aprobadas — always visible below */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {actionsApproved ? 'Registro de Acciones Aprobadas' : 'Acciones Recomendadas'}
                    </p>
                    {actionsApproved && (
                        <button
                            title="Exportar registro"
                            className="text-slate-400 hover:text-primary transition-colors"
                            onClick={() => {
                                const lines = actionLogs.map((l) => `${l.date} | ${l.action} | ${l.author}`).join('\n');
                                const blob = new Blob([`Registro de Acciones Aprobadas\n\n${lines}`], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'acciones_aprobadas.txt';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                    {actionLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300 ${actionsApproved ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                            <div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-snug">{log.action}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">{log.date} · {log.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Próximos Pasos */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Próximos Pasos</h3>
                <div className="flex flex-col gap-3">
                    {nextSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${step.urgent ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600'}`}></div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug">{step.text}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{step.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-4 w-full flex items-center justify-center gap-1 text-primary text-sm font-semibold hover:underline">
                    <span className="material-symbols-outlined text-base">add</span>
                    Añadir Tarea
                </button>
            </div>

            {/* Equipo Asignado */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                <h3 className="text-xs font-bold text-[#616f89] dark:text-slate-400 uppercase tracking-widest mb-4">Equipo Asignado</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Dr+Smith&background=random')" }}></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Dra. Sarah Smith</span>
                                <span className="text-[10px] text-[#616f89] dark:text-slate-500">Médico de Cabecera</span>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined text-lg">chat</span></button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Maria+Garcia&background=random')" }}></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Maria García</span>
                                <span className="text-[10px] text-[#616f89] dark:text-slate-500">Trabajadora Social</span>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined text-lg">chat</span></button>
                    </div>
                </div>
            </div>

            {/* Companion Button */}
            <a
                href={`/companion?caseId=${caseItem.id}`}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                target="_blank" rel="noreferrer"
            >
                <span className="material-symbols-outlined">chat_bubble</span>
                Abrir TRIAGE Companion
            </a>
        </div>
    );
}
