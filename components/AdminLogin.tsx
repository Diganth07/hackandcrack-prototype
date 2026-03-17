"use client";

import { motion } from "framer-motion";
import { ShieldCheck, LogOut, ChevronRight, Lock } from "lucide-react";

interface AdminLoginProps {
  passkey: string;
  setPasskey: (val: string) => void;
  onLogin: () => void;
  onBack: () => void;
  isLoggingIn: boolean;
}

export default function AdminLogin({
  passkey,
  setPasskey,
  onLogin,
  onBack,
  isLoggingIn,
}: AdminLoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-grid bg-black text-white relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-4 py-2 rounded-xl glass border border-white/5 z-50"
      >
        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Return Gate</span>
      </button>

      <motion.div
        key="admin-login"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card !p-10 border-white/10 shadow-white/5">
          <div className="flex items-center gap-5 mb-10">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black tracking-tight text-white uppercase">System Authority</h2>
              <p className="text-neutral-400 font-bold uppercase text-[9px] tracking-[0.2em]">High Priority Access</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-neutral-500 font-black uppercase text-[9px] tracking-widest ml-1">Admin Passkey</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-4 pl-12 text-white font-bold text-lg focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-neutral-700"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onLogin}
                disabled={isLoggingIn}
                className="w-full btn-primary !py-4"
              >
                <span>{isLoggingIn ? "Verifying..." : "Establish Command"}</span>
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
