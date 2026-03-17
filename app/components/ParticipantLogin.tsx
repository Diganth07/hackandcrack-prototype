"use client";

import { motion } from "framer-motion";
import { ChevronRight, RefreshCcw, ShieldCheck, User } from "lucide-react";
import GlitchTitle from "./GlitchTitle";

interface ParticipantLoginProps {
  teamName: string;
  setTeamName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleStudentLogin: () => void;
  isLoggingIn: boolean;
  setView: (view: string) => void;
}

export default function ParticipantLogin({
  teamName,
  setTeamName,
  password,
  setPassword,
  handleStudentLogin,
  isLoggingIn,
  setView
}: ParticipantLoginProps) {
  return (
    <motion.div
      key="student-login"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-lg mx-auto" // Removed glass-card from here as it's now on the inner div
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card max-w-xl w-full !p-16 border-emerald-500/10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="p-6 bg-emerald-500/10 rounded-3xl mb-8">
            <User className="w-12 h-12 text-emerald-400" />
          </div>
          <GlitchTitle text="LOGIN_SESSION" className="text-6xl font-black italic tracking-tighter" />
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 opacity-60">Authorize Terminal Access</p>
        </div>
        <p className="text-slate-400 font-medium text-lg">Initialize your team node to synchronize with the arena.</p>
      </motion.div>

      <div className="space-y-8 mt-8"> {/* Added mt-8 for spacing between the two motion.divs */}
        <div className="group">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3 ml-2 group-focus-within:text-white transition-colors">Team_Identity</div>
          <input
            placeholder="e.g. CyberKnights"
            value={teamName}
            className="w-full px-8 py-6 bg-slate-950/50 rounded-[1.5rem] text-2xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white font-mono"
            onChange={e => setTeamName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
          />
        </div>
        <div className="group">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3 ml-2 group-focus-within:text-white transition-colors">Secure_Passkey</div>
          <input
            placeholder="••••••••"
            type="password"
            value={password}
            className="w-full px-8 py-6 bg-slate-950/50 rounded-[1.5rem] text-2xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white font-mono"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStudentLogin}
          disabled={isLoggingIn}
          className="btn-premium w-full mt-10 !py-8 text-xl shadow-emerald-500/40"
        >
          {isLoggingIn ? (
            <RefreshCcw className="w-8 h-8 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-4">
              SYNCHRONIZE SESSION
              <ChevronRight className="w-6 h-6" />
            </div>
          )}
        </motion.button>

        <button
          onClick={() => setView("role-selection")}
          className="w-full text-slate-500 font-black uppercase text-xs tracking-[0.4em] hover:text-white transition-colors pt-8 flex items-center justify-center gap-4 group"
        >
          <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
          DISCONNECT
          <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
