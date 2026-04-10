import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { auth } = usePage().props as any;

  const handleLogout = () => {
    router.post("/admin/logout");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Simple Header */}
      <header className="border-b border-white/10 bg-[#0d0d12]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/orders" className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
              Zafar Store Admin
            </h2>
          </Link>
          <div className="flex items-center gap-4">
            {auth?.user && (
              <span className="text-xs text-gray-500 hidden sm:inline-block">
                {auth.user.email}
              </span>
            )}
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-medium transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (No Sidebar) */}
      <main className="max-w-7xl mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
