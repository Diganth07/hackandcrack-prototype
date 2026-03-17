"use client";

import { motion } from "framer-motion";
import { User, Timer, Trophy, LogOut } from "lucide-react";

interface GameHeaderProps {
  teamName: string;
  password: string;
  round: number;
  globalTimeLeft: number;
  score: number;
  handleLogout: () => void;
}

export default function GameHeader({
  teamName,
  password,
  round,
  globalTimeLeft,
  score,
  handleLogout
}: GameHeaderProps) {
  return (
    <header className="glass rounded-[2rem] p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group border-white/5 shadow-2xl w-full">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
      <div className="flex-1 flex items-center gap-8">
        <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
          <User className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-left">
          <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase">
            {teamName}
            <div className="badge-live !bg-emerald-500/5 !text-emerald-400 !border-emerald-500/20">NODE_ACTIVE</div>
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.6em] mt-2 text-[10px] opacity-60">Session_Lead: {password}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-12">
        {round === 1 && (
          <div className="flex items-center gap-4 bg-slate-900/60 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
            <Timer className="w-5 h-5 text-emerald-400" />
            <span className={`text-2xl font-black italic tabular-nums ${globalTimeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden md:inline ml-2">Total_Phase_Time</span>
          </div>
        )}

        <div className="text-right">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-60">Standing_Score</p>
          <div className="text-6xl font-black text-white flex items-center gap-5">
            <span className="text-emerald-400 text-glow">{score}</span>
            <Trophy className="w-8 h-8 text-blue-500 accent-glow shadow-blue-500/20" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="btn-secondary !text-rose-500 !border-rose-500/10 hover:!border-rose-500/50 !px-6 !py-4"
        >
          <LogOut className="w-5 h-5" />
          ABORT
        </motion.button>
      </div>
    </header>
  );
}
