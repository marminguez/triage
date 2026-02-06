import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { api } from '../services/api';


export default function CaseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        fullName: '',
        age: '',
        status: 'new',
        // New scoring fields
        unanswered_messages_hours: 0,
        incidents_last_7d: 0,
        incidents_severity_max_7d: '',
        routine_breaks_last_7d: 0,
        lives_alone: false,
        mobility_limitations: false,
        cognitive_difficulty_flag: false,
        risk_notes: '',
        notes: ''
    });

    useEffect(() => {
        if (isEditing && id) {
            setLoading(true);
            api.getCase(id)
                .then(data => {
                    setFormData({
                        ...data,
                        // Ensure nulls are handled for controlled inputs
                        incidents_severity_max_7d: data.incidents_severity_max_7d || '',
                        risk_notes: data.risk_notes || '',
                        notes: data.notes || ''
                    });
                })
                .catch(err => {
                    console.error("Error loading case:", err);
                    alert("Error al cargar el caso para editar.");
                    navigate('/cases');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure numeric fields are numbers (input type="number" returns strings)
            const payload = {
                ...formData,
                age: parseInt(formData.age) || 0,
                unanswered_messages_hours: parseInt(formData.unanswered_messages_hours) || 0,
                incidents_last_7d: parseInt(formData.incidents_last_7d) || 0,
                routine_breaks_last_7d: parseInt(formData.routine_breaks_last_7d) || 0,
                // Checkbox/Booleans are already boolean primarily, but ensure safety if mismatched
                lives_alone: !!formData.lives_alone,
                mobility_limitations: !!formData.mobility_limitations,
                cognitive_difficulty_flag: !!formData.cognitive_difficulty_flag,
                // Ensure strings
                incidents_severity_max_7d: formData.incidents_severity_max_7d || null,
            };

            if (isEditing && id) {
                await api.updateCase(id, payload);
            } else {
                await api.createCase(payload);
            }

            navigate(isEditing ? `/cases/${id}` : '/cases');
        } catch (err: any) {
            console.error(err);
            alert(`Error al guardar el caso: ${err.message || 'Desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    if (loading && isEditing) {
        return <div className="p-8 text-center bg-white dark:bg-slate-900 dark:text-white">Cargando datos...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 text-slate-900 dark:text-white">
            <Link to={isEditing ? `/cases/${id}` : "/cases"} className="inline-flex items-center text-slate-500 hover:text-primary mb-6 transition font-medium">
                <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
                {isEditing ? 'Volver al Detalle' : 'Volver al Listado'}
            </Link>
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Valoración' : 'Nuevo Caso'}</h1>

            {/* Instructional Text */}
            <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                    <div>
                        <p className="font-bold mb-1">Instrucciones de Valoración</p>
                        <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li>Complete los datos demográficos del paciente.</li>
                            <li>Califique los indicadores de vulnerabilidad en una escala de <strong>0 a 10</strong>.</li>
                            <li><strong>0</strong> = Sin riesgo, <strong>10</strong> = Riesgo Crítico.</li>
                            <li>Valores superiores a <strong>5</strong> serán marcados automáticamente como de riesgo para revisión prioritaria.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-8">
                {/* Section 1: Demographics */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span> Datos del Paciente
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                            <input
                                required
                                name="fullName"
                                placeholder="Ej. Juan Pérez"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Edad</label>
                            <input
                                required
                                type="number"
                                name="age"
                                placeholder="Ej. 75"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white"
                            >
                                <option value="new">Nuevo (Gris)</option>
                                <option value="under_review">En Revisión (Azul)</option>
                                <option value="in_progress">En Progreso (Amarillo)</option>
                                <option value="resolved">Resuelto (Verde)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-status-red">warning</span> Señales de Riesgo (Scoring)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Communication */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Comunicación / Contacto</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Horas sin respuesta</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="unanswered_messages_hours"
                                    value={formData.unanswered_messages_hours || 0}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                                <p className="text-xs text-slate-500 mt-1">Mayor a 12h, 24h, 48h aumenta riesgo.</p>
                            </div>
                        </div>

                        {/* Incidents */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Incidencias (7 días)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cantidad</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="incidents_last_7d"
                                        value={formData.incidents_last_7d || 0}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severidad Máx.</label>
                                    <select
                                        name="incidents_severity_max_7d"
                                        value={formData.incidents_severity_max_7d || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="">Ninguna</option>
                                        <option value="leve">Leve</option>
                                        <option value="moderada">Moderada</option>
                                        <option value="grave">Grave</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Routine */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Rutina</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rupturas de rutina (7 días)</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="routine_breaks_last_7d"
                                    value={formData.routine_breaks_last_7d || 0}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                            </div>
                        </div>

                        {/* Vulnerability Factors */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Factores de Vulnerabilidad</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="lives_alone"
                                        checked={!!formData.lives_alone}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, lives_alone: e.target.checked }))}
                                        className="w-4 h-4 text-primary rounded border-gray-300" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Vive solo/a</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="mobility_limitations"
                                        checked={!!formData.mobility_limitations}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, mobility_limitations: e.target.checked }))}
                                        className="w-4 h-4 text-primary rounded border-gray-300" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Limitaciones de movilidad</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="cognitive_difficulty_flag"
                                        checked={!!formData.cognitive_difficulty_flag}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, cognitive_difficulty_flag: e.target.checked }))}
                                        className="w-4 h-4 text-primary rounded border-gray-300" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Dificultad cognitiva</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notas de Riesgo (Contexto)</label>
                    <textarea
                        name="risk_notes"
                        rows={3}
                        placeholder="Ej. No abre la puerta en las mañanas..."
                        value={formData.risk_notes || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Otras Notas</label>
                    <textarea
                        name="notes"
                        rows={2}
                        placeholder="Información general..."
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-slate-700 dark:text-white" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(isEditing ? `/cases/${id}` : '/cases')}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-bold shadow-md shadow-blue-200 dark:shadow-none"
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar Caso' : 'Crear Caso')}
                    </button>
                </div>
            </form>
        </div>
    );
}
