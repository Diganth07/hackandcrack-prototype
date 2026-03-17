"use client";

import { useState, useEffect, useRef } from "react";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";

// Components
import RoleSelection from "@/components/RoleSelection";
import ParticipantLogin from "@/components/ParticipantLogin";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminPanel";
import GameArena from "@/components/GameArena";

// Data & Lib
import { questions } from "@/data/questions";
import { db } from "@/lib/firebase";
import { ViewState } from "@/types";
import { verifyAdminPassword } from "./actions";

// --- HELPERS ---
const getDeviceId = () => {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

export default function EventPlatform() {
  // Navigation & Auth State
  const [view, setView] = useState<ViewState>("role-selection");
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState(""); 
  const [inputAdminPass, setInputAdminPass] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Game State
  const [round, setRound] = useState(1);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [code, setCode] = useState("# Write your Python code here...\n");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [answeredInR1, setAnsweredInR1] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [showRoundIntro, setShowRoundIntro] = useState(false);
  const [isRound1Completed, setIsRound1Completed] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Timers & Settings
  const [round1Enabled, setRound1Enabled] = useState(false);
  const [globalTimerActive, setGlobalTimerActive] = useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(300);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);

  // Refs for async logic (avoids stale closures)
  const currentQIndexRef = useRef(currentQIndex);
  const isSolvedRef = useRef(isSolved);
  const scoreRef = useRef(score);
  const teamNameRef = useRef(teamName);

  useEffect(() => { currentQIndexRef.current = currentQIndex; }, [currentQIndex]);
  useEffect(() => { isSolvedRef.current = isSolved; }, [isSolved]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { teamNameRef.current = teamName; }, [teamName]);

  // --- FIREBASE SYNC ---

  // Global Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventSettings", "metadata"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRound1Enabled(data.round1Enabled || false);
        setGlobalTimerActive(data.globalTimerActive ?? false);

        if (data.globalTimerActive && data.timerEndTime) {
          setTimerEndTime(data.timerEndTime);
        } else {
          setTimerEndTime(null);
          setGlobalTimeLeft(data.globalTimeLeft ?? 300);
        }
      }
    });
    return () => unsub();
  }, []);

  // Leaderboard & Team Count Listener
  useEffect(() => {
    let latestTeamsInfo: any[] = [];
    let latestActiveData: Record<string, any> = {};

    const updateLeaderboard = () => {
      const fullBoard = latestTeamsInfo.map(t => {
        const ad = latestActiveData[t.team];
        return {
          ...t,
          active: ad?.active === true,
          score: typeof ad?.score === "number" ? ad.score : t.score,
          tabSwitches: ad?.tabSwitches || 0
        };
      });
      setLeaderboard(fullBoard.sort((a, b) => b.score - a.score));
    };

    const unsubscribeTeams = onSnapshot(query(collection(db, "teams")), (teamsSnapshot) => {
      latestTeamsInfo = teamsSnapshot.docs.map(doc => ({
        team: doc.id,
        score: doc.data().score || 0,
        active: false,
        tabSwitches: 0
      }));
      setTotalTeams(teamsSnapshot.size);
      updateLeaderboard();
    });

    const unsubscribeActive = onSnapshot(query(collection(db, "activeSessions")), (activeSnapshot) => {
      const activeData: any = {};
      activeSnapshot.docs.forEach(doc => {
        activeData[doc.id] = doc.data();
      });
      latestActiveData = activeData;
      updateLeaderboard();
    });

    return () => {
      unsubscribeTeams();
      unsubscribeActive();
    };
  }, []);

  // --- LOGIC & HANDLERS ---

  const syncProgress = async (updates: any) => {
    const name = teamName || localStorage.getItem("eventTeamName");
    if (!name) return;
    try {
      await setDoc(doc(db, "activeSessions", name), updates, { merge: true });
      if (updates.score !== undefined) {
        await setDoc(doc(db, "teams", name), { score: updates.score }, { merge: true });
      }
    } catch (e) { console.error("Sync Error:", e); }
  };

  const handleStudentLogin = async () => {
    if (!teamName.trim() || !password.trim()) {
      alert("❌ Enter all credentials!");
      return;
    }
    setIsLoggingIn(true);
    try {
      const deviceId = getDeviceId();
      const teamDocRef = doc(db, "teams", teamName);
      const snap = await getDoc(teamDocRef);

      if (!snap.exists()) {
        // Try fallback scan (case-insensitive)
        const all = await getDocs(collection(db, "teams"));
        let matched = null;
        all.forEach(d => {
           const data = d.data();
           const name = data.teamName || data.TeamName || d.id;
           const pass = data.password || data.leaderName || "";
           if (name.toLowerCase().trim() === teamName.toLowerCase().trim() && pass.trim() === password.trim()) {
             matched = { id: name, data };
           }
        });
        if (!matched) throw new Error("Invalid Credentials");
        // Proceed with matched... (simplified for this refactor)
      } else {
         const data = snap.data();
         const pass = data.password || data.leaderName || "";
         if (pass !== password) throw new Error("Invalid Password");
      }

      // Check existing session
      const activeSnap = await getDocs(query(collection(db, "activeSessions"), where("teamName", "==", teamName)));
      if (!activeSnap.empty) {
        const sess = activeSnap.docs[0].data();
        if (sess.active && sess.deviceId !== deviceId) throw new Error("Team already playing elsewhere!");
      }

      // Finalize Login
      await setDoc(doc(db, "activeSessions", teamName), {
        teamName, deviceId, active: true, loginTime: new Date()
      }, { merge: true });

      localStorage.setItem("eventTeamName", teamName);
      setView("game");
      if (currentQIndex === 0) setShowRoundIntro(true);
    } catch (e: any) {
      alert(e.message || "Login failed");
    } finally { setIsLoggingIn(false); }
  };

  const handleAdminAuth = async () => {
    const isValid = await verifyAdminPassword(inputAdminPass);
    if (isValid) setView("admin-dashboard");
    else alert("Invalid Admin Key");
  };

  const handleOptionClick = async (option: string) => {
    if (answeredInR1.has(currentQIndex)) return;
    const isCorrect = option === questions[currentQIndex].correctAnswer;
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      syncProgress({ score: newScore });
    }
    const newAnswered = new Set(answeredInR1).add(currentQIndex);
    setAnsweredInR1(newAnswered);
    // Move to next automatically for MCQs
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const next = currentQIndex + 1;
    if (next < questions.length) {
      setCurrentQIndex(next);
      setQuestionTimeLeft(30);
      syncProgress({ currentQIndex: next });
    } else {
      setIsFinished(true);
      syncProgress({ isFinished: true });
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      if (!(window as any).Sk) {
        const load = (src: string) => new Promise(res => {
          const s = document.createElement("script"); s.src = src; s.onload = res; document.head.appendChild(s);
        });
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js");
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js");
      }
      const Sk = (window as any).Sk;
      let out = "";
      Sk.configure({ output: (t: string) => out += t, read: (x: string) => Sk.builtinFiles["files"][x] });
      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
      
      const clean = out.trim();
      const q = questions[currentQIndexRef.current];
      if (clean === q.expectedOutput) {
        if (!isSolvedRef.current) {
          const ns = scoreRef.current + 1;
          setScore(ns);
          setIsSolved(true);
          syncProgress({ score: ns });
        }
        setOutput(out + "\n✅ CORRECT!");
      } else {
        setOutput(out + "\n❌ INCORRECT.\nExpected: " + q.expectedOutput);
      }
    } catch (e: any) { setOutput(e.toString()); }
    finally { setIsRunning(false); }
  };

  const handleLogout = () => {
      // Clear all
      localStorage.clear();
      window.location.reload(); // Hard refresh to reset state
  };

  // --- TIMERS ---
  useEffect(() => {
    let interval: any = null;
    if (globalTimerActive && timerEndTime) {
      interval = setInterval(() => {
        const rem = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
        setGlobalTimeLeft(rem);
        if (rem <= 0) { setIsRound1Completed(true); setGlobalTimerActive(false); }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [globalTimerActive, timerEndTime]);

  useEffect(() => {
      if (!round1Enabled || !globalTimerActive || isRound1Completed || round !== 1) return;
      const interval = setInterval(() => {
          setQuestionTimeLeft(prev => {
              if (prev <= 1) { handleNextQuestion(); return 30; }
              return prev - 1;
          });
      }, 1000);
      return () => clearInterval(interval);
  }, [round1Enabled, globalTimerActive, isRound1Completed, round, currentQIndex]);

  return (
    <AnimatePresence mode="wait">
      {view === "role-selection" && <RoleSelection onSelectRole={setView} />}
      {view === "student-login" && (
        <ParticipantLogin 
          teamName={teamName} setTeamName={setTeamName}
          password={password} setPassword={setPassword}
          onLogin={handleStudentLogin} onBack={() => setView("role-selection")}
          isLoggingIn={isLoggingIn}
        />
      )}
      {view === "admin-login" && (
        <AdminLogin 
          passkey={inputAdminPass} setPasskey={setInputAdminPass}
          onLogin={handleAdminAuth} onBack={() => setView("role-selection")}
          isLoggingIn={isLoggingIn}
        />
      )}
      {view === "admin-dashboard" && (
        <AdminDashboard 
          totalTeams={totalTeams} leaderboard={leaderboard}
          globalTimeLeft={globalTimeLeft} globalTimerActive={globalTimerActive}
          round1Enabled={round1Enabled}
          onResetAllPoints={() => {}} // Connect matching functions
          onSetRound1Status={(s) => setDoc(doc(db, "eventSettings", "metadata"), { round1Enabled: s }, { merge: true })}
          onAdjustGlobalTimer={(seconds) => {
            const newTime = Math.max(0, globalTimeLeft + seconds);
            setDoc(doc(db, "eventSettings", "metadata"), { globalTimeLeft: newTime }, { merge: true });
          }} 
          onToggleGlobalTimer={() => {
            const newState = !globalTimerActive;
            const update: any = { globalTimerActive: newState };
            if (newState) {
              update.timerEndTime = Date.now() + globalTimeLeft * 1000;
            }
            setDoc(doc(db, "eventSettings", "metadata"), update, { merge: true });
          }}
          onForceLogout={async (tName) => {
             await setDoc(doc(db, "activeSessions", tName), { active: false }, { merge: true });
          }}
          onExit={() => setView("role-selection")}
        />
      )}
      {view === "game" && (
        <GameArena 
          teamName={teamName} score={score} round={round}
          currentQIndex={currentQIndex} currentQ={questions[currentQIndex]}
          questionsCount={questions.length} globalTimeLeft={globalTimeLeft}
          questionTimeLeft={questionTimeLeft} isQuestionTimerActive={globalTimerActive}
          code={code} setCode={setCode} output={output}
          isRunning={isRunning} runCode={runCode} isSolved={isSolved}
          onOptionClick={handleOptionClick} onNextQuestion={handleNextQuestion}
          onLogout={handleLogout} showRoundIntro={showRoundIntro}
          setShowRoundIntro={setShowRoundIntro} isRound1Completed={isRound1Completed}
          isFinished={isFinished} globalTimerActive={globalTimerActive}
          round1Enabled={round1Enabled}
        />
      )}
    </AnimatePresence>
  );
}