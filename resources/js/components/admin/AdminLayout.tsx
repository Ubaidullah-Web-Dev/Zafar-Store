import React from "react";
import { Link } from "@inertiajs/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Simple Header */}
      <header className="border-b border-white/10 bg-[#0d0d12]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
              Zafar Store Admin
            </h2>
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              View Website
            </Link>
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
