"use client";

import { motion } from "framer-motion";
import { Terminal, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

interface ParticipantLoginProps {
  teamName: string;
  setTeamName: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onLogin: () => void;
  onBack: () => void;
  isLoggingIn: boolean;
}

export default function ParticipantLogin({
  teamName,
  setTeamName,
  password,
  setPassword,
  onLogin,
  onBack,
  isLoggingIn
}: ParticipantLoginProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-grid h-screen overflow-hidden bg-black text-white">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-4 py-2 rounded-xl glass border border-white/5"
      >
        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Return Gate</span>
      </button>

      <motion.div
        key="student-login"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card !p-10 border-white/10 shadow-white/5">
          <div className="flex items-center gap-5 mb-10">
            <div className="px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="Turing Logo" className="w-10 h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </div>
            <div className="text-left">
              <span className="text-[8px] font-black tracking-[0.3em] uppercase text-neutral-500 block mb-1">Turing Club Portal</span>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase">Arena Access</h2>
              <p className="text-neutral-400 font-bold uppercase text-[9px] tracking-[0.2em]">Credentials Required</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-neutral-500 font-black uppercase text-[9px] tracking-widest ml-1">Team Identity</label>
              <input
                type="text"
                placeholder="ENTER ID"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white font-bold text-lg focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-neutral-700"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className="text-left space-y-2">
              <label className="text-neutral-500 font-black uppercase text-[9px] tracking-widest ml-1">Secure Passkey</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white font-bold text-lg focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-neutral-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onLogin}
                disabled={isLoggingIn}
                className="w-full btn-primary !py-4"
              >
                <span>{isLoggingIn ? "Authenticating..." : "Synchronize Session"}</span>
                <ChevronRight className="w-5 h-5 text-black" />
              </motion.button>

              <button
                onClick={onBack}
                className="w-full btn-ghost !py-4"
              >
                <LogOut className="w-4 h-4" />
                Abort Sequence
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
