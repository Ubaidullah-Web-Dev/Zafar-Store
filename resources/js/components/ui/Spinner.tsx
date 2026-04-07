"use client";

import React from "react";

/**
 * Full-screen loading spinner overlay.
 */
export default function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-amber-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-orange-500 animate-spin animation-delay-150" />
      </div>
      <p className="text-gray-400 text-sm animate-pulse">{text}</p>
    </div>
  );
}
