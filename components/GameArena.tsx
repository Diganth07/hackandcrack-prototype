"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Terminal, 
  Cpu, 
  LogOut, 
  Play, 
  ChevronRight, 
  Code2, 
  Timer,
  Award,
  Circle,
  ShieldAlert
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Question } from "../data/questions";

interface GameArenaProps {
  teamName: string;
  score: number;
  round: number;
  currentQIndex: number;
  currentQ: Question;
  questionsCount: number;
  globalTimeLeft: number;
  questionTimeLeft: number;
  isQuestionTimerActive: boolean;
  code: string;
  setCode: (val: string) => void;
  output: string;
  isRunning: boolean;
  runCode: () => void;
  isSolved: boolean;
  onOptionClick: (option: string) => void;
  onNextQuestion: () => void;
  onLogout: () => void;
  showRoundIntro: boolean;
  setShowRoundIntro: (val: boolean) => void;
  isRound1Completed: boolean;
  isFinished: boolean;
  globalTimerActive: boolean;
  round1Enabled: boolean;
  isDisqualified: boolean;
}

export default function GameArena({
  teamName,
  score,
  round,
  currentQIndex,
  currentQ,
  questionsCount,
  globalTimeLeft,
  questionTimeLeft,
  isQuestionTimerActive,
  code,
  setCode,
  output,
  isRunning,
  runCode,
  isSolved,
  onOptionClick,
  onNextQuestion,
  onLogout,
  showRoundIntro,
  setShowRoundIntro,
  isRound1Completed,
  isFinished,
  globalTimerActive,
  round1Enabled,
  isDisqualified
}: GameArenaProps) {

  if (isDisqualified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="glass-card !p-12 text-center max-w-xl border-red-500/20 shadow-2xl"
        >
          <div className="inline-block p-5 bg-red-500/10 rounded-3xl mb-8">
            <ShieldAlert className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-4xl font-black italic text-red-500 mb-2 tracking-tight uppercase">DISQUALIFIED</h2>
          <p className="text-red-500 font-black tracking-[0.4em] uppercase text-[9px] mb-10 italic">Multiple Security Deviations Detected</p>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">Your session has been forcibly terminated due to multiple unauthorized terminal exits or direct ejection from Central Command.</p>
          <button onClick={onLogout} className="btn-ghost w-full !py-4 hover:bg-white/5 border border-white/10">DISCONNECT</button>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card !p-12 text-center max-w-xl border-blue-500/20 shadow-2xl"
        >
          <div className="inline-block p-5 bg-blue-500/10 rounded-3xl mb-8">
            <Trophy className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-5xl font-black italic text-white mb-2 tracking-tight uppercase">MISSION_COMPLETE</h2>
          <p className="text-blue-500 font-black tracking-[0.4em] uppercase text-[9px] mb-10">System Evaluation Finished</p>
          
          <div className="bg-white/[0.03] rounded-3xl p-8 mb-10 border border-white/5">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Final Efficiency Rating</p>
            <h3 className="text-7xl font-black text-white italic">{score} <span className="text-xl text-slate-600 not-italic">/ {questionsCount}</span></h3>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="btn-primary w-full !py-4"
          >
            DISCONNECT_SESSION
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isRound1Completed && round === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="glass-card !p-12 text-center max-w-xl border-purple-500/20 shadow-2xl"
        >
          <div className="inline-block p-5 bg-purple-500/10 rounded-3xl mb-8">
            <Timer className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-5xl font-black italic text-white mb-2 tracking-tight uppercase">TIME_EXPIRED_</h2>
          <p className="text-purple-500 font-black tracking-[0.4em] uppercase text-[9px] mb-10 italic">Synchronization Terminated</p>
          
          <div className="bg-white/[0.03] rounded-3xl p-8 mb-10 border border-white/5">
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Current Efficiency</p>
             <h3 className="text-7xl font-black text-white italic">{score} <span className="text-xl text-slate-600 not-italic">/ 30</span></h3>
          </div>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">Wait for Central Command to initiate Phase 2.</p>
          <button onClick={onLogout} className="btn-ghost w-full !py-4">DISCONNECT</button>
        </motion.div>
      </div>
    );
  }

  if (!round1Enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="glass-card !p-12 text-center max-w-xl border-purple-500/20 shadow-2xl"
        >
          <div className="inline-block p-5 bg-purple-500/10 rounded-3xl mb-8">
            <Timer className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-black italic text-white mb-2 tracking-tight uppercase">WAITING FROM ADMIN...</h2>
          <p className="text-blue-500 font-black tracking-[0.4em] uppercase text-[9px] mb-10 italic">Please stand by...</p>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">The arena will unlock momentarily once Central Command initiates the phase.</p>
        </motion.div>
      </div>
    );
  }

  if (showRoundIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card !p-12 max-w-2xl text-center border-blue-500/20"
        >
          <div className="p-5 bg-blue-500/10 rounded-3xl w-fit mx-auto mb-8">
            <Cpu className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-6xl font-black italic text-white mb-2 tracking-tight">ROUND_0{round}</h2>
          <p className="text-blue-500 font-black tracking-[0.4em] uppercase text-[9px] mb-10 italic">Phase Initialization</p>
          
          <div className="text-left space-y-4 mb-10 text-slate-400 font-medium text-sm border-y border-white/5 py-8">
            <div className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> 30 technical assessment modules.</div>
            <div className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> 30-second synchronization window per module.</div>
            <div className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-blue-500" /> Immediate point allocation for accuracy.</div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRoundIntro(false)}
            className="btn-primary w-full !py-4"
          >
            INITIATE_PHASE_0{round} <Play className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <nav className="glass border-b border-white/5 px-8 pt-6 pb-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="HACKandCRACK Logo" className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-500/50 mt-1">Turing Club Arena</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 bg-white/[0.03] px-6 py-2 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">UNIT</span>
              <span className="text-sm font-black italic text-blue-400 uppercase">{teamName}</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">SCORE</span>
              <span className="text-lg font-black text-white tabular-nums">{score}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">GLOBAL_TIMER</span>
              <span className={`text-lg font-black tabular-nums italic ${globalTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <button onClick={onLogout} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {round === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="badge-live">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                    MODULE_PHASE_01
                  </div>
                  <div className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">
                    PROGRESS: <span className="text-white ml-1">{currentQIndex + 1} / 30</span>
                  </div>
                </div>

                <motion.div
                  key={currentQIndex}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="glass-card !p-8 flex flex-col justify-between min-h-[400px]"
                >
                  <div className="space-y-8">
                    <h3 className="text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] italic">Question_Context</h3>
                    <h2 className="text-3xl font-black text-white leading-tight italic tracking-tight">{currentQ.text}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {currentQ.options.map((option, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ x: 6, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => onOptionClick(option)}
                          className="w-full text-left p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 group transition-all"
                        >
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-500 font-black group-hover:bg-blue-500 group-hover:text-white transition-all italic text-sm">
                               {String.fromCharCode(65 + i)}
                             </div>
                             <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{option}</span>
                           </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="glass-card !p-8 flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-6">Module_Window</span>
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <circle
                        cx="80" cy="80" r="74"
                        stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={2 * Math.PI * 74}
                        strokeDashoffset={(2 * Math.PI * 74) * (1 - questionTimeLeft / 30)}
                        className={`transition-all duration-1000 ${questionTimeLeft <= 5 ? 'text-red-500' : 'text-blue-400'}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-black italic tabular-nums ${questionTimeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {questionTimeLeft}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[10px] font-medium italic opacity-60">Synchronizing...</p>
                </div>

                <div className="glass-card !p-6 flex-1 space-y-4">
                  <h3 className="text-slate-500 font-black uppercase tracking-widest text-[8px] italic">System_Status</h3>
                  <div className="space-y-3">
                    {['Latency', 'Buffer', 'Encryption'].map((label, idx) => (
                      <div key={label} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{label}</span>
                        <span className="text-[9px] font-black text-blue-500">{idx === 0 ? '12ms' : idx === 1 ? 'STABLE' : 'AES-256'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="badge-live !text-blue-400 !border-blue-500/20 !bg-blue-500/5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  CODING_PHASE_02
                </div>
                <div className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">
                  MODULE: <span className="text-white ml-1">{currentQIndex + 1} / 30</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
                <div className="flex flex-col gap-6">
                  <div className="glass-card flex-1 !p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      <h3 className="text-blue-400 font-black uppercase tracking-widest text-[8px] italic">Problem_Interface</h3>
                    </div>
                    <h2 className="text-2xl font-black text-white italic tracking-tight mb-8">{currentQ.codingPrompt}</h2>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Expected_Output</span>
                      <code className="text-blue-400 font-black italic text-lg">{currentQ.expectedOutput}</code>
                    </div>
                    <div className="mt-auto pt-6 flex gap-4">
                       <button onClick={onNextQuestion} className="btn-ghost flex-1 !py-3 !text-[10px]">NEXT_MODULE <ChevronRight className="w-3 h-3 ml-2" /></button>
                    </div>
                  </div>

                  <div className="glass-card h-48 !p-0 overflow-hidden flex flex-col">
                    <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] text-[8px] font-black text-slate-500 uppercase tracking-widest">Compiler_LOG</div>
                    <div className="p-6 font-mono text-slate-400 text-xs overflow-y-auto flex-1">{output || "Awaiting synchronization..."}</div>
                  </div>
                </div>

                <div className="glass-card !p-0 flex flex-col border-blue-500/10">
                  <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500/50" />
                    </div>
                    <button onClick={runCode} disabled={isRunning} className="btn-primary !py-2 !px-6 !text-[9px] !bg-blue-600 shadow-blue-600/20">
                      {isRunning ? "PROCESSING..." : "EXECUTE_BLOCK"}
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 relative">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        fontFamily: "'JetBrains Mono', monospace",
                        padding: { top: 20 },
                        cursorStyle: 'block'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
