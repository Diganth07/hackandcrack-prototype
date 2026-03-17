"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck, ChevronRight, Binary, Fingerprint, Code2 } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "student-login" | "admin-login") => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 bg-grid overflow-hidden relative selection:bg-white/30 bg-black text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation / Header */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center z-10 px-8 py-6 border-b border-white/[0.05] bg-transparent"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center justify-center">
            <span className="text-white/60 font-mono font-bold text-sm">{"</>"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-sm tracking-widest uppercase">HACK&CRACK</span>
            <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-[0.2em] mt-0.5">2026 EDITION</span>
          </div>
        </div>
        <div>
          <span className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[9px] font-black tracking-[0.2em] uppercase text-white/80">
            System Online
          </span>
        </div>
      </motion.nav>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between z-10 max-w-7xl mx-auto w-full gap-12 lg:gap-24">
        
        {/* Left Side: Hero Intro */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] mb-10 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center text-[8px] font-mono leading-[1.1] text-neutral-400 opacity-80">
              <span>01</span>
              <span>10</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              Conducted by <span className="text-white font-black ml-1">TURING CLUB</span>
            </span>
          </div>

          <h1 className="text-6xl md:text-[5.5rem] font-black mb-6 tracking-tighter leading-[1] text-white uppercase">
            <span className="text-white">WELCOME TO</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7dd3fc] via-[#818cf8] to-[#c084fc]">
              ROUND ONE.
            </span>
          </h1>

          <div className="space-y-8 mb-10 max-w-xl">
            <p className="text-neutral-400 text-lg leading-[1.8] font-medium opacity-90">
              This is the technical sieve. Your logical reasoning, coding prowess, and debugging skills will be put to the ultimate test in an unforgiving arena.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-bold px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> 30 Modules
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-bold px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Real-time Execution
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-bold px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Global Leaderboard
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Role Selection Blocks */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1 w-full max-w-md flex flex-col gap-6"
        >
          <div className="text-xs font-black tracking-[0.3em] uppercase text-neutral-500 mb-2 border-b border-white/10 pb-2">
            Identify Identity
          </div>

          {/* Participant Card */}
          <button
            onClick={() => onSelectRole("student-login")}
            className="group w-full relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 p-6 text-left transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] flex items-center justify-between"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
            <div className="flex gap-5 items-center">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors border border-white/5">
                <Fingerprint className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Participant</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Enter The Arena</p>
              </div>
            </div>
            <div className="p-2 bg-black/40 rounded-full border border-white/10 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => onSelectRole("admin-login")}
            className="group w-full relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 p-6 text-left transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] flex items-center justify-between"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
            <div className="flex gap-5 items-center">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-purple-500/10 transition-colors border border-white/5">
                <ShieldCheck className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Administrator</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">System Override</p>
              </div>
            </div>
            <div className="p-2 bg-black/40 rounded-full border border-white/10 group-hover:bg-purple-500 group-hover:border-purple-500 transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </motion.div>

      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="text-center pb-6 mt-8"
      >
        <p className="text-[10px] font-black tracking-[0.8em] text-neutral-500 uppercase">
          TURING CLUB // 2026
        </p>
      </motion.div>
    </div>
  );
}
