import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { url } = usePage();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "📦" },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#0d0d12] hidden sm:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Zafar Store
          </h2>
          <p className="text-xs text-gray-500 font-medium tracking-widest mt-1">
            MANAGEMENT
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = url === item.href || (url.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
