export default function PatientAIInsights() {
    return (
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
    );
}
