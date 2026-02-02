import { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsLayout from './SettingsLayout';

export default function SettingsIntegrations() {
    // Mock state for toggles
    const [aiScreening, setAiScreening] = useState(true);
    const [systemUpdates, setSystemUpdates] = useState(false);

    return (
        <SettingsLayout>
            <div className="flex flex-col gap-6">
                {/* Breadcrumbs & Heading */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Link className="hover:text-primary" to="/settings">Configuración</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-slate-900 dark:text-white">Integraciones y Privacidad</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mt-2">Integraciones y Privacidad</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Configura el comportamiento de los chatbots y gestiona conexiones externas.</p>
                </div>

                {/* WhatsApp Integration Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                                <svg className="size-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Integración WhatsApp</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="size-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Conectado</span>
                                    <span className="text-xs text-slate-400 mx-1">•</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Vinculado a +34 600 000 000</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            Desconectar
                        </button>
                    </div>
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-start justify-between mb-6">
                            <div className="max-w-md">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Cribado Automático IA</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Permitir que la IA interactúe automáticamente con cuidadores para recopilar datos preliminares.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={aiScreening}
                                    onChange={(e) => setAiScreening(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                <p className="font-semibold text-primary mb-1">Cómo funciona</p>
                                El asistente IA saluda a los cuidadores, recopila síntomas o necesidades sociales y proporciona una puntuación de prioridad basada en los protocolos de tu departamento. Todos los datos están cifrados.
                            </div>
                        </div>
                    </div>
                </div>

                {/* OmiAp Integration Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conexión OmiAp (Atención Primaria)</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="size-2 rounded-full bg-slate-400"></span>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Desconectado</span>
                                    <span className="text-xs text-slate-400 mx-1">•</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Sincronización de historias clínicas</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg shadow-sm shadow-primary/20 hover:brightness-110 transition-all">
                            Conectar Sistema
                        </button>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Preferencias de Notificación</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Alertas de Casos Vulnerables</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Notificación instantánea cuando la IA identifica un factor de alto riesgo.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded">Email</span>
                                <span className="px-2 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded">Push</span>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Actualizaciones del Sistema</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Informes mensuales y ventanas de mantenimiento.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={systemUpdates}
                                    onChange={(e) => setSystemUpdates(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Privacy & Ethical AI Card */}
                <div className="bg-gradient-to-br from-slate-900 to-[#111318] dark:from-slate-800 dark:to-slate-950 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-10">
                        <span className="material-symbols-outlined text-[200px]">verified_user</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">shield</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Privacidad y Transparencia Ética</h3>
                                <p className="text-white/60 text-xs">Nuestro compromiso con la soberanía de datos y la equidad.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-sm font-bold mb-1">Human-in-the-Loop</p>
                                <p className="text-xs text-white/70 leading-relaxed">La IA nunca toma decisiones finales. Cada puntuación de prioridad está sujeta a revisión profesional.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-sm font-bold mb-1">Mitigación de Sesgos</p>
                                <p className="text-xs text-white/70 leading-relaxed">Los algoritmos son auditados semanalmente para paridad demográfica y neutralidad socioeconómica.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <a className="text-xs font-bold underline underline-offset-4 text-white/80 hover:text-white" href="#">Descargar Marco Ético (PDF)</a>
                            <button className="bg-white text-[#111318] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Configuración de Privacidad</button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">Restaurar valores</button>
                    <button className="px-10 py-2.5 text-sm font-bold text-white bg-primary rounded-lg shadow-md shadow-primary/20 hover:brightness-110 transition-all">Guardar Cambios</button>
                </div>
            </div>
        </SettingsLayout>
    );
}
