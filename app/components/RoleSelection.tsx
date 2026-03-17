"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck, ChevronRight } from "lucide-react";
import GlitchTitle from "./GlitchTitle";

interface RoleSelectionProps {
  setView: (view: string) => void;
  seedTeams: () => void;
}

export default function RoleSelection({ setView, seedTeams }: RoleSelectionProps) {
  return (
    <motion.div
      key="roles"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
    >
      <motion.button
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView("student-login")}
        className="glass-card group text-left !p-12 border-white/5 hover:border-emerald-500/20"
      >
        <div className="p-5 bg-emerald-500/10 rounded-3xl w-fit mb-10 group-hover:bg-emerald-600 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500">
          <User className="w-10 h-10 text-emerald-400 group-hover:text-white" />
        </div>
        <GlitchTitle text="PARTICIPANT" className="text-5xl font-black mb-4 tracking-tight italic" />
        <p className="text-slate-400 text-lg leading-relaxed font-medium">Join the global arena, solve complex modules, and ascend the technical leaderboard.</p>
        <div className="flex items-center gap-3 mt-10 text-emerald-400 font-black uppercase text-sm tracking-[0.2em] group-hover:translate-x-3 transition-transform">
          ENTER ARENA <ChevronRight className="w-5 h-5" />
        </div>
      </motion.button>

      <motion.button
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView("admin-login")}
        className="glass-card group text-left !p-12 border-white/5 hover:border-blue-500/20"
      >
        <div className="p-5 bg-slate-800/50 rounded-3xl w-fit mb-10 group-hover:bg-blue-600 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500">
          <ShieldCheck className="w-10 h-10 text-slate-500 group-hover:text-white" />
        </div>
        <GlitchTitle text="ADMIN" className="text-5xl font-black mb-4 tracking-tight italic opacity-40 group-hover:opacity-100 transition-all font-mono" />
        <p className="text-slate-500 text-lg leading-relaxed font-medium">Administrative control, real-time node monitoring, and system management.</p>
        <div className="flex items-center gap-3 mt-10 text-slate-600 font-black uppercase text-sm tracking-[0.2em] group-hover:text-blue-500 transition-colors">
          DASHBOARD <ChevronRight className="w-5 h-5" />
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 1 }}
        className="mt-24 md:col-span-2 text-center"
      >
        <button
          onClick={seedTeams}
          className="px-6 py-2 border border-white/5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-mono"
        >
          [ SYSTEM_INITIALIZATION_BYPASS ]
        </button>
      </motion.div>
    </motion.div>
  );
}
