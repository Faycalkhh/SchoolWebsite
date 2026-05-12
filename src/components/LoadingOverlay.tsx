"use client";

import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-wait"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4">
        <Loader2 size={28} className="text-[#2d6a4f] animate-spin" />
        <span className="text-[#1a1a1a] font-semibold text-sm">...</span>
      </div>
    </div>
  );
}
