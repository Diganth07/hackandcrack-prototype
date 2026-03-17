"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, Play, Code2, Timer, Pause, LogOut, Users, Cpu, Trophy, Search, Activity, ShieldAlert, Terminal, Zap, Fingerprint, Network, ShieldCheck
} from "lucide-react";
import { useState, useMemo } from "react";
import GlitchTitle from "./GlitchTitle";

interface AdminDashboardProps {
  leaderboard: any[];
  allTeams: any[];
  systemLogs: any[];
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
  allTeams,
  systemLogs,
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
  const [searchTerm, setSearchTerm] = useState("");

  // Merge "allTeams" with "live" status from the leaderboard
  const mergedLeaderboard = useMemo(() => {
    return allTeams.map(baseTeam => {
      const activeInfo = leaderboard.find(l => l.team === baseTeam.id || l.team === baseTeam.TeamName);
      return {
        ...baseTeam,
        isActive: !!activeInfo,
        liveRound: activeInfo?.round || 1,
        liveTabSwitches: activeInfo?.tabSwitches || 0,
        id: baseTeam.id || baseTeam.TeamName
      };
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [allTeams, leaderboard]);

  const filteredTeams = mergedLeaderboard.filter(team => 
    team.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#020617] p-4 md:p-8 font-sans selection:bg-emerald-500/30 overflow-x-hidden"
    >
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100" />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-12 bg-emerald-500/50" />
              <span className="text-emerald-500 font-black text-[10px] tracking-[0.8em] uppercase">Global_Response_Network</span>
            </div>
            <GlitchTitle text="WAR_ROOM_LEADERBOARD" className="text-6xl md:text-8xl font-black italic tracking-tighter text-white" />
            <div className="flex flex-wrap gap-4 items-center !mt-8">
              <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">System_Active: v4.2.0</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-xl text-slate-500">
                <Network className="w-3 h-3" />
                <span className="font-black text-[10px] uppercase tracking-widest">Uplink: ESTABLISHED</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <motion.button onClick={resetAllPoints} whileHover={{ y: -2 }} className="glass hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 !p-5 rounded-2xl border border-white/5 font-black text-[10px] flex flex-col items-center gap-2">
              <RefreshCcw className="w-5 h-5" /> WIPE_ALL
            </motion.button>
            <motion.button onClick={() => setRound1Status(!round1Enabled)} whileHover={{ y: -2 }} className={`glass !p-5 rounded-2xl border font-black text-[10px] flex flex-col items-center gap-2 transition-all ${round1Enabled ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
              <Play className="w-5 h-5" /> {round1Enabled ? 'R1_PAUSE' : 'R1_FIRE'}
            </motion.button>
            <motion.button onClick={() => setRound2Status(!round2Enabled)} whileHover={{ y: -2 }} className={`glass !p-5 rounded-2xl border font-black text-[10px] flex flex-col items-center gap-2 transition-all ${round2Enabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
              <Code2 className="w-5 h-5" /> {round2Enabled ? 'R2_PAUSE' : 'R2_FIRE'}
            </motion.button>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {[
            { label: "CONNECTED_NODES", value: totalTeams, icon: Users, color: "text-emerald-400" },
            { label: "ACTIVE_SESSIONS", value: leaderboard.length, icon: Activity, color: "text-blue-400", ping: true },
            { label: "ARENA_PEAK", value: mergedLeaderboard[0]?.score || 0, icon: Trophy, color: "text-amber-400" },
            { label: "REMAINING_WINDOW", value: `${Math.floor(globalTimeLeft / 60)}:${(globalTimeLeft % 60).toString().padStart(2, '0')}`, icon: Timer, color: "text-rose-400" }
          ].map((stat, i) => (
            <div key={i} className="glass !p-8 border-white/5 group relative overflow-hidden bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem]">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2x border border-white/5 ${stat.color} bg-white/5`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                {stat.ping && <div className="flex h-3 w-3 shadow-[0_0_10px_rgba(52,211,153,0.5)]"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></div>}
              </div>
              <p className="text-slate-500 font-black text-[10px] tracking-widest uppercase mb-1">{stat.label}</p>
              <h3 className="text-5xl font-black text-white tabular-nums tracking-tighter italic">{stat.value}</h3>
              <div className="absolute -bottom-6 -right-6 opacity-[0.02] transform rotate-12 group-hover:scale-110 transition-transform">
                <stat.icon className="w-48 h-48 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & TIMER SYNC */}
        <div className="flex flex-col xl:flex-row gap-6 mb-10 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="QUERY_GLOBAL_NODES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 pr-10 py-6 bg-slate-900/40 rounded-[2.5rem] border border-white/5 focus:border-emerald-500/30 outline-none font-mono text-xl text-white placeholder:text-slate-700 transition-all shadow-inner"
            />
          </div>

          <div className="glass !p-[6px] flex items-center gap-2 border-white/5 rounded-[2rem] bg-slate-900/60 w-full xl:w-auto">
            <div className="flex mr-2">
              <button onClick={() => adjustGlobalTimer(60)} className="px-6 py-4 hover:bg-emerald-500/10 text-emerald-400 font-black text-[10px] tracking-widest hover:text-white transition-all rounded-xl">ADD_MIN</button>
              <button onClick={() => adjustGlobalTimer(-60)} className="px-6 py-4 hover:bg-rose-500/10 text-rose-500 font-black text-[10px] tracking-widest hover:text-white transition-all rounded-xl">SUB_MIN</button>
            </div>
            <button
              onClick={toggleGlobalTimer}
              className={`flex items-center gap-4 px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${globalTimerActive ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
            >
              {globalTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {globalTimerActive ? "SUSPEND_TIME" : "ENGAGE_TIME"}
            </button>
          </div>
        </div>

        {/* THREE COLUMN GRID: MAIN LEADERBOARD | LOGS */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* MAIN LEADERBOARD */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-8 mb-6">
              <div className="flex items-center gap-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-[10px] font-black tracking-[0.6em] text-slate-500 uppercase">Arena_Ranking_Active</h2>
              </div>
              <span className="text-slate-700 font-mono text-[9px] uppercase tracking-widest">Sorting: HIGHEST_SCORE</span>
            </div>

            <div className="space-y-4 max-h-[1400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/5">
              <AnimatePresence mode="popLayout">
                {filteredTeams.map((team, idx) => {
                  const isTester = team.id === 'TEST_ARENA_NODE';
                  const isGold = idx === 0;
                  const isSilver = idx === 1;
                  const isBronze = idx === 2;

                  return (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group relative glass !p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.03] transition-all overflow-hidden flex flex-col md:flex-row items-center gap-10 ${isTester ? 'bg-indigo-500/5 !border-indigo-500/20' : ''}`}
                    >
                      {/* RANK */}
                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <span className={`text-4xl font-black italic tracking-tighter ${isGold ? 'text-amber-400 text-glow' : isSilver ? 'text-slate-300' : isBronze ? 'text-amber-700' : 'text-slate-700 group-hover:text-emerald-400'}`}>
                          #{idx + 1}
                        </span>
                        <div className={`mt-2 h-1 w-full rounded-full transition-all duration-700 ${team.isActive ? 'bg-emerald-500/50' : 'bg-slate-900'}`} />
                      </div>

                      {/* IDENTITY */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                          <h4 className={`text-3xl font-black tracking-tighter uppercase italic transition-colors ${team.isActive ? 'text-white group-hover:text-emerald-400' : 'text-slate-600'}`}>{team.id}</h4>
                          {team.isActive && (
                            <div className="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] px-3 py-1 rounded-full flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE</span>
                            </div>
                          )}
                          {isTester && (
                            <div className="bg-indigo-600 px-3 py-1 rounded-full">
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">TEST_NODE</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-6 font-mono text-[9px] tracking-widest text-slate-700 font-bold uppercase transition-colors group-hover:text-slate-500">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="w-3 h-3" /> PASHASH: {Buffer.from(team.id).toString('hex').slice(0, 8)}
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`w-3 h-3 ${team.liveTabSwitches > 3 ? 'text-rose-500' : ''}`} /> DEVIANCE_COUNT: {team.liveTabSwitches || 0}
                          </div>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                        <div className="glass !bg-black/20 rounded-2xl p-4 border-white/5 group-hover:border-emerald-500/20 transition-all text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">SCORE_PT</p>
                          <span className="text-3xl font-black text-white tabular-nums italic">{team.score || 0}</span>
                        </div>
                        <div className="glass !bg-black/20 rounded-2xl p-4 border-white/5 group-hover:border-blue-500/20 transition-all text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ARENA_PH</p>
                          <span className="text-3xl font-black text-blue-400 tabular-nums italic">Φ{team.liveRound || 1}</span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        {team.isActive && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => forceLogout(team.id)}
                            className="p-5 glass !bg-rose-500/5 border-rose-500/20 text-rose-500 hover:!bg-rose-600 hover:text-white transition-all rounded-2xl group/btn"
                          >
                            <LogOut className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                          </motion.button>
                        )}
                        <div className="h-16 w-[1px] bg-white/5 mx-2" />
                      </div>

                      {/* ABSOLUTE DECOR */}
                      {team.isActive && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* SYSTEM SIDEBAR / LOGS */}
          <div className="flex flex-col gap-8">
            <div className="glass !p-10 rounded-[2.5rem] border-white/5 bg-slate-900/30 flex-1 flex flex-col min-h-[600px] border-t-2 border-emerald-500/20">
              <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-8">
                <Terminal className="w-6 h-6 text-emerald-400" />
                <h3 className="text-[10px] font-black tracking-[0.6em] text-slate-400 uppercase">Battle_Feed</h3>
              </div>

              <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-6 scrollbar-hide">
                {systemLogs.length > 0 ? (
                  systemLogs.map((log, i) => (
                    <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i} className="flex flex-col gap-2 group">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">[{new Date(log.timestamp?.toDate?.() || Date.now()).toLocaleTimeString()}]</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${log.type === 'error' ? 'bg-rose-500 animate-pulse' : log.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      </div>
                      <span className={`leading-relaxed transition-all group-hover:translate-x-1 ${log.type === 'error' ? 'text-rose-500' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {log.message}
                      </span>
                      <div className="h-[1px] w-8 bg-white/5 group-hover:w-full transition-all" />
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                    <Cpu className="w-12 h-12 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-black uppercase tracking-[1em] text-[8px]">Ready_Standby</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass !p-10 rounded-[2.5rem] border-white/5 bg-slate-900/10 backdrop-blur-sm">
              <h5 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Integrity_Check</h5>
              <div className="flex items-center justify-between text-white font-black text-xl italic mb-2">
                <span>DATABASE</span>
                <span className="text-emerald-500">SYNCED</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
