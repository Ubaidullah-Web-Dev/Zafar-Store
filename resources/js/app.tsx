import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import Navbar from '@/components/Navbar';

// An optional base layout wrapper (equivalent to root layout in Next.js)
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Zafar Store + Bakers. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

createInertiaApp({
    title: (title) => `${title} - Zafar Store + Bakers`,
    resolve: (name) => {
        const page = resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        );
        page.then((module: any) => {
            module.default.layout = module.default.layout || ((page: any) => <Layout children={page} />);
        });
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#f59e0b',
    },
});
