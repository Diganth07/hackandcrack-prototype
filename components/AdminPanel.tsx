"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Cpu, 
  LogOut, 
  RefreshCcw, 
  Users, 
  Code2,
  Activity,
  Circle,
  Terminal as TerminalIcon,
  ShieldAlert,
  Server,
  Network
} from "lucide-react";

interface AdminDashboardProps {
  totalTeams: number;
  leaderboard: any[];
  globalTimeLeft: number;
  globalTimerActive: boolean;
  round1Enabled: boolean;
  onResetAllPoints: () => void;
  onSetRound1Status: (status: boolean) => void;
  onAdjustGlobalTimer: (seconds: number) => void;
  onToggleGlobalTimer: () => void;
  onForceLogout: (teamId: string) => void;
  onRetest: (teamId: string) => void;
  onExit: () => void;
}

export default function AdminDashboard({
  totalTeams,
  leaderboard,
  globalTimeLeft,
  globalTimerActive,
  round1Enabled,
  onResetAllPoints,
  onSetRound1Status,
  onAdjustGlobalTimer,
  onToggleGlobalTimer,
  onForceLogout,
  onRetest,
  onExit
}: AdminDashboardProps) {
  // Stats calculations for spectator dashboard
  const activeDeviations = leaderboard.reduce((acc, curr) => acc + (curr.tabSwitches || 0), 0);
  const activeNodes = leaderboard.filter(t => t.score >= 0).length; // Assuming all listed are active in some capacity

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-white/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-0 left-1/4 w-1/2 h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-10 gap-8 border-b border-white/10 pb-8">
          <div className="text-left flex flex-col gap-2">
            <div className="flex items-center gap-4 mb-2">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black tracking-[0.3em] uppercase text-blue-200 flex items-center gap-2">
                <Circle className="w-2 h-2 fill-blue-500 text-blue-500 animate-pulse" />
                Live Spectator Feed
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 flex items-center gap-3">
                <Code2 className="w-4 h-4" />
                Turing Club Config
              </span>
            </div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none"
            >
              COMMAND <span className="text-purple-400 font-light italic">OVERVIEW</span>
            </motion.h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Global Timer Controls */}
            <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-1">Global Timer</span>
                <span className={`text-xl font-black tabular-nums tracking-wider ${globalTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-px h-8 bg-white/10 mx-1"></div>
              <div className="flex gap-2">
                <button
                  onClick={onToggleGlobalTimer}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    globalTimerActive 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20' 
                      : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/20'
                  }`}
                >
                  {globalTimerActive ? "Stop Timer" : "Start Timer"}
                </button>
                <button 
                  onClick={() => onAdjustGlobalTimer(60)} 
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-all"
                  title="Add 1 Minute"
                >
                  +1m
                </button>
                <button 
                  onClick={() => onAdjustGlobalTimer(-60)} 
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-all"
                  title="Remove 1 Minute"
                >
                  -1m
                </button>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 mx-2 hidden lg:block"></div>

            <button onClick={onResetAllPoints} className="btn-ghost !text-neutral-300 hover:!text-white !py-3 !px-5 !text-[11px] uppercase tracking-wider">
              <RefreshCcw className="w-4 h-4" /> Reset Nodes
            </button>

            <button
              onClick={() => onSetRound1Status(!round1Enabled)}
              className={`btn-ghost !py-3 !px-5 !text-[11px] uppercase tracking-wider transition-all ${round1Enabled ? "!bg-red-600/20 !border-red-500/50 !text-red-500 hover:!bg-red-600/30" : "!bg-blue-600 !border-blue-500 !text-white hover:!bg-blue-700"}`}
            >
              <Activity className="w-4 h-4 mr-2" />
              {round1Enabled ? "Stop Test (Lock Arena)" : "Start Test (Unlock Arena)"}
            </button>

            <div className="w-px h-10 bg-white/10 mx-2 hidden md:block"></div>

            <button onClick={onExit} className="btn-ghost !py-3 !px-5 !text-[11px] uppercase tracking-wider hover:!bg-white/10">
              <LogOut className="w-4 h-4" /> Close Session
            </button>
          </div>
        </header>

        {/* Spectator System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Registered Participants', val: totalTeams, icon: Users },
            { label: 'Active Arena Nodes', val: activeNodes, icon: Server, pulse: true },
            { label: 'Highest Network Score', val: leaderboard[0]?.score || 0, icon: Trophy },
            { label: 'Security Deviations', val: activeDeviations, icon: ShieldAlert, alert: activeDeviations > 10 }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/30 transition-colors"
            >
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <stat.icon className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-xl border ${stat.alert ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-white/10 border-white/10 text-neutral-300'}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.pulse && <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]" />}
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-1 tracking-tight">{stat.val}</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Spectator Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Global Leaderboard - spans 2 columns */}
          <div className="lg:col-span-2 glass-card !p-0 overflow-hidden shadow-2xl border-white/10 flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                <TerminalIcon className="w-5 h-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Arena Leaderboard</h2>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                Sorted by highest points
              </div>
            </div>

            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full relative">
                <thead className="sticky top-0 bg-black/90 backdrop-blur-xl z-20">
                  <tr className="text-left text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/10">
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Team Identity</th>
                    <th className="px-8 py-5 text-center">Protocol Score</th>
                    <th className="px-8 py-5 text-center">Time (s)</th>
                    <th className="px-8 py-5 text-center">Warnings</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode='popLayout'>
                    {leaderboard.map((team, i) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={team.team}
                        className="group hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-8 py-4">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${i < 3 ? 'bg-white text-black' : 'bg-white/5 text-neutral-400 border border-white/10'}`}>
                            {i < 3 && i === 0 ? "1st" : i < 3 && i === 1 ? "2nd" : i < 3 && i === 2 ? "3rd" : i + 1}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="font-bold text-white text-lg group-hover:text-neutral-300 transition-colors uppercase tracking-tight">{team.team}</div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="font-black text-xl tabular-nums text-white">
                            {team.score.toString().padStart(4, '0')}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="font-bold text-neutral-400 tabular-nums">
                            {team.totalTimeTaken ? `${team.totalTimeTaken}s` : '0s'}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className={`px-3 py-1 rounded-md font-bold text-xs ${team.tabSwitches > 3 ? 'bg-neutral-800 text-white border border-neutral-600' : 'text-neutral-500'}`}>
                            {team.tabSwitches || 0}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <Circle className={`w-2 h-2 ${team.active ? 'fill-blue-500 text-blue-500 animate-pulse' : 'fill-transparent text-neutral-600'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${team.active ? 'text-white' : 'text-neutral-600'}`}>
                              {team.active ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => {
                            if (confirm(`Are you sure you want to retest ${team.team}? This will reset their score and completions.`)) {
                              onRetest(team.team);
                            }
                          }} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-300 px-3 py-1.5 border border-transparent hover:border-blue-500/20 rounded-lg">
                            Retest
                          </button>
                          <button onClick={() => onForceLogout(team.team)} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white px-3 py-1.5 border border-transparent hover:border-white/20 rounded-lg">
                            Eject
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-20 text-center flex flex-col items-center justify-center gap-4">
                        <Network className="w-10 h-10 text-neutral-700 mx-auto" />
                        <span className="text-neutral-600 font-bold uppercase tracking-[0.4em] text-[10px]">
                          Awaiting connections from participants
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Console/Live Feed Simulator */}
          <div className="lg:col-span-1 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col h-[600px] overflow-hidden">
             <div className="p-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">System Logs</span>
                <span className="w-2 h-2 rounded-full border border-neutral-500 bg-transparent animate-pulse" />
             </div>
             
             <div className="flex-1 p-6 font-mono text-xs text-neutral-500 leading-relaxed overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-10" />
                <div className="space-y-4 animate-scroll-up">
                  {leaderboard.slice(0, 10).map((t, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="break-all"
                    >
                      <span className="text-neutral-600">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>{' '}
                      <span className="text-white">NODE_{t.team.substring(0,6).toUpperCase()}</span>{' '}
                      <span className="text-neutral-400">SYNCHRONIZED... SCORE: {t.score}</span>
                    </motion.div>
                  ))}
                  {leaderboard.length > 0 && <div className="text-neutral-300 italic">Listening for changes... _</div>}
                  {leaderboard.length === 0 && <div className="text-neutral-600 italic">Standby model. _</div>}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
