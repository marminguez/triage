import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
            ? "text-[#111318] dark:text-white border-b-2 border-primary pb-1"
            : "text-[#616f89] dark:text-slate-400 hover:text-primary transition-colors";
    };

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-12"> {/* Gap 48px approx (12 * 4 = 48) */}
                <Link to="/dashboard" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Triage Logo" className="h-8" />
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
                    <Link className={isActive('/dashboard')} to="/dashboard">Panel</Link>
                    <Link className={isActive('/cases')} to="/cases">Casos</Link>
                    <Link className={isActive('/reports')} to="/reports">Informes</Link>
                </nav>
            </div>

            <div className="flex flex-1 justify-end gap-4 items-center">
                <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                        <div className="text-[#616f89] flex border-none bg-[#f0f2f4] dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input className="form-input flex w-full min-w-0 flex-1 border-none bg-[#f0f2f4] dark:bg-slate-800 text-[#111318] dark:text-white focus:ring-0 h-full placeholder:text-[#616f89] px-4 rounded-r-lg pl-2 text-sm font-normal" placeholder="Buscar..." />
                    </div>
                </label>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f2f4] dark:bg-slate-800 text-[#111318] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <Link to="/settings" className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f2f4] dark:bg-slate-800 text-[#111318] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </Link>
                </div>
                <Link to="/profile" className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-700 block" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGFSmMe4PzuClCAod0EG2WgoKzMAof7nvBgngo3MAzWdeFw2l1BoqgcP81W4KUdQ9Gq8YKoYgElz1Wf89v5yQSdLeVpYS6v8Uw9koT7xrOtiQ6J8WyJ_QTdBH8TLFpRx0-_lGbJ_MAuu6CGkyy3cIrcTXeiJyQoyZ40pg9JyskrBe5KGojHuQpsSZPMuIQzXxMyMey8G-0d_SCFwagvGOamoG-9AVeQZZ2UEV6fj9LxAEQ9SnVC5uz3C5DSEqju2_css48eSJlTIev")' }}></Link>
            </div>
        </header>
    );
}
