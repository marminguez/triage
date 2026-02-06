import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-white overflow-x-hidden">
            <Header />
            <main className="p-6 lg:px-10 max-w-[1440px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
