"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Shield, User, Menu, X, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  view: string;
  teamName?: string;
  isAdmin?: boolean;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

export default function Navbar({ view, teamName, isAdmin, onLogout, onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show on role selection or simple login screens unless desired
  // Actually the user asked for navigation on EVERY page.
  
  const isGameView = view === "game" || view === "admin-dashboard";

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] px-6 py-4">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center glass !bg-slate-950/40 backdrop-blur-xl border-white/5 px-8 py-4 rounded-2xl shadow-2xl">
        {/* LOGO / BRAND */}
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onNavigate?.("role-selection")}
        >
          <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">HACKandCRACK</h1>
            <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Grand_Challenge_2026</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {view === "role-selection" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting_Uplink</span>
            </div>
          )}

          {view !== "role-selection" && (
            <button 
              onClick={() => onNavigate?.("role-selection")}
              className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> BACK_TO_ORIGIN
            </button>
          )}

          {isAdmin && (
            <div className="flex items-center gap-3 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Admin_Terminal</span>
            </div>
          )}

          {teamName && view === "game" && (
            <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{teamName}</span>
            </div>
          )}

          {(isAdmin || (teamName && isGameView)) && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-rose-500 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sign_Out</span>
            </button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 glass border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-center shadow-2xl"
          >
            {view !== "role-selection" && (
              <button 
                onClick={() => { onNavigate?.("role-selection"); setIsMenuOpen(false); }}
                className="py-4 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest"
              >
                BACK_TO_ORIGIN
              </button>
            )}
            
            {(isAdmin || (teamName && isGameView)) && (
              <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="py-4 text-[10px] font-black text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl uppercase tracking-widest transition-all"
              >
                Sign_Out_Terminal
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
