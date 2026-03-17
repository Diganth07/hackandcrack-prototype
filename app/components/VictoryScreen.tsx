"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface VictoryScreenProps {
  score: number;
  handleLogout: () => void;
}

export default function VictoryScreen({ score, handleLogout }: VictoryScreenProps) {
  return (
    <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full scale-150" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card max-w-2xl w-full text-center !p-24 border border-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="inline-block mb-12 p-10 glass rounded-[4rem] border border-white/5 relative"
        >
          <Trophy className="w-28 h-28 text-emerald-400 accent-glow shadow-2xl" />
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
        </motion.div>

        <h1 className="text-8xl font-black mb-6 text-gradient italic tracking-tighter uppercase text-glow">VICTORY_</h1>
        <p className="text-3xl text-slate-400 font-bold mb-12 italic leading-tight tracking-tight">
          Node successfully synchronized. <br />Challenge requirements satisfied.
        </p>

        <div className="bg-slate-950/50 p-12 rounded-[2.5rem] border border-white/5 mb-16 shadow-inner font-mono">
          <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4 opacity-60">Final_Cumulative_Score</p>
          <div className="text-9xl font-black text-emerald-400 text-glow tracking-tighter">{score}</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="btn-premium !bg-emerald-600 !px-24 !py-10 text-2xl shadow-emerald-500/40"
        >
          TERMINATE SESSION
        </motion.button>
      </motion.div>
    </div>
  );
}
