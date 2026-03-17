"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
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
import {
  Trophy,
  Terminal,
  Cpu,
  User,
  ShieldCheck,
  LogOut,
  Play,
  RefreshCcw,
  ChevronRight,
  Code2,
  Award,
  Users,
  Timer,
  Plus,
  Minus,
  Pause
} from "lucide-react";

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
  const [password, setPassword] = useState(""); // This acts as password
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
      }, 500); // Check half-second for smoothness
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

  // Security: Prevent Right-Click and DevTools shortcuts for participants
  useEffect(() => {
    // Only apply if not in admin view
    if (view === "admin-dashboard") return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Optional: alert("Right-click is restricted.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === "f12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+Shift+I, J, C and Ctrl+U
      if ((e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U"))) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [view]);

  /* Anti-Cheat: Tab Switching Detection (Temporarily Disabled)
  useEffect(() => {
    if (view !== "game" || !teamName) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        const newCount = tabSwitches + 1;
        setTabSwitches(newCount);
        
        await setDoc(doc(db, "activeSessions", teamName), { 
          tabSwitches: newCount 
        }, { merge: true });

        if (newCount >= 3) {
          alert("🚨 SECURITY VIOLATION 🚨\n\nYou have deviated 3 times. According to system protocol, you are now disqualified and logged out.");
          handleLogout();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [view, teamName, tabSwitches]);
  */

  // Restore timer on load
  useEffect(() => {
    const savedRound1Completed = localStorage.getItem("eventRound1Completed");
    const savedQTimeLeft = localStorage.getItem("eventQTimeLeft");
    const savedQTimerActive = localStorage.getItem("eventQTimerActive");

    if (savedQTimeLeft && round === 1) {
      setQuestionTimeLeft(parseInt(savedQTimeLeft));
    }
    if (savedQTimerActive === "true" && round === 1) {
      setIsQuestionTimerActive(true);
    }
    if (savedRound1Completed === "true") {
      setIsRound1Completed(true);
    }
  }, [round]);

  const currentQ = questions[currentQIndex];

  // Restore round progress from localStorage on session load
  useEffect(() => {
    const checkSession = async () => {
      const savedTeam = localStorage.getItem("eventTeamName");
      const storedQIndex = localStorage.getItem("eventQIndex");
      const storedScore = localStorage.getItem("eventTeamScore");
      const storedQTimeLeft = localStorage.getItem("eventQTimeLeft");
      const storedQTimerActive = localStorage.getItem("eventQTimerActive");
      const savedDeviceId = localStorage.getItem("eventDeviceId");

      if (savedTeam && savedDeviceId) {
        try {
          const sessionDoc = await getDocs(query(collection(db, "activeSessions"), where("teamName", "==", savedTeam)));
          if (!sessionDoc.empty) {
            const session = sessionDoc.docs[0].data();
            if (session.deviceId === savedDeviceId && session.active === true) {
              setTeamName(savedTeam);
              // Restore score from Firebase (authoritative)
              setScore(session.score || parseInt(storedScore || "0"));
              // Restore round progress from Firebase (authoritative)
              const fbRound = session.round || 1;
              const fbQIndex = session.currentQIndex || 0;
              const fbAnswered = session.answeredInR1 || [];
              setRound(fbRound);
              setCurrentQIndex(fbQIndex);
              setAnsweredInR1(new Set(fbAnswered));
              setIsFinished(session.isFinished || localStorage.getItem("eventFinished") === "true");
              setIsRound1Completed(session.isRound1Completed || false);
              setTabSwitches(session.tabSwitches || 0);
              setPassword(session.password || session.leaderName || ""); // Restore password/leaderName/passkey for header
              // Sync localStorage too
              localStorage.setItem("eventRound", fbRound.toString());
              localStorage.setItem("eventQIndex", fbQIndex.toString());
              localStorage.setItem("eventAnsweredR1", JSON.stringify(fbAnswered));
              localStorage.setItem("eventRound1Completed", (session.isRound1Completed || false).toString());
              setView("game");
              if (fbQIndex === 0) setShowRoundIntro(true);
            } else {
              localStorage.removeItem("eventTeamName");
              localStorage.removeItem("eventTeamScore");
              localStorage.removeItem("eventDeviceId");
              localStorage.removeItem("eventRound");
              localStorage.removeItem("eventQIndex");
              localStorage.removeItem("eventAnsweredR1");
            }
          }
        } catch (error) {
          console.error("Session check error:", error);
        }
      }
    };
    checkSession();
  }, []);

  // STATE EXTENSION FOR LEADERBOARD
  const [totalTeams, setTotalTeams] = useState(0);

  // LIVE LEADERBOARD SYNC
  useEffect(() => {
    const qActive = query(collection(db, "activeSessions"));
    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      const liveBoard = snapshot.docs
        .filter(doc => doc.data().active === true)
        .map(doc => ({ team: doc.id, score: doc.data().score || 0 }));
      setLeaderboard(liveBoard.sort((a, b) => b.score - a.score));
    });

    // Also track total registered teams
    const qTeams = query(collection(db, "teams"));
    const unsubscribeTeams = onSnapshot(qTeams, (snapshot) => {
      setTotalTeams(snapshot.size);
    });

    return () => {
      unsubscribeActive();
      unsubscribeTeams();
    };
  }, []);

  const handleStudentLogin = async () => {
    if (isLoggingIn) return;

    console.log("Login attempted:", { teamName, password, inputVenueCode });

    // Validation
    if (!teamName.trim()) {
      alert("❌ Please enter team name!");
      return;
    }

    if (!password.trim()) {
      alert("❌ Please enter password!");
      return;
    }

    setIsLoggingIn(true);

    try {
      const deviceId = getDeviceId();
      console.log("🔍 Starting login sequence...");

      // Optimization: Try direct document fetch first (faster & bypasses collection list rules)
      console.log(`Trying direct fetch for: teams/${teamName}`);
      const teamDocRef = doc(db, "teams", teamName);
      const directSnap = await getDoc(teamDocRef);

      let matchedTeamDoc: any = null;
      let actualTeamName = "";

      if (directSnap.exists()) {
        console.log("✅ Direct match found by ID!");
        const data = directSnap.data();
        const rawPassword = data.password || data.Password || data.pass || data.leaderName || "";

        const normalize = (str: any) => str ? str.toString().trim().toLowerCase().replace(/\s+/g, "") : "";
        if (normalize(rawPassword) === normalize(password)) {
          matchedTeamDoc = directSnap;
          actualTeamName = data.teamName || directSnap.id;
        } else {
          console.log("❌ Password mismatch on direct document fetch.");
          alert("❌ Invalid password for this team!");
          setIsLoggingIn(false);
          return;
        }
      }

      // If direct fetch fails (maybe name casing is different in DB), fallback to collection scan
      if (!matchedTeamDoc) {
        console.log("⚠️ Direct match failed, scanning collection as fallback...");
        const allTeamsSnapshot = await getDocs(collection(db, "teams"));

        if (allTeamsSnapshot.empty) {
          console.warn("⚠️ No teams found in 'teams' collection.");
        }

        allTeamsSnapshot.forEach(doc => {
          const data = doc.data();
          const rawTeamName = data.teamName || data.TeamName || data.Team || data.name || doc.id || "";
          const rawPassword = data.password || data.Password || data.pass || data.leaderName || "";

          const normalize = (str: any) => str ? str.toString().trim().toLowerCase().replace(/\s+/g, "") : "";

          if (normalize(rawTeamName) === normalize(teamName) && normalize(rawPassword) === normalize(password)) {
            matchedTeamDoc = doc;
            actualTeamName = rawTeamName;
          }
        });
      }

      if (!matchedTeamDoc) {
        console.log("❌ No matching team found in database.");
        alert(`❌ Login Failed!\n\n1. Check if Team "${teamName}" exists in your Firebase 'teams' collection.\n2. Ensure the password matches exactly.\n3. Verify your Project ID is "${firebaseConfig.projectId}" (it must match where you added the teams).`);
        setIsLoggingIn(false);
        return;
      }

      // Get team data
      const teamData = matchedTeamDoc.data();
      console.log("✅ Team found:", teamData);

      // Now use actualTeamName instead of user's raw input
      const activeQuery = query(collection(db, "activeSessions"), where("teamName", "==", actualTeamName));
      const activeSnapshot = await getDocs(activeQuery);

      if (!activeSnapshot.empty) {
        const existingSession = activeSnapshot.docs[0].data();
        if (existingSession.active === true && existingSession.deviceId !== deviceId) {
          alert(`⚠️ Team "${teamName}" is already playing on another device!`);
          setIsLoggingIn(false);
          return;
        }
      }

      // Get existing progress if session already exists
      let currentScore = teamData.score || 0;
      let currentRound = 1;
      let currentQIdx = 0;
      let currentAnswered: number[] = [];

      if (!activeSnapshot.empty) {
        const sessionData = activeSnapshot.docs[0].data();
        currentScore = sessionData.score ?? currentScore;
        currentRound = sessionData.round ?? 1;
        currentQIdx = sessionData.currentQIndex ?? 0;
        currentAnswered = sessionData.answeredInR1 ?? [];
      }

      // Save active session
      await setDoc(doc(db, "activeSessions", actualTeamName), {
        teamName: actualTeamName,
        deviceId,
        password: password,
        loginTime: new Date(),
        score: currentScore,
        round: currentRound,
        currentQIndex: currentQIdx,
        answeredInR1: currentAnswered,
        tabSwitches: 0,
        active: true
      }, { merge: true });

      // Update team's last active status
      await setDoc(doc(db, "teams", matchedTeamDoc.id), {
        lastActive: new Date(),
        deviceId,
        isActive: true
      }, { merge: true });

      // Save to localStorage
      localStorage.setItem("eventTeamName", actualTeamName);
      localStorage.setItem("eventTeamScore", currentScore.toString());
      localStorage.setItem("eventDeviceId", deviceId);
      localStorage.setItem("eventRound", currentRound.toString());
      localStorage.setItem("eventQIndex", currentQIdx.toString());
      localStorage.setItem("eventAnsweredR1", JSON.stringify(currentAnswered));
      localStorage.setItem("eventFinished", isFinished.toString());

      setTeamName(actualTeamName);
      setScore(currentScore);
      setRound(currentRound);
      setCurrentQIndex(currentQIdx);
      setAnsweredInR1(new Set(currentAnswered));
      setView("game");
      if (currentQIdx === 0) setShowRoundIntro(true);
      console.log("✅ Login successful! Navigating to game...");

    } catch (error: any) {
      console.error("❌ Login error:", error);
      if (error.code === 'permission-denied' || (error.message && error.message.includes("permission"))) {
        alert("🚨 FIREBASE SETUP REQUIRED 🚨\n\nYour Firebase Firestore rules are blocking writes! Please go to:\nFirebase Console -> Firestore Database -> Rules\nAnd change 'allow read, write: if false;' to:\n\nallow read, write: if true;");
      } else {
        alert("Login failed: " + (error.message || "Please check your connection"));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogin = () => {
    if (inputAdminPass === ADMIN_PASSWORD) {
      setView("admin-dashboard");
    } else {
      alert("Wrong Admin Password");
    }
  };

  const syncProgress = async (updates: { score?: number, round?: number, qIndex?: number, answered?: number[], isFinished?: boolean, isRound1Completed?: boolean }, targetTeam?: string) => {
    const name = targetTeam || teamName || localStorage.getItem("eventTeamName");
    if (!name) return;

    const data: any = {};
    if (updates.score !== undefined) data.score = updates.score;
    if (updates.round !== undefined) data.round = updates.round;
    if (updates.qIndex !== undefined) data.currentQIndex = updates.qIndex;
    if (updates.answered !== undefined) data.answeredInR1 = updates.answered;
    if (updates.isFinished !== undefined) data.isFinished = updates.isFinished;
    if (updates.isRound1Completed !== undefined) data.isRound1Completed = updates.isRound1Completed;

    try {
      await setDoc(doc(db, "activeSessions", name), data, { merge: true });
      if (updates.score !== undefined) {
        await setDoc(doc(db, "teams", name), { score: updates.score }, { merge: true });
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const updateScore = async (newVal: number) => {
    setScore(newVal);
    localStorage.setItem("eventTeamScore", newVal.toString());
    await syncProgress({ score: newVal });
  };

  const handleLogout = async () => {
    if (teamName) {
      try {
        await setDoc(doc(db, "activeSessions", teamName), {
          active: false,
          logoutTime: new Date()
        }, { merge: true });

        await setDoc(doc(db, "teams", teamName), {
          isActive: false
        }, { merge: true });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("eventTeamName");
    localStorage.removeItem("eventTeamScore");
    localStorage.removeItem("eventDeviceId");
    localStorage.removeItem("eventRound");
    localStorage.removeItem("eventQIndex");
    localStorage.removeItem("eventAnsweredR1");
    localStorage.removeItem("eventFinished");
    localStorage.removeItem("eventQTimeLeft");
    localStorage.removeItem("eventQTimerActive");
    localStorage.removeItem("eventRound1Completed");

    setView("role-selection");
    setTeamName("");
    setPassword("");
    setScore(0);
    setRound(1);
    setCurrentQIndex(0);
    setCode("# Write your Python code here...\n");
    setOutput("");
    setIsSolved(false);
    setAnsweredInR1(new Set());
    setIsFinished(false);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      if (!(window as any).Sk) {
        const load = (src: string) => new Promise(res => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = res;
          document.head.appendChild(s);
        });
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js");
        await load("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js");
      }

      const Sk = (window as any).Sk;
      let out = "";
      Sk.configure({
        output: (t: string) => out += t,
        read: (x: string) => Sk.builtinFiles["files"][x]
      });

      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));

      const clean = out.trim();
      // Use refs to get fresh values — avoids stale closure bug
      const q = questions[currentQIndexRef.current];
      const alreadySolved = isSolvedRef.current;
      const currentScore = scoreRef.current;
      console.log("Output:", JSON.stringify(clean), "Expected:", JSON.stringify(q.expectedOutput));
      if (clean === q.expectedOutput) {
        if (!alreadySolved) {
          updateScore(currentScore + 1);
          setIsSolved(true);
        }
        setOutput(out + "\n✅ CORRECT!");
      } else {
        setOutput(out + "\n❌ INCORRECT.\nYour output: " + JSON.stringify(clean) + "\nExpected: " + JSON.stringify(q.expectedOutput));
      }
    } catch (e: any) {
      setOutput(e.toString());
    }

    setIsRunning(false);
  };

  const seedTeams = async () => {
    if (!confirm("⚠️ This will populate the 'teams' collection with 40+ teams. Continue?")) return;
    
    setIsLoggingIn(true);
    let count = 0;
    try {
      const teamsToSeed = [
        { TeamName: "Team Alpha", password: "pass123" },
        { TeamName: "Team Beta", password: "pass123" },
        { TeamName: "Team Gamma", password: "pass123" },
        { TeamName: "Fafda Fighters", password: "fafda123" },
        { TeamName: "Codez", password: "codez123" },
        { TeamName: "POWERPUFFGIRLS", password: "powerpuff123" },
        { TeamName: "Razz", password: "razz123" },
        { TeamName: "Racoon City", password: "racoon123" },
        { TeamName: "Alpha Koders", password: "alpha123" },
        { TeamName: "Tech Titans", password: "titans123" },
        { TeamName: "Gang coders", password: "gang123" },
        { TeamName: "LNC", password: "lnc123" },
        { TeamName: "N0VA", password: "nova123" },
        { TeamName: "LUMINA", password: "lumina123" },
        { TeamName: "Penguins", password: "penguins123" },
        { TeamName: "Compact", password: "compact123" },
        { TeamName: "Syntax Squad", password: "syntax123" },
        { TeamName: "Techies", password: "techies123" },
        { TeamName: "Byte", password: "byte123" },
        { TeamName: "Dream", password: "dream123" },
        { TeamName: "Final Commit", password: "commit123" },
        { TeamName: "BRAIN NOT FOUND", password: "brain123" },
        { TeamName: "DietCoke", password: "diet123" },
        { TeamName: "Urban Graphics", password: "urban123" },
        { TeamName: "EDITH", password: "edith123" },
        { TeamName: "MOHAMED BADRELDIN", password: "mohamed123" },
        { TeamName: "Matrix", password: "matrix123" },
        { TeamName: "ABC", password: "abc123" },
        { TeamName: "Tech X", password: "techx123" },
        { TeamName: "Priyansh", password: "priyansh123" },
        { TeamName: "The Satyaarth", password: "satyaarth123" },
        { TeamName: "HOUSE STARK", password: "stark123" },
        { TeamName: "HOUSE TARGARYEN", password: "targaryen123" },
        { TeamName: "Coding Cartel", password: "cartel123" },
        { TeamName: "Vamos", password: "vamos123" },
        { TeamName: "Machhapuchhre", password: "machha123" },
        { TeamName: "Khukuri", password: "khukuri123" },
        { TeamName: "X Coders", password: "xcoders123" },
        { TeamName: "Tricoders", password: "tricoders123" },
        { TeamName: "Phub", password: "phub123" },
        { TeamName: "POOKIE JANTA PARTY (PJP)", password: "pjp123" },
        { TeamName: "STRONGLY DEPENDENT PEOPLE", password: "sdp123" },
        { TeamName: "Atlas", password: "atlas123" },
        { TeamName: "three musketeers", password: "musk123" }
      ];

      for (const team of teamsToSeed) {
        await setDoc(doc(db, "teams", team.TeamName), {
          TeamName: team.TeamName,
          password: team.password,
          registered: true,
          score: 0
        });
        count++;
        console.log(`✅ Seeded ${count}/${teamsToSeed.length}: ${team.TeamName}`);
      }
      
      alert(`🎉 SUCCESS! ${count} teams seeded successfully to Firestore.`);
    } catch (error: any) {
      console.error("Seed error:", error);
      alert(`❌ ERROR: ${error.message}\n\nMake sure your Firestore Rules are set to: allow read, write: if true;`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Add debug function to check teams
  const debugTeams = async () => {
    try {
      const snapshot = await getDocs(collection(db, "teams"));
      console.log("Total teams:", snapshot.size);
      snapshot.forEach(doc => {
        console.log("Team:", doc.id, "=>", doc.data());
      });
      alert(`Found ${snapshot.size} teams. Check console for details.`);
    } catch (error) {
      console.error("Debug error:", error);
    }
  };

  // Add this debug function
  const debugLogin = async () => {
    try {
      console.log("🔍 DEBUG MODE");
      console.log("Current input - Team:", teamName, "Leader:", password);

      // 1. Check all teams first
      const allTeams = await getDocs(collection(db, "teams"));
      console.log("📊 ALL TEAMS IN DATABASE:", allTeams.size);

      if (allTeams.empty) {
        alert("❌ NO TEAMS FOUND in 'teams' collection!");
        return;
      }

      let teamList = "Teams in database:\n";
      allTeams.forEach(doc => {
        console.log("Document ID:", doc.id);
        console.log("Document data:", doc.data());
        teamList += `- ${doc.data().teamName} (Leader: ${doc.data().leaderName})\n`;
      });

      // 2. Try to find matching team manually (like we do in login)
      let foundMatch = null;
      let actualTeamName = "";

      allTeams.forEach(doc => {
        const data = doc.data();
        const rawTeamName = data.teamName || data.TeamName || data["Team name"] || doc.id || "";
        const rawLeaderName = data.leaderName || data.LeaderName || data["Leader Name"] || "";

        const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");

        if (normalize(rawTeamName) === normalize(teamName) && normalize(rawLeaderName) === normalize(password)) {
          foundMatch = data;
          actualTeamName = rawTeamName;
        }
      });

      if (!foundMatch) {
        alert(`❌ No match found for Team: "${teamName}" with Leader: "${password}"\n\nCheck console for all teams.`);
      } else {
        alert(`✅ Match found! Team data: ${JSON.stringify(foundMatch)}`);
      }

      // 3. Show all teams in alert
      alert(teamList);

    } catch (error: any) {
      console.error("Debug error:", error);
      alert("Error: " + error.message);
    }
  };

  const resetAllPoints = async () => {
    if (!confirm("⚠️ ARE YOU SURE? This will reset ALL points for ALL teams to 0!")) return;

    try {
      // 1. Reset 'teams' collection
      const teamsSnap = await getDocs(collection(db, "teams"));
      const teamPromises = teamsSnap.docs.map(teamDoc =>
        setDoc(doc(db, "teams", teamDoc.id), { score: 0 }, { merge: true })
      );

      // 2. Reset 'activeSessions' collection (score AND progress)
      const sessionsSnap = await getDocs(collection(db, "activeSessions"));
      const sessionPromises = sessionsSnap.docs.map(sessionDoc =>
        setDoc(doc(db, "activeSessions", sessionDoc.id), {
          score: 0,
          round: 1,
          currentQIndex: 0,
          answeredInR1: [],
          isFinished: false,
          isRound1Completed: false,
          tabSwitches: 0
        }, { merge: true })
      );

      const metadataUpdate = setDoc(doc(db, "eventSettings", "metadata"), {
        round1Enabled: false,
        globalTimerActive: false,
        globalTimeLeft: 300,
        timerEndTime: null
      }, { merge: true });

      await Promise.all([...teamPromises, ...sessionPromises, metadataUpdate]);

      alert("✅ All points and progress have been reset!");
      // Reset local state if applicable
      localStorage.setItem("eventTeamScore", "0");
      localStorage.setItem("eventRound", "1");
      localStorage.setItem("eventQIndex", "0");
      localStorage.setItem("eventAnsweredR1", "[]");
      localStorage.setItem("eventFinished", "false");

      setScore(0);
      setRound(1);
      setCurrentQIndex(0);
      setAnsweredInR1(new Set());
      setIsFinished(false);
      setIsRound1Completed(false);
      localStorage.removeItem("eventRound1Completed");
    } catch (error: any) {
      console.error("Reset error:", error);
      alert("Failed to reset: " + error.message);
    }
  };

  const setRound1Status = async (status: boolean) => {
    try {
      if (status) {
        let currentTimer = globalTimeLeft;
        if (currentTimer <= 0) currentTimer = 300;

        await setDoc(doc(db, "eventSettings", "metadata"), {
          round1Enabled: true,
          globalTimerActive: true,
          timerEndTime: Date.now() + (currentTimer * 1000)
        }, { merge: true });
      } else {
        await setDoc(doc(db, "eventSettings", "metadata"), {
          round1Enabled: false,
          globalTimerActive: false,
          globalTimeLeft: globalTimeLeft, // Store current countdown state
          timerEndTime: null
        }, { merge: true });
      }
      alert(`Round 1 status updated to: ${status ? "STARTED" : "STOPPED"}`);
    } catch (error: any) {
      alert("Error updating round status: " + error.message);
    }
  };

  const setRound2Status = async (status: boolean) => {
    try {
      await setDoc(doc(db, "eventSettings", "metadata"), {
        round2Enabled: status
      }, { merge: true });
      alert(`Round 2 status updated to: ${status ? "STARTED" : "STOPPED"}`);
    } catch (error: any) {
      alert("Error updating round 2 status: " + error.message);
    }
  };

  const adjustGlobalTimer = async (seconds: number) => {
    try {
      const newTime = Math.max(0, globalTimeLeft + seconds);
      const updateData: any = { globalTimeLeft: newTime };
      if (globalTimerActive && timerEndTime) {
        updateData.timerEndTime = timerEndTime + (seconds * 1000);
      }
      await setDoc(doc(db, "eventSettings", "metadata"), updateData, { merge: true });
    } catch (error: any) {
      console.error("Timer adjustment error:", error);
    }
  };

  const toggleGlobalTimer = async () => {
    try {
      if (globalTimerActive) {
        // Pause
        await setDoc(doc(db, "eventSettings", "metadata"), {
          globalTimerActive: false,
          globalTimeLeft: globalTimeLeft,
          timerEndTime: null
        }, { merge: true });
      } else {
        // Resume
        await setDoc(doc(db, "eventSettings", "metadata"), {
          globalTimeLeft: globalTimeLeft,
          globalTimerActive: true,
          timerEndTime: Date.now() + (globalTimeLeft * 1000)
        }, { merge: true });
      }
    } catch (error: any) {
      console.error("Timer toggle error:", error);
    }
  };

  const forceLogout = async (teamId: string) => {
    if (!confirm(`Force logout for "${teamId}"?`)) return;
    try {
      await setDoc(doc(db, "activeSessions", teamId), { active: false }, { merge: true });
      await setDoc(doc(db, "teams", teamId), { isActive: false }, { merge: true });
      alert(`✅ Team "${teamId}" has been forcefully logged out.`);
    } catch (error: any) {
      console.error("Force logout error:", error);
      alert("Error: " + error.message);
    }
  };

  // Admin Dashboard
  if (view === "admin-dashboard") {
    return (
      <AdminDashboard
        leaderboard={leaderboard}
        totalTeams={totalTeams}
        round1Enabled={round1Enabled}
        round2Enabled={round2Enabled}
        globalTimeLeft={globalTimeLeft}
        globalTimerActive={globalTimerActive}
        resetAllPoints={resetAllPoints}
        setRound1Status={setRound1Status}
        setRound2Status={setRound2Status}
        adjustGlobalTimer={adjustGlobalTimer}
        toggleGlobalTimer={toggleGlobalTimer}
        forceLogout={forceLogout}
        setView={setView}
      />
    );
  }

  if (view === "role-selection" || view === "student-login" || view === "admin-login") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden">
        {/* Subtle Overlays */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 w-full max-w-5xl text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-10 p-5 glass rounded-[2.5rem] border border-white/10"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-blue-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Award className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-8xl md:text-9xl font-black mb-6 tracking-tight leading-none text-gradient text-glow italic">
            HACKandCRACK
          </h1>
          <p className="text-emerald-300 font-bold tracking-[0.8em] uppercase text-xs mb-16 opacity-60">
            Grand Challenge_2026
          </p>

          <AnimatePresence mode="wait">
            {view === "role-selection" && (
              <RoleSelection setView={setView} seedTeams={seedTeams} />
            )}

            {view === "student-login" && (
              <ParticipantLogin
                teamName={teamName}
                setTeamName={setTeamName}
                password={password}
                setPassword={setPassword}
                handleStudentLogin={handleStudentLogin}
                isLoggingIn={isLoggingIn}
                setView={setView}
              />
            )}

            {view === "admin-login" && (
              <AdminLogin
                inputAdminPass={inputAdminPass}
                setInputAdminPass={setInputAdminPass}
                handleAdminLogin={handleAdminLogin}
                setView={setView}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return <VictoryScreen score={score} handleLogout={handleLogout} />;
  }

  if (isRound1Completed) {
    return (
      <Phase1Complete
        score={score}
        round2Enabled={round2Enabled}
        onProceed={() => {
          setRound(2);
          setCurrentQIndex(0);
          setIsRound1Completed(false);
          setShowRoundIntro(true);
          localStorage.setItem("eventRound", "2");
          localStorage.setItem("eventQIndex", "0");
          syncProgress({ round: 2, qIndex: 0 });
        }}
      />
    );
  }

  if (showRoundIntro) {
    return (
      <RoundIntro
        round={round}
        round1Enabled={round1Enabled}
        onInitialize={() => {
          setIsQuestionTimerActive(true);
          setQuestionTimeLeft(30);
          localStorage.setItem("eventQTimeLeft", "30");
          localStorage.setItem("eventQTimerActive", "true");
        }}
        onDeploy={() => setShowRoundIntro(false)}
      />
    );
  }

  // GAME VIEW
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-fancy bg-slate-950 p-6 md:p-10 flex flex-col items-center relative"
    >
      {round === 1 && !round1Enabled && !isRound1Completed && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-xl bg-slate-950/80 transition-all duration-700">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-20 rounded-[4rem] text-center max-w-2xl border-2 border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.1)]"
          >
            <div className="flex justify-center mb-10">
              <div className="p-8 bg-amber-500/10 rounded-[3rem] border border-amber-500/20">
                <RefreshCcw className="w-20 h-20 text-amber-500 animate-[spin_4s_linear_infinite]" />
              </div>
            </div>
            <h2 className="text-7xl font-black text-amber-500 italic uppercase mb-8 tracking-tighter text-glow">NODE_IDLE</h2>
            <p className="text-2xl text-slate-400 font-medium leading-relaxed italic">
              System access temporarily suspended by the system administrator. <br />
              Security tokens retained. Stand by for resumption.
            </p>
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-7xl">
        <GameHeader
          teamName={teamName}
          password={password}
          round={round}
          globalTimeLeft={globalTimeLeft}
          score={score}
          handleLogout={handleLogout}
        />


        <AnimatePresence mode="wait">
          {round === 1 ? (
            <QuestionArena
              currentQ={currentQ}
              questionTimeLeft={questionTimeLeft}
              answeredInR1={answeredInR1}
              score={score}
              currentQIndex={currentQIndex}
              setScore={setScore}
              setAnsweredInR1={setAnsweredInR1}
              setQuestionTimeLeft={setQuestionTimeLeft}
              setCurrentQIndex={setCurrentQIndex}
              setIsQuestionTimerActive={setIsQuestionTimerActive}
              setIsRound1Completed={setIsRound1Completed}
              syncProgress={syncProgress}
            />
          ) : (
            <CodingArena
              currentQ={currentQ}
              output={output}
              isSolved={isSolved}
              code={code}
              isRunning={isRunning}
              currentQIndex={currentQIndex}
              setCode={setCode}
              runCode={runCode}
              setCurrentQIndex={setCurrentQIndex}
              setIsSolved={setIsSolved}
              setOutput={setOutput}
              setIsFinished={setIsFinished}
              syncProgress={syncProgress}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}