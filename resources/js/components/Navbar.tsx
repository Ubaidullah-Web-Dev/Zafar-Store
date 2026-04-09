"use client";

import React from "react";
import { Link, usePage } from "@inertiajs/react";
/**
 * Site-wide navigation bar with glassmorphism effect.
 */
export default function Navbar() {
  const { url } = usePage();

  const links = [
    { href: "/", label: "Order Now", icon: "🛒" },
    { href: "/admin", label: "Admin Panel", icon: "📊" },
  ];

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              Z
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Zafar Store
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  url === link.href
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
