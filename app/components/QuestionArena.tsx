"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface QuestionArenaProps {
  currentQ: any;
  questionTimeLeft: number;
  answeredInR1: Set<number>;
  score: number;
  currentQIndex: number;
  setScore: (score: number) => void;
  setAnsweredInR1: (answered: Set<number>) => void;
  setQuestionTimeLeft: (time: number) => void;
  setCurrentQIndex: (index: number) => void;
  setIsQuestionTimerActive: (active: boolean) => void;
  setIsRound1Completed: (completed: boolean) => void;
  syncProgress: (updates: any) => void;
}

export default function QuestionArena({
  currentQ,
  questionTimeLeft,
  answeredInR1,
  score,
  currentQIndex,
  setScore,
  setAnsweredInR1,
  setQuestionTimeLeft,
  setCurrentQIndex,
  setIsQuestionTimerActive,
  setIsRound1Completed,
  syncProgress
}: QuestionArenaProps) {
  return (
    <motion.div
      key="round1"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -30, opacity: 0 }}
      className="glass-card !p-12 md:!p-16 text-center relative overflow-hidden border-emerald-500/10"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex items-center gap-4 bg-emerald-500/5 text-emerald-400 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
            <Award className="w-5 h-5 flex-shrink-0" />
            OBJECTIVE: Identify Structural Deviations
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16 text-left">
          <h3 className="text-2xl md:text-4xl font-black leading-tight text-white tracking-tighter italic text-glow flex-1">
            {currentQ.text}
          </h3>

          <div className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-[4px] flex items-center justify-center transition-all duration-300 shadow-2xl relative overflow-hidden ${questionTimeLeft <= 3 ? 'border-rose-500 shadow-rose-500/40 bg-rose-500/10' : 'border-emerald-500/20 shadow-emerald-500/20 bg-emerald-500/5'
            }`}>
            <div className={`text-4xl md:text-6xl font-black italic tabular-nums tracking-tighter text-glow ${questionTimeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'
              }`}>
              {questionTimeLeft}
            </div>
            <div className={`absolute inset-0 border-t-4 border-transparent rounded-full animate-spin transition-colors ${questionTimeLeft <= 3 ? 'border-rose-500/40' : 'border-emerald-500/40'
              }`} style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentQ.options.map((o: string, i: number) => (
            <motion.button
              key={o + i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const alreadyAnswered = answeredInR1.has(currentQ.id);
                if (!alreadyAnswered) {
                  const isCorrect = o === currentQ.correctAnswer;
                  const newScore = isCorrect ? score + 1 : score;
                  if (isCorrect) setScore(newScore);

                  const newAnswered = new Set(answeredInR1);
                  newAnswered.add(currentQ.id);
                  setAnsweredInR1(newAnswered);

                  const answeredArr = Array.from(newAnswered);
                  localStorage.setItem("eventAnsweredR1", JSON.stringify(answeredArr));
                  localStorage.setItem("eventTeamScore", newScore.toString());

                  const nextIndex = currentQIndex + 1;
                  if (nextIndex < 30) {
                    setQuestionTimeLeft(30);
                    setCurrentQIndex(nextIndex);
                    localStorage.setItem("eventQIndex", nextIndex.toString());
                    syncProgress({ score: newScore, qIndex: nextIndex, answered: answeredArr });
                  } else {
                    setIsQuestionTimerActive(false);
                    localStorage.setItem("eventTimerActive", "false");
                    setIsRound1Completed(true);
                    localStorage.setItem("eventRound1Completed", "true");
                    syncProgress({ score: newScore, answered: answeredArr, isRound1Completed: true });
                  }
                } else {
                  const nextIndex = currentQIndex + 1;
                  if (nextIndex < 30) {
                    setCurrentQIndex(nextIndex);
                    localStorage.setItem("eventQIndex", nextIndex.toString());
                    syncProgress({ qIndex: nextIndex });
                  } else {
                    setIsQuestionTimerActive(false);
                    localStorage.setItem("eventTimerActive", "false");
                    setIsRound1Completed(true);
                    localStorage.setItem("eventRound1Completed", "true");
                    syncProgress({ isRound1Completed: true });
                  }
                }
              }}
              className="glass !bg-white/[0.01] p-10 rounded-[2.5rem] text-2xl font-black hover:!bg-emerald-600/10 hover:border-emerald-500/40 transition-all border border-white/5 group relative overflow-hidden text-center italic"
            >
              <div className="absolute top-6 left-10 text-[9px] font-black text-slate-800 group-hover:text-emerald-400/60 transition-colors uppercase tracking-[0.5em]">
                Choice_0{i + 1}
              </div>
              <span className="relative z-10 text-white group-hover:text-glow transition-all tracking-tight font-mono">{o}</span>
              <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
