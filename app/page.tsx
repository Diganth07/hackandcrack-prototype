"use client";

import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, where, getDocs, limit, orderBy 
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import RoleSelection from "./components/RoleSelection";
import ParticipantLogin from "./components/ParticipantLogin";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import VictoryScreen from "./components/VictoryScreen";
import Phase1Complete from "./components/Phase1Complete";
import RoundIntro from "./components/RoundIntro";
import QuestionArena from "./components/QuestionArena";
import CodingArena from "./components/CodingArena";
import GameHeader from "./components/GameHeader";
import Navbar from "./components/Navbar";
import { Award, RefreshCcw } from "lucide-react";

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAxF7DVaAVGZ-8GHqhtNHcdU-ERdbbBQWE",
  authDomain: "hackandcrack-protype.firebaseapp.com",
  projectId: "hackandcrack-protype",
  storageBucket: "hackandcrack-protype.firebasestorage.app",
  messagingSenderId: "1079618302498",
  appId: "1:1079618302498:web:a92dd4a77f5503befa107b",
  measurementId: "G-14WFRXW84P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GENERATE UNIQUE DEVICE ID
const getDeviceId = () => {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

// --- 2. EVENT CONFIGURATION ---
const VENUE_CODE = "JAIN-TECH-2026";
const ADMIN_PASSWORD = "private1$";

import { questions } from "./data/questions";

export default function EventPlatform() {
  const [view, setView] = useState("role-selection");
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [inputVenueCode, setInputVenueCode] = useState("");
  const [inputAdminPass, setInputAdminPass] = useState("");
  const [round, setRound] = useState(1);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [code, setCode] = useState("# Write your Python code here...\n");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [answeredInR1, setAnsweredInR1] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [showRoundIntro, setShowRoundIntro] = useState(false);
  const [round1Enabled, setRound1Enabled] = useState(false);
  const [isRound1Completed, setIsRound1Completed] = useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(300);
  const [globalTimerActive, setGlobalTimerActive] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [round2Enabled, setRound2Enabled] = useState(false);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);

  // Refs to avoid stale closures inside async runCode
  const currentQIndexRef = useRef(currentQIndex);
  const isSolvedRef = useRef(isSolved);
  const scoreRef = useRef(score);
  const teamNameRef = useRef(teamName);

  useEffect(() => { currentQIndexRef.current = currentQIndex; }, [currentQIndex]);
  useEffect(() => { isSolvedRef.current = isSolved; }, [isSolved]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { teamNameRef.current = teamName; }, [teamName]);

  // Global Event Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventSettings", "metadata"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRound1Enabled(data.round1Enabled || false);
        setRound2Enabled(data.round2Enabled || false);
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

  // Synchronize Local Clock with Global End Time
  useEffect(() => {
    let interval: any = null;
    if (globalTimerActive && timerEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((timerEndTime - now) / 1000));
        setGlobalTimeLeft(remaining);

        if (remaining <= 0) {
          setIsRound1Completed(true);
          setGlobalTimerActive(false);
          localStorage.setItem("eventRound1Completed", "true");
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [globalTimerActive, timerEndTime]);

  // Participant Global Enforcement
  useEffect(() => {
    if (round === 1 && globalTimerActive && showRoundIntro) {
      setShowRoundIntro(false);
      setQuestionTimeLeft(30);
      setIsQuestionTimerActive(true);
      localStorage.setItem("eventQTimeLeft", "30");
      localStorage.setItem("eventQTimerActive", "true");
    }
  }, [round, globalTimerActive, showRoundIntro]);

  // Per-Question Timer Logic
  useEffect(() => {
    if (!isQuestionTimerActive || round !== 1 || !round1Enabled) return;

    let interval = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) return 0;
        const next = prev - 1;
        localStorage.setItem("eventQTimeLeft", next.toString());
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isQuestionTimerActive, round, round1Enabled]);

  // Question Timer End Logic
  useEffect(() => {
    if (questionTimeLeft === 0 && isQuestionTimerActive && round === 1) {
      const nextIndex = currentQIndex + 1;
      if (nextIndex < 30) {
        setQuestionTimeLeft(30);
        setCurrentQIndex(nextIndex);
        localStorage.setItem("eventQIndex", nextIndex.toString());
        syncProgress({ qIndex: nextIndex });
      } else {
        setIsQuestionTimerActive(false);
        setIsRound1Completed(true);
        localStorage.setItem("eventRound1Completed", "true");
        syncProgress({ isRound1Completed: true });
      }
    }
  }, [questionTimeLeft, isQuestionTimerActive, round, currentQIndex]);

  // Security: Prevent Right-Click and DevTools
  useEffect(() => {
    if (view === "admin-dashboard") return;
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f12" || e.keyCode === 123) { e.preventDefault(); return false; }
      if ((e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || (e.ctrlKey && (e.key === "u" || e.key === "U"))) {
        e.preventDefault(); return false;
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [view]);

  // Restore timer on load
  useEffect(() => {
    const savedRound1Completed = localStorage.getItem("eventRound1Completed");
    const savedQTimeLeft = localStorage.getItem("eventQTimeLeft");
    const savedQTimerActive = localStorage.getItem("eventQTimerActive");

    if (savedQTimeLeft && round === 1) setQuestionTimeLeft(parseInt(savedQTimeLeft));
    if (savedQTimerActive === "true" && round === 1) setIsQuestionTimerActive(true);
    if (savedRound1Completed === "true") setIsRound1Completed(true);
  }, [round]);

  const currentQ = questions[currentQIndex];

  // Session Restoration
  useEffect(() => {
    const checkSession = async () => {
      const savedTeam = localStorage.getItem("eventTeamName");
      const storedQIndex = localStorage.getItem("eventQIndex");
      const storedScore = localStorage.getItem("eventTeamScore");
      const savedDeviceId = localStorage.getItem("eventDeviceId");

      if (savedTeam && savedDeviceId) {
        try {
          const sessionDoc = await getDocs(query(collection(db, "activeSessions"), where("teamName", "==", savedTeam)));
          if (!sessionDoc.empty) {
            const session = sessionDoc.docs[0].data();
            if (session.deviceId === savedDeviceId && session.active === true) {
              setTeamName(savedTeam);
              setScore(session.score || parseInt(storedScore || "0"));
              const fbRound = session.round || 1;
              const fbQIndex = session.currentQIndex || 0;
              const fbAnswered = session.answeredInR1 || [];
              setRound(fbRound);
              setCurrentQIndex(fbQIndex);
              setAnsweredInR1(new Set(fbAnswered));
              setIsFinished(session.isFinished || localStorage.getItem("eventFinished") === "true");
              setIsRound1Completed(session.isRound1Completed || false);
              setTabSwitches(session.tabSwitches || 0);
              setPassword(session.password || session.leaderName || "");
              localStorage.setItem("eventRound", fbRound.toString());
              localStorage.setItem("eventQIndex", fbQIndex.toString());
              localStorage.setItem("eventAnsweredR1", JSON.stringify(fbAnswered));
              localStorage.setItem("eventRound1Completed", (session.isRound1Completed || false).toString());
              setView("game");
              if (fbQIndex === 0) setShowRoundIntro(true);
            }
          }
        } catch (error) { console.error(error); }
      }
    };
    checkSession();
  }, []);

  const [totalTeams, setTotalTeams] = useState(0);

  // Live Sync
  useEffect(() => {
    const qActive = query(collection(db, "activeSessions"));
    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      const liveBoard = snapshot.docs
        .filter(doc => doc.data().active === true)
        .map(doc => ({ 
          team: doc.id, 
          score: doc.data().score || 0,
          tabSwitches: doc.data().tabSwitches || 0,
          round: doc.data().round || 1,
          lastActive: doc.data().loginTime?.toDate?.() || new Date()
        }));
      setLeaderboard(liveBoard.sort((a, b) => b.score - a.score));
    });

    const qTeams = query(collection(db, "teams"));
    const unsubscribeTeams = onSnapshot(qTeams, (snapshot) => {
      setTotalTeams(snapshot.size);
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTeams(teamsData.sort((a: any, b: any) => (b.score || 0) - (a.score || 0)));
    });

    const qLogs = query(collection(db, "systemLogs"), orderBy("timestamp", "desc"), limit(50));
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      setSystemLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeActive();
      unsubscribeTeams();
      unsubscribeLogs();
    };
  }, []);

  // Actions
  const handleStudentLogin = async () => {
    if (isLoggingIn || !teamName.trim() || !password.trim()) return;
    setIsLoggingIn(true);
    try {
      const deviceId = getDeviceId();
      const teamDocRef = doc(db, "teams", teamName);
      let directSnap = await getDoc(teamDocRef);
      
      let matchedTeamDoc: any = null;
      let actualTeamName = "";

      if (directSnap.exists()) {
        const data = directSnap.data();
        const rawPassword = data.password || data.Password || data.pass || "";
        const normalize = (str: any) => str ? str.toString().trim().toLowerCase().replace(/\s+/g, "") : "";
        if (normalize(rawPassword) === normalize(password)) {
          matchedTeamDoc = directSnap; actualTeamName = data.TeamName || directSnap.id;
        }
      }

      if (!matchedTeamDoc) {
        alert("❌ Credentials mismatch. Access Denied.");
        setIsLoggingIn(false); return;
      }

      await setDoc(doc(db, "activeSessions", actualTeamName), {
        teamName: actualTeamName, deviceId, password, loginTime: new Date(), score: matchedTeamDoc.data().score || 0, 
        round: 1, currentQIndex: 0, active: true
      }, { merge: true });

      localStorage.setItem("eventTeamName", actualTeamName); localStorage.setItem("eventDeviceId", deviceId);
      setTeamName(actualTeamName); setView("game"); setShowRoundIntro(true);
    } catch (e) { console.error(e); } finally { setIsLoggingIn(false); }
  };

  const syncProgress = async (updates: any) => {
    const name = teamName || localStorage.getItem("eventTeamName");
    if (!name) return;
    try {
      await setDoc(doc(db, "activeSessions", name), updates, { merge: true });
      if (updates.score !== undefined) await setDoc(doc(db, "teams", name), { score: updates.score }, { merge: true });
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    if (teamName) {
      await setDoc(doc(db, "activeSessions", teamName), { active: false, logoutTime: new Date() }, { merge: true });
      await setDoc(doc(db, "teams", teamName), { isActive: false }, { merge: true });
    }
    localStorage.clear(); window.location.reload();
  };

  const runCode = async () => {
    setIsRunning(true); setOutput("Running...");
    try {
      if (!(window as any).Sk) {
        const load = (src: string) => new Promise(res => {
          const s = document.createElement("script"); s.src = src; s.onload = res; document.head.appendChild(s);
        });
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js");
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js");
      }
      const Sk = (window as any).Sk; let out = "";
      Sk.configure({ output: (t: string) => out += t, read: (x: string) => Sk.builtinFiles["files"][x] });
      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
      const q = questions[currentQIndexRef.current];
      if (out.trim() === q.expectedOutput) {
        if (!isSolvedRef.current) {
          const newScore = scoreRef.current + 1; setScore(newScore); setIsSolved(true); syncProgress({ score: newScore });
        }
        setOutput(out + "\n✅ MATCH_SUCCESS");
      } else setOutput(out + "\n❌ LOGIC_ERROR");
    } catch (e: any) { setOutput(e.toString()); } finally { setIsRunning(false); }
  };

  const seedTeams = async () => {}; // Moved to standalone script

  const resetAllPoints = async () => {
    if (!confirm("Wipe all data?")) return;
    const snap = await getDocs(collection(db, "teams"));
    for (const d of snap.docs) await setDoc(doc(db, "teams", d.id), { score: 0 }, { merge: true });
    alert("Purged.");
  };

  const setRound1Status = (s: boolean) => setDoc(doc(db, "eventSettings", "metadata"), { round1Enabled: s }, { merge: true });
  const setRound2Status = (s: boolean) => setDoc(doc(db, "eventSettings", "metadata"), { round2Enabled: s }, { merge: true });
  const adjustGlobalTimer = (n: number) => setDoc(doc(db, "eventSettings", "metadata"), { globalTimeLeft: globalTimeLeft + n }, { merge: true });
  const toggleGlobalTimer = () => setDoc(doc(db, "eventSettings", "metadata"), { globalTimerActive: !globalTimerActive }, { merge: true });
  const forceLogout = (id: string) => setDoc(doc(db, "activeSessions", id), { active: false }, { merge: true });

  if (view === "admin-dashboard") return (
    <>
      <Navbar view={view} isAdmin={true} onLogout={() => setView("role-selection")} onNavigate={setView} />
      <div className="pt-24">
        <AdminDashboard {...{leaderboard, allTeams, systemLogs, totalTeams, round1Enabled, round2Enabled, globalTimeLeft, globalTimerActive, resetAllPoints, setRound1Status, setRound2Status, adjustGlobalTimer, toggleGlobalTimer, forceLogout, setView}} />
      </div>
    </>
  );
  if (["role-selection", "student-login", "admin-login"].includes(view)) return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden pt-32">
      <Navbar view={view} onLogout={handleLogout} onNavigate={setView} />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 w-full max-w-5xl text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-block mb-10 p-5 glass rounded-[2.5rem] border border-white/10">
          <div className="bg-gradient-to-br from-emerald-500 to-blue-500 p-4 rounded-2xl">
            <Award className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <h1 className="text-8xl md:text-9xl font-black mb-6 tracking-tight text-gradient text-glow italic">HACKandCRACK</h1>
        <p className="text-emerald-300 font-bold tracking-[0.8em] uppercase text-xs mb-16 opacity-60">Grand Challenge_2026</p>
        <AnimatePresence mode="wait">
          {view === "role-selection" && <RoleSelection setView={setView} seedTeams={seedTeams} />}
          {view === "student-login" && <ParticipantLogin teamName={teamName} setTeamName={setTeamName} password={password} setPassword={setPassword} handleStudentLogin={handleStudentLogin} isLoggingIn={isLoggingIn} setView={setView} />}
          {view === "admin-login" && <AdminLogin inputAdminPass={inputAdminPass} setInputAdminPass={setInputAdminPass} handleAdminLogin={() => inputAdminPass === ADMIN_PASSWORD ? setView("admin-dashboard") : alert("Access Denied")} setView={setView} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  if (isFinished) return (
    <>
      <Navbar view="game" teamName={teamName} onLogout={handleLogout} onNavigate={setView} />
      <div className="pt-24">
        <VictoryScreen score={score} handleLogout={handleLogout} />
      </div>
    </>
  );
  if (isRound1Completed) return (
    <>
      <Navbar view="game" teamName={teamName} onLogout={handleLogout} onNavigate={setView} />
      <div className="pt-24">
        <Phase1Complete score={score} round2Enabled={round2Enabled} onProceed={() => { setRound(2); setCurrentQIndex(0); setIsRound1Completed(false); setShowRoundIntro(true); syncProgress({ round: 2, qIndex: 0 }); }} />
      </div>
    </>
  );
  if (showRoundIntro) return (
    <>
      <Navbar view="game" teamName={teamName} onLogout={handleLogout} onNavigate={setView} />
      <div className="pt-24">
        <RoundIntro round={round} round1Enabled={round1Enabled} onInitialize={() => { setIsQuestionTimerActive(true); setQuestionTimeLeft(30); }} onDeploy={() => setShowRoundIntro(false)} />
      </div>
    </>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-fancy bg-slate-950 p-6 md:p-10 flex flex-col items-center relative pt-32">
      <Navbar view="game" teamName={teamName} onLogout={handleLogout} onNavigate={setView} />
      {round === 1 && !round1Enabled && !isRound1Completed && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-xl bg-slate-950/80">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass p-20 rounded-[4rem] text-center max-w-2xl border-2 border-amber-500/20">
            <RefreshCcw className="w-20 h-20 text-amber-500 animate-spin mx-auto mb-10" />
            <h2 className="text-7xl font-black text-amber-500 italic uppercase mb-8">NODE_IDLE</h2>
            <p className="text-2xl text-slate-400 font-medium italic">Suspended by Administrator. Retaining tokens...</p>
          </motion.div>
        </div>
      )}
      <div className="w-full max-w-7xl">
        <GameHeader teamName={teamName} password={password} round={round} globalTimeLeft={globalTimeLeft} score={score} handleLogout={handleLogout} />
        <AnimatePresence mode="wait">
          {round === 1 ? <QuestionArena {...{currentQ, questionTimeLeft, answeredInR1, score, currentQIndex, setScore, setAnsweredInR1, setQuestionTimeLeft, setCurrentQIndex, setIsQuestionTimerActive, setIsRound1Completed, syncProgress}} />
          : <CodingArena {...{currentQ, output, isSolved, code, isRunning, currentQIndex, setCode, runCode, setCurrentQIndex, setIsSolved, setOutput, setIsFinished, syncProgress}} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}