// import { useState } from 'react';
import { api } from '../services/api';
import type { Case } from '../types';

interface PatientProfileSidebarProps {
    caseItem: Case;
    setCaseItem: React.Dispatch<React.SetStateAction<Case | null>>;
}

export default function PatientProfileSidebar({ caseItem, setCaseItem }: PatientProfileSidebarProps) {
    return (
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
    );
}

