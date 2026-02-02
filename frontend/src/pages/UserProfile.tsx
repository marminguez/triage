import Layout from '../components/Layout';

export default function UserProfile() {
    return (
        <Layout>
            <div className="max-w-[1200px] mx-auto">
                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24 ring-4 ring-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCujjANadUkXYRuLv3SNmQ5zxMMgJCSbhBH0LXLlluZ_wJG5ioWcE5owlep1Mt1vuxEXyAMw-w3DtPnrQBif8pLHwEJDPZLmrsQcjgojWXZ2xBe1cXc5C4myU3IjwQvAHNoaJI3n4IjIfkWktHw6078WG_ILXyS4js9QCJIPzuRsnWXdv52wNf74P2uZwC_z5WEjciSekpEmjXnR94zUuwTm4o0k0NJu-XaBuYtpHE79iC1wzzecuUoGx9SDunrHlim9A4nd4GkNkx")' }}></div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Alex Johnson</h1>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Trabajador Social Senior</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Departamento de Servicios Sociales • División Norte</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-mono mt-1">ID: SW-987234</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined mr-2 text-lg">edit</span>
                                <span>Editar Perfil</span>
                            </button>
                            <button className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm font-bold leading-normal transition-all hover:bg-red-100 dark:hover:bg-red-900/40">
                                <span className="material-symbols-outlined mr-2 text-lg">logout</span>
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Casos Reportados</p>
                            <span className="material-symbols-outlined text-primary">folder_open</span>
                        </div>
                        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">128</p>
                    </div>
                    <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">Alertas IA Prioridad Alta</p>
                            <span className="material-symbols-outlined text-red-600">error</span>
                        </div>
                        <p className="text-red-700 dark:text-red-300 tracking-light text-3xl font-bold leading-tight">14</p>
                    </div>
                    <div className="flex min-w-[180px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Actividad (30 Días)</p>
                            <span className="material-symbols-outlined text-primary">analytics</span>
                        </div>
                        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">42</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Cases Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Casos Reportados por Ti</h2>
                                <button className="text-primary text-sm font-semibold hover:underline">Ver Todos</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID Caso</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vulnerabilidad IA</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-primary">#C-8821</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">24 Oct, 2023</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Pendiente
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-[60px] h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div className="h-1.5 rounded-full bg-red-500" style={{ width: '85%' }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-red-500">85</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-slate-500 dark:text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-primary">#C-8790</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">22 Oct, 2023</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    En Progreso
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-[60px] h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div className="h-1.5 rounded-full bg-orange-400" style={{ width: '42%' }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-orange-400">42</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-slate-500 dark:text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-primary">#C-8755</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">19 Oct, 2023</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Resuelto
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-[60px] h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: '12%' }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-green-500">12</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-slate-500 dark:text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-6">Preferencias Personales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Notificaciones Email</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Recibir resumen semanal</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200">
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Alertas Vulnerabilidad Alta</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">SMS inmediato si IA &#62; 80</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200">
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Insights IA</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Mostrar confianza de IA en casos</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-700 transition-colors duration-200">
                                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Modo Oscuro</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Ajustar interfaz</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-700 transition-colors duration-200">
                                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold transition-all hover:bg-blue-700 shadow-md">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column: Recent Activity */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-24">
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-6">Actividad Reciente</h2>
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    <li className="relative pb-8">
                                        <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"></span>
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                                                    <span className="material-symbols-outlined text-white text-sm">description</span>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-300">Caso reportado <a className="font-bold text-slate-900 dark:text-white" href="#">#C-8821</a></p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">Hace 2h</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="relative pb-8">
                                        <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"></span>
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                                                    <span className="material-symbols-outlined text-white text-sm">check_circle</span>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-300">Caso resuelto <a className="font-bold text-slate-900 dark:text-white" href="#">#C-8755</a></p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">Hace 5h</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="relative pb-8">
                                        <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"></span>
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                                                    <span className="material-symbols-outlined text-white text-sm">psychology</span>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-300">Solicitado Re-análisis IA para <a className="font-bold text-slate-900 dark:text-white" href="#">#C-8790</a></p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">Ayer</div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="relative pb-8">
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                                                    <span className="material-symbols-outlined text-white text-sm">login</span>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-300">Inicio de sesión desde <span className="text-slate-900 dark:text-white">Oficina Central</span></p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">Hace 2d</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <button className="mt-8 w-full py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Cargar más actividad
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
