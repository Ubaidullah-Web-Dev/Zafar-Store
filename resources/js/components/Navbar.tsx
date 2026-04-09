"use client";

import React from "react";
import { Link, usePage } from "@inertiajs/react";
/**
 * Site-wide navigation bar with glassmorphism effect.
 */
export default function Navbar() {
  const { url } = usePage();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              Z
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Zafar Store
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </nav >
  );
}
