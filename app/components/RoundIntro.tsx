"use client";

import { motion } from "framer-motion";
import { Award, Code2, Terminal } from "lucide-react";

interface RoundIntroProps {
  round: number;
  round1Enabled: boolean;
  onInitialize: () => void;
  onDeploy: () => void;
}

export default function RoundIntro({ round, round1Enabled, onInitialize, onDeploy }: RoundIntroProps) {
  const isR1 = round === 1;
  
  return (
    <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card max-w-4xl w-full text-center !p-24 border border-emerald-500/10 shadow-2xl"
      >
        <div className="flex justify-center mb-12">
          <div className="p-10 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10 relative">
            {isR1 ? <Award className="w-24 h-24 text-emerald-400" /> : <Code2 className="w-24 h-24 text-emerald-400" />}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        <p className="text-emerald-400 font-black tracking-[0.8em] uppercase text-[10px] mb-5 opacity-40">System_Initialization_v1.0.4</p>
        <h1 className="text-9xl font-black mb-10 text-gradient italic tracking-tighter uppercase text-glow">PHASE_0{round}</h1>

        <div className="bg-slate-950/60 p-12 rounded-[3rem] border border-white/5 mb-16 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Terminal className="w-32 h-32" />
          </div>
          <h3 className="text-3xl font-black text-emerald-400 italic mb-6 uppercase tracking-tighter">
            {isR1 ? "01: Analytical Neural Patterns" : "02: Synthetic Logic Deployment"}
          </h3>
          <p className="text-2xl text-slate-400 leading-relaxed font-medium italic">
            {isR1
              ? "In this phase, you must decode complex structural deviations. Latency and accuracy are critical for global synchronization."
              : "Manual implementation required. Deploy high-level Python protocols to solve the objective."}
          </p>
        </div>

        {isR1 ? (
          round1Enabled ? (
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInitialize}
              className="btn-premium !bg-emerald-600 !px-32 !py-10 text-3xl shadow-emerald-500/40 tracking-tighter italic"
            >
              INITIALIZE_LOGIC
            </motion.button>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/10 p-10 rounded-[2.5rem] mt-10">
              <p className="text-amber-500 font-black uppercase text-sm tracking-[0.5em] animate-pulse italic">
                Awaiting System Authorization...
              </p>
            </div>
          )
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDeploy}
            className="btn-premium !bg-emerald-600 !px-32 !py-10 text-3xl shadow-emerald-500/40 tracking-tighter italic"
          >
            DEPLOY_CODE
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
