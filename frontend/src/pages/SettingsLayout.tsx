import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

interface SettingsLayoutProps {
    children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.includes(path)
            ? "bg-primary/10 text-primary"
            : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800";
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                    <div className="px-3 mb-2">
                        <h1 className="text-slate-900 dark:text-white text-base font-bold">Configuración</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Gestión de la plataforma</p>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <Link to="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/profile') || isActive('/account')}`}>
                            <span className="material-symbols-outlined">person</span>
                            <span className="text-sm font-medium">Cuenta</span>
                        </Link>
                        <Link to="/settings/team" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/team')}`}>
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-medium">Equipo</span>
                        </Link>
                        <Link to="/settings/integrations" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/integrations')}`}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>extension</span>
                            <span className="text-sm font-semibold">Integraciones</span>
                        </Link>
                        <Link to="/settings/privacy" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/privacy')}`}>
                            <span className="material-symbols-outlined">security</span>
                            <span className="text-sm font-medium">Privacidad y Ética</span>
                        </Link>
                        <Link to="/settings/notifications" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/notifications')}`}>
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="text-sm font-medium">Notificaciones</span>
                        </Link>
                    </nav>
                    <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-2">Soporte</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">¿Necesitas ayuda con la integración API o cumplimiento normativo?</p>
                        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Contactar Especialista</button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </Layout>
    );
}
