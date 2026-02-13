import type { Case } from '../types';

interface PatientAIInsightsProps {
    caseItem: Case;
}

export default function PatientAIInsights({ caseItem }: PatientAIInsightsProps) {
    const score = caseItem.score || 0;
    const priority = caseItem.priority || 'BAJA';
    const explanation = caseItem.priority_explanation || 'Sin análisis detallado.';

    // Default factors if missing (fallback to 0)
    const factors = caseItem.risk_factors || {
        aislamiento: 0,
        incidencias: 0,
        funcional: 0,
        adherencia: 0
    };

    const getScoreColor = (s: number) => {
        if (s >= 70) return 'text-red-600 dark:text-red-400';
        if (s >= 40) return 'text-amber-600 dark:text-amber-400';
        return 'text-emerald-600 dark:text-emerald-400';
    };

    const getScoreBg = (s: number) => {
        if (s >= 70) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (s >= 40) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    };

    // Helper for factor bullets (0-3)
    const FactorMeter = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{label}</span>
                <span>{value}/3</span>
            </div>
            <div className="flex gap-1">
                {[1, 2, 3].map((v) => (
                    <div key={v} className={`h-2 flex-1 rounded-full ${v <= value ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Vulnerability Score Block */}
            <div className={`rounded-xl p-6 shadow-sm border ${getScoreBg(score)}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-3xl ${getScoreColor(score)}`}>shield_with_heart</span>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vulnerability Score</h3>
                            <span className={`text-sm font-bold ${getScoreColor(score)} uppercase`}>Riesgo {priority}</span>
                        </div>
                    </div>
                    <div className={`text-3xl font-black ${getScoreColor(score)}`}>
                        {score}<span className="text-sm font-bold opacity-60">/100</span>
                    </div>
                </div>

                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-6 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Análisis Automático
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{explanation}"
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <FactorMeter value={factors.aislamiento} label="Aislamiento" />
                    <FactorMeter value={factors.incidencias} label="Incidencias" />
                    <FactorMeter value={factors.funcional} label="Dificultad Funcional" />
                    <FactorMeter value={factors.adherencia} label="Adherencia" />
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

            {/* Professional Team (Kept from original) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#f0f2f4] dark:border-slate-800">
                <h3 className="text-sm font-bold text-[#616f89] dark:text-slate-400 uppercase tracking-widest mb-4">Equipo Asignado</h3>
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
                </div>
            </div>
        </div>
    );
}
