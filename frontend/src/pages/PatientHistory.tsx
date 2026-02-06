import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';
import CaseForm from './CaseForm';
import Layout from '../components/Layout';
import PatientProfileSidebar from '../components/PatientProfileSidebar';
import PatientTimeline from '../components/PatientTimeline';
import PatientAIInsights from '../components/PatientAIInsights';

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
                <PatientProfileSidebar caseItem={caseItem} setCaseItem={setCaseItem} />

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
                        <PatientTimeline />

                        {/* AI Insights and Next Steps */}
                        <PatientAIInsights />
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
                            <CaseForm />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
