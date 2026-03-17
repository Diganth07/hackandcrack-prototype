"use client";

import { motion } from "framer-motion";
import { Code2, ChevronRight, ShieldCheck, Cpu, Play, RefreshCcw } from "lucide-react";
import Editor from "@monaco-editor/react";

interface CodingArenaProps {
  currentQ: any;
  output: string;
  isSolved: boolean;
  code: string;
  isRunning: boolean;
  currentQIndex: number;
  setCode: (code: string) => void;
  runCode: () => void;
  setCurrentQIndex: (idx: number) => void;
  setIsSolved: (solved: boolean) => void;
  setOutput: (output: string) => void;
  setIsFinished: (finished: boolean) => void;
  syncProgress: (updates: any) => void;
}

export default function CodingArena({
  currentQ,
  output,
  isSolved,
  code,
  isRunning,
  currentQIndex,
  setCode,
  runCode,
  setCurrentQIndex,
  setIsSolved,
  setOutput,
  setIsFinished,
  syncProgress
}: CodingArenaProps) {
  return (
    <motion.div
      key="round2"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full"
    >
      <div className="flex flex-col gap-10 w-full">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-card border-blue-500/10 relative overflow-hidden !p-12"
        >
          <div className="absolute top-[-10%] right-[-5%] opacity-10 rotate-12 scale-150 pointer-events-none">
            <Code2 className="w-64 h-64 text-blue-500" />
          </div>
          <div className="flex items-center gap-6 mb-10">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <ChevronRight className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-blue-400 font-black uppercase text-[10px] tracking-[0.6em] opacity-60">Synthesize_Code</span>
          </div>
          <h3 className="text-5xl font-black text-white mb-10 italic text-left tracking-tighter text-glow underline decoration-blue-500/30 decoration-4 underline-offset-8 font-mono">{currentQ.title}</h3>
          <div className="bg-slate-950/50 p-12 rounded-[2.5rem] border border-white/5 shadow-inner">
            <p className="text-2xl text-slate-300 leading-relaxed font-medium italic text-left">
              "{currentQ.codingPrompt}"
            </p>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-center px-10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Stream_Terminal/v1.0</span>
            </div>
          </div>
          <div className="glass rounded-[3rem] p-12 h-full min-h-[350px] font-mono text-2xl relative bg-black/80 overflow-hidden border-white/5 shadow-2xl flex flex-col justify-end">
            <div className="absolute top-8 left-12 text-[10px] text-slate-800 font-black uppercase tracking-[0.6em] border-b border-white/5 pb-2">Ready_Buffer</div>
            <div className="text-white/80 whitespace-pre-wrap mt-10 leading-relaxed text-left flex-1 font-['JetBrains_Mono']">
              {output || (
                <span className="text-slate-800 animate-pulse italic uppercase tracking-widest text-sm">Awaiting_Instructions...</span>
              )}
            </div>
            {isSolved && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-12 flex items-center gap-6 text-emerald-400 font-black italic bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all"
              >
                <ShieldCheck className="w-10 h-10 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-500/60 mb-1">Status_Confirmed</span>
                  <span className="text-xl">MODULAR_MATCH: SUCCESSFUL_EXECUTION</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-full">
        <div className="h-[650px] glass rounded-[3rem] overflow-hidden border border-white/5 relative shadow-2xl group/editor">
          <div className="absolute top-0 left-0 w-full p-6 glass !bg-slate-950/90 border-none border-b border-white/5 flex justify-between items-center px-12 z-20">
            <div className="flex items-center gap-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 italic">Playground_v3 : Python_3.12</span>
            </div>
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-white/5" />
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-white/5" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
            </div>
          </div>
          <div className="pt-20 h-full relative z-10 bg-slate-950/40 font-mono">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              options={{
                fontSize: 22,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 40, bottom: 40 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                lineNumbers: "on",
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden'
                },
                bracketPairColorization: { enabled: true },
                guides: { indentation: true },
                renderLineHighlight: "all",
                lineHeight: 32
              }}
              onChange={v => setCode(v || "")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runCode}
            disabled={isRunning}
            className="md:col-span-3 btn-premium flex items-center justify-center gap-6 !py-10 !rounded-[3rem] shadow-emerald-500/30 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {isRunning ? (
              <div className="flex items-center gap-4">
                <RefreshCcw className="w-10 h-10 animate-spin" />
                <span className="text-3xl font-black italic">PROCESSING...</span>
              </div>
            ) : (
              <>
                <Play className="w-10 h-10 text-white accent-glow transition-transform group-hover:scale-125 duration-500" />
                <span className="text-5xl font-black italic tracking-tighter">EXECUTE_DEPLOYMENT</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!isSolved}
            onClick={() => {
              if (currentQIndex + 1 < 2) {
                const nextIdx = currentQIndex + 1;
                setCurrentQIndex(nextIdx);
                localStorage.setItem("eventQIndex", nextIdx.toString());
                syncProgress({ qIndex: nextIdx });

                setCode("# Write your Python code here...\n");
                setOutput("");
                setIsSolved(false);
              } else {
                setIsFinished(true);
                localStorage.setItem("eventFinished", "true");
                syncProgress({ isFinished: true });
              }
            }}
            className="glass rounded-[3rem] p-8 flex items-center justify-center border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-700 disabled:opacity-30 disabled:cursor-not-allowed group shadow-2xl"
          >
            <ChevronRight className={`w-16 h-16 transition-all duration-700 ${isSolved ? 'text-emerald-400 scale-125 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'text-slate-800'}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
