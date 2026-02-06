
export default function PatientTimeline() {
    return (
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
    );
}
