"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface Phase1CompleteProps {
  score: number;
  round2Enabled: boolean;
  onProceed: () => void;
}

export default function Phase1Complete({ score, round2Enabled, onProceed }: Phase1CompleteProps) {
  return (
    <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card max-w-2xl w-full text-center !p-24 border border-emerald-500/10 shadow-2xl"
      >
        <div className="inline-block mb-12 p-10 glass rounded-[4rem] border border-white/5">
          <Award className="w-28 h-28 text-emerald-400 accent-glow shadow-2xl" />
        </div>
        <h1 className="text-7xl font-black mb-8 text-gradient italic tracking-tighter uppercase text-glow">PHASE_01_COMPLETE</h1>
        <p className="text-3xl text-slate-400 font-bold mb-12 italic leading-tight">
          Analytical logic modules finished. <br />Stand by for synthetic phase authorization.
        </p>
        <div className="bg-slate-950/50 p-12 rounded-[2.5rem] border border-white/5 mb-8 font-mono">
          <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4 opacity-60">Phase_01_Score</p>
          <div className="text-8xl font-black text-emerald-400 text-glow tracking-tighter">{score}</div>
        </div>

        {round2Enabled ? (
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onProceed}
            className="btn-premium !bg-indigo-600 !px-24 !py-8 text-2xl shadow-indigo-500/40"
          >
            PROCEED TO PHASE 02
          </motion.button>
        ) : (
          <div className="bg-amber-500/5 border border-amber-500/10 p-10 rounded-[2.5rem]">
            <p className="text-amber-500 font-black uppercase text-sm tracking-[0.5em] animate-pulse italic">
              Awaiting Authorization for Phase 02...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
