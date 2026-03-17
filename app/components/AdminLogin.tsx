"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight } from "lucide-react";
import GlitchTitle from "./GlitchTitle";

interface AdminLoginProps {
  inputAdminPass: string;
  setInputAdminPass: (pass: string) => void;
  handleAdminLogin: () => void;
  setView: (view: string) => void;
}

export default function AdminLogin({
  inputAdminPass,
  setInputAdminPass,
  handleAdminLogin,
  setView
}: AdminLoginProps) {
  return (
    <motion.div
      key="admin-login"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-md mx-auto"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card w-full !p-12 border-blue-500/10 mb-8"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-slate-800/50 rounded-2xl mb-8 group">
            <ShieldCheck className="w-10 h-10 text-slate-500 group-hover:text-blue-500 transition-colors" />
          </div>
          <GlitchTitle text="AUTHORITY_LEVEL_0" className="text-4xl font-black italic tracking-tighter" />
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 opacity-60">System Administrator Access</p>
        </div>
        <p className="text-slate-500 font-medium text-center">Verify system authority to proceed.</p>
      </motion.div>

      <div className="space-y-6">
        <input
          type="password"
          placeholder="System Passkey"
          value={inputAdminPass}
          className="w-full px-6 py-5 bg-slate-950/50 rounded-2xl text-xl border border-white/5 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white font-mono"
          onChange={e => setInputAdminPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdminLogin}
          className="btn-premium w-full !bg-blue-600 shadow-blue-500/30 !py-6 text-lg"
        >
          AUTHORIZE
        </motion.button>

        <button
          onClick={() => setView("role-selection")}
          className="w-full text-slate-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors pt-4 flex items-center justify-center gap-4 group"
        >
          <div className="w-6 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
          ABORT_
          <div className="w-6 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
