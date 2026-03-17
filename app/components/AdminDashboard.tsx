"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, Play, Code2, Timer, Plus, Minus, Pause, LogOut, Users, Cpu, Trophy 
} from "lucide-react";

interface AdminDashboardProps {
  leaderboard: any[];
  totalTeams: number;
  round1Enabled: boolean;
  round2Enabled: boolean;
  globalTimeLeft: number;
  globalTimerActive: boolean;
  resetAllPoints: () => void;
  setRound1Status: (status: boolean) => void;
  setRound2Status: (status: boolean) => void;
  adjustGlobalTimer: (seconds: number) => void;
  toggleGlobalTimer: () => void;
  forceLogout: (teamId: string) => void;
  setView: (view: string) => void;
}

export default function AdminDashboard({
  leaderboard,
  totalTeams,
  round1Enabled,
  round2Enabled,
  globalTimeLeft,
  globalTimerActive,
  resetAllPoints,
  setRound1Status,
  setRound2Status,
  adjustGlobalTimer,
  toggleGlobalTimer,
  forceLogout,
  setView
}: AdminDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-fancy bg-slate-950 p-8 md:p-12"
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="text-left">
            <motion.h1
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-8xl font-black italic uppercase text-gradient text-glow mb-2 tracking-tighter"
            >
              DASHBOARD_
            </motion.h1>
            <p className="text-emerald-400 font-black tracking-[0.8em] uppercase text-[10px] ml-2">System Authority Level 01</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetAllPoints}
              className="btn-premium !bg-rose-600/10 !text-rose-500 border border-rose-500/20 hover:!bg-rose-600 hover:!text-white shadow-none hover:shadow-rose-600/40"
            >
              <RefreshCcw className="w-5 h-5" />
              CLEAR_NODES
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRound1Status(!round1Enabled)}
              className={`btn-premium ${round1Enabled ? "!bg-amber-600 shadow-amber-600/40" : "!bg-emerald-600 shadow-emerald-600/40"}`}
            >
              <Play className="w-5 h-5 flex-shrink-0" />
              {round1Enabled ? "SUSPEND ROUND 1" : "INITIATE ROUND 1"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRound2Status(!round2Enabled)}
              className={`btn-premium ${round2Enabled ? "!bg-amber-600 shadow-amber-600/40" : "!bg-indigo-600 shadow-indigo-600/40"}`}
            >
              <Code2 className="w-5 h-5 flex-shrink-0" />
              {round2Enabled ? "SUSPEND ROUND 2" : "INITIATE ROUND 2"}
            </motion.button>

            {round1Enabled && (
              <div className="flex items-center gap-4 bg-slate-900/80 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                <Timer className="w-6 h-6 text-emerald-400" />
                <span className="text-3xl font-black italic tabular-nums text-white min-w-[3ch]">
                  {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
                </span>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => adjustGlobalTimer(60)} className="p-2 hover:bg-white/5 rounded-lg text-emerald-400 transition-colors"><Plus className="w-5 h-5" /></button>
                  <button onClick={() => adjustGlobalTimer(-60)} className="p-2 hover:bg-white/5 rounded-lg text-rose-400 transition-colors"><Minus className="w-5 h-5" /></button>
                  <button onClick={toggleGlobalTimer} className="p-2 hover:bg-white/10 rounded-lg text-amber-400 transition-all">
                    {globalTimerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setView("role-selection")}
              className="btn-secondary !border-white/5 hover:!border-white/20"
            >
              <LogOut className="w-5 h-5" />
              EXIT
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card flex items-center gap-8 !p-10"
          >
            <div className="p-5 bg-indigo-500/10 rounded-[2rem]">
              <Users className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Teams</p>
              <h3 className="text-5xl font-black text-white">{totalTeams}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card flex items-center gap-8 !p-10 border-emerald-500/10"
          >
            <div className="p-5 bg-emerald-500/10 rounded-[2rem] relative">
              <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <Cpu className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Live Slots</p>
              <h3 className="text-5xl font-black text-white">{leaderboard.length}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card flex items-center gap-8 !p-10"
          >
            <div className="p-5 bg-rose-500/10 rounded-[2rem]">
              <Trophy className="w-10 h-10 text-rose-400" />
            </div>
            <div className="text-left">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Top Score</p>
              <h3 className="text-5xl font-black text-white">{leaderboard[0]?.score || 0}</h3>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl"
        >
          <div className="p-12 border-b border-white/5 bg-white/[0.01] flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <h2 className="text-4xl font-black italic tracking-tighter text-white">
              LIVE_LEADERBOARD
            </h2>
            <div className="badge-live !bg-emerald-500/5 !text-emerald-400 !border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              REALTIME_DATASTREAM
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-xs font-black uppercase tracking-[0.3em] border-b border-white/5">
                  <th className="p-10">Rank</th>
                  <th className="p-10">Team Identity</th>
                  <th className="p-10 text-center">Score</th>
                  <th className="p-10 text-center">Tab Deviations</th>
                  <th className="p-10">Status</th>
                  <th className="p-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {leaderboard.map((team, i) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={team.team}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-white font-black italic text-3xl shadow-lg shadow-emerald-500/5">
                          {i + 1}
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="font-black text-white text-2xl group-hover:text-emerald-400 transition-colors italic tracking-tight uppercase">{team.team}</div>
                      </td>
                      <td className="p-10">
                        <div className="flex justify-center">
                          <span className="bg-white/5 px-8 py-3 rounded-2xl font-black text-2xl border border-white/5 group-hover:border-emerald-500/30 transition-all">
                            {team.score}
                          </span>
                        </div>
                      </td>
                      <td className="p-10 text-center">
                        <div className="flex justify-center">
                          <span className={`px-6 py-2 rounded-xl font-black text-xl border ${team.tabSwitches > 3 ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : team.tabSwitches > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                            {team.tabSwitches || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Session</span>
                        </div>
                      </td>
                      <td className="p-10 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => forceLogout(team.team)}
                          className="btn-secondary !text-rose-500 border-rose-500/20 hover:border-rose-500/50 !text-[10px] !px-5 !py-3 tracking-[0.2em]"
                        >
                          DISCONNECT
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-24 text-center text-slate-600 font-bold uppercase tracking-[0.5em] text-sm font-mono">
                      Synchronizing global nodes...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
