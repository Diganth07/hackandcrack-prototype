"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
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

const questions = [
  {
    "id": 1,
    "title": "Technical Module 1",
    "text": "Within cooperative execution contexts, which statement is inconsistent with process–thread behavior?",
    "options": [
      "Threads within the same process share the same virtual address space.",
      "Context switching between threads of the same process is typically faster than between separate processes.",
      "By default, all processes in a system share the same memory segments.",
      "Threads belonging to one process can communicate directly by reading and writing shared variables."
    ],
    "correctAnswer": "By default, all processes in a system share the same memory segments.",
    "codingPrompt": "Implement a simple class 'Thread' with a 'run' method that prints 'Running'.",
    "expectedOutput": "Running"
  },
  {
    "id": 2,
    "title": "Technical Module 2",
    "text": "In dynamic contiguous storage arrays, which assertion disrupts structural expectations?",
    "options": [
      "They are capable of automatically resizing when capacity is exceeded.",
      "Appending an element to the end of a dynamic array has amortized constant time complexity.",
      "Accessing an element by index in a dynamic array takes constant time.",
      "Inserting an element at the very first position of a dynamic array has constant time complexity."
    ],
    "correctAnswer": "Inserting an element at the very first position of a dynamic array has constant time complexity.",
    "codingPrompt": "Create a list [10, 20, 30], append 40, and print the list.",
    "expectedOutput": "[10, 20, 30, 40]"
  },
  {
    "id": 3,
    "title": "Technical Module 3",
    "text": "Across iterative optimization procedures, which of these claims are incompatible with gradient descent principles?",
    "options": [
      "It is an iterative optimization technique that minimizes a differentiable loss function.",
      "The choice of learning rate influences how quickly the algorithm converges toward a minimum.",
      "Under all conditions, gradient descent is guaranteed to converge to the global minimum of the loss surface.",
      "It updates model parameters by repeatedly subtracting a fraction of the gradient from the current weights."
    ],
    "correctAnswer": "Under all conditions, gradient descent is guaranteed to converge to the global minimum of the loss surface.",
    "codingPrompt": "Write a function 'compute' that returns 5*5 and print the result.",
    "expectedOutput": "25"
  },
  {
    "id": 4,
    "title": "Technical Module 4",
    "text": "Within reliable transport abstractions, which statement diverges from TCP’s fundamental guarantees?",
    "options": [
      "TCP establishes and maintains a connection between endpoints before data transfer",
      "TCP ensures that data segments are delivered in the order they were sent.",
      "TCP guarantees that every transmitted packet will eventually reach the receiver",
      "TCP typically has lower network latency than UDP but higher that HTTP/3."
    ],
    "correctAnswer": "TCP typically has lower network latency than UDP but higher that HTTP/3.",
    "codingPrompt": "Print the first 3 characters of 'HACKATHON'.",
    "expectedOutput": "HAC"
  },
  {
    "id": 5,
    "title": "Technical Module 5",
    "text": "Among transactional reliability principles, which claim is misaligned with ACID conceptual guarantees?",
    "options": [
      "Atomicity ensures that a transaction either completes fully or has no visible effect.",
      "Consistency guarantees that the database transitions from one valid state to another.",
      "Isolation prevents concurrency-induced anomalies such as dirty reads or lost updates.",
      "Durability means that committed data is retained only while kept in volatile memory (RAM)."
    ],
    "correctAnswer": "Durability means that committed data is retained only while kept in volatile memory (RAM).",
    "codingPrompt": "Calculate 2 to the power of 8 using ** operator and print.",
    "expectedOutput": "256"
  },
  {
    "id": 6,
    "title": "Technical Module 6",
    "text": "Within deterministic digest mechanisms, which statement violates properties expected of cryptographic hashes?",
    "options": [
      "Hash functions are designed to be one-way; recovering the input from the output should be computationally infeasible.",
      "A small change in the input usually results in a significantly different output hash.",
      "With sufficient computational power, any hash function can be reversed to recover the original input exactly.",
      "Hashing schemes are commonly used to store password representations in databases."
    ],
    "correctAnswer": "With sufficient computational power, any hash function can be reversed to recover the original input exactly.",
    "codingPrompt": "Create a function that takes 'name' and returns 'Hello ' + name. Call it with 'Admin' and print.",
    "expectedOutput": "Hello Admin"
  },
  {
    "id": 7,
    "title": "Technical Module 7",
    "text": "Across stateless service architectures, which assertion contradicts REST API principles?",
    "options": [
      "RESTful servers do not maintain state describing the client between requests.",
      "HTTP methods such as GET, POST, PUT, and DELETE are commonly used to express operations.",
      "RESTful APIs are required to return responses exclusively in XML format.",
      "REST identifies resources using uniform resource identifiers (URIs)."
    ],
    "correctAnswer": "RESTful APIs are required to return responses exclusively in XML format.",
    "codingPrompt": "Print the sum of [1, 5, 10].",
    "expectedOutput": "16"
  },
  {
    "id": 8,
    "title": "Technical Module 8",
    "text": "Within declarative interface frameworks, which claim conflicts with React's rendering philosophy?",
    "options": [
      "React maintains an in-memory representation of the DOM known as the virtual DOM.",
      "Components in React can preserve and update internal state across re‑renders.",
      "JSX is a syntax extension that transpiles into standard JavaScript code.",
      "React updates directly manipulate the real DOM for every single state change."
    ],
    "correctAnswer": "React updates directly manipulate the real DOM for every single state change.",
    "codingPrompt": "Convert 'hello' to uppercase and print.",
    "expectedOutput": "HELLO"
  },
  {
    "id": 9,
    "title": "Technical Module 9",
    "text": "Across divide-and-conquer sorting frameworks, identify the statement inconsistent with merge sort characteristics.",
    "options": [
      "Its worst-case time complexity is O(nlog n).",
      "It recursively divides the input into smaller subproblems and then merges the results.",
      "Equal elements maintain their relative order across the sorting process.",
      "It rearranges the array in place without requiring any additional memory space."
    ],
    "correctAnswer": "It rearranges the array in place without requiring any additional memory space.",
    "codingPrompt": "Check if 'a' in 'apple' and print 'True' if it is.",
    "expectedOutput": "True"
  },
  {
    "id": 10,
    "title": "Technical Module 10",
    "text": "In layered computational learning systems, which assertion misrepresents neural network capabilities?",
    "options": [
      "Neural networks are composed of layers of interconnected computational units called neurons.",
      "Activation functions introduce non-linear behavior, enabling the model to learn complex patterns.",
      "Backpropagation computes gradients and updates weights in the direction opposite to the gradient.",
      "Neural networks can only be applied to classification tasks and are unsuitable for regression."
    ],
    "correctAnswer": "Neural networks can only be applied to classification tasks and are unsuitable for regression.",
    "codingPrompt": "Print the type of 123.",
    "expectedOutput": "<class 'int'>"
  },
  {
    "id": 11,
    "title": "Technical Module 11",
    "text": "Across memory abstraction techniques, which statement contradicts expected virtual memory behavior?",
    "options": [
      "Virtual memory systems often implement paging to manage memory allocation.",
      "Virtual memory allows programs to use more address space than the available physical RAM.",
      "A page fault occurs when the requested page is not currently resident in main memory.",
      "Virtual memory completely removes the necessity for physical RAM."
    ],
    "correctAnswer": "Virtual memory completely removes the necessity for physical RAM.",
    "codingPrompt": "Implement a simple class 'Thread' with a 'run' method that prints 'Running'.",
    "expectedOutput": "Running"
  },
  {
    "id": 12,
    "title": "Technical Module 12",
    "text": "Within malicious query manipulation scenarios, which claim is inconsistent with SQL injection behavior?",
    "options": [
      "SQL injection attacks manipulate or compromise database-level queries.",
      "SQL injection attacks are relevant only in NoSQL database environments.",
      "Using parameterized queries or prepared statements can prevent typical SQL injection vulnerabilities.",
      "They arise when user-supplied input is directly concatenated into SQL statements without proper validation."
    ],
    "correctAnswer": "SQL injection attacks are relevant only in NoSQL database environments.",
    "codingPrompt": "Create a list [10, 20, 30], append 40, and print the list.",
    "expectedOutput": "[10, 20, 30, 40]"
  },
  {
    "id": 13,
    "title": "Technical Module 13",
    "text": "Across evolving addressing protocols, which statement conflicts with established IP specifications?",
    "options": [
      "IPv4 addresses are represented using 32-bit numeric values.",
      "IPv6 addresses use 128-bit identifiers.",
      "IPv6 addresses are smaller in character length than their IPv4 counterparts in all cases.",
      "IPv6 was introduced primarily to overcome the address space limitations of IPv4."
    ],
    "correctAnswer": "IPv6 addresses are smaller in character length than their IPv4 counterparts in all cases.",
    "codingPrompt": "Write a function 'compute' that returns 5*5 and print the result.",
    "expectedOutput": "25"
  },
  {
    "id": 14,
    "title": "Technical Module 14",
    "text": "Within model generalization discussions, identify the assertion misaligned with overfitting dynamics.",
    "options": [
      "Increasing the amount of training data invariably makes overfitting worse.",
      "Within model generalization discussions, identify the assertion misaligned with overfitting dynamics.",
      "Overfitting leads to poor performance on unseen data or test sets.",
      "Regularization techniques such as L1 or L2 penalties can help mitigate overfitting."
    ],
    "correctAnswer": "Increasing the amount of training data invariably makes overfitting worse.",
    "codingPrompt": "Print the first 3 characters of 'HACKATHON'.",
    "expectedOutput": "HAC"
  },
  {
    "id": 15,
    "title": "Technical Module 15",
    "text": "Across indexing mechanisms improving retrieval efficiency, which claim is illogical?",
    "options": [
      "Indexes can accelerate the execution of certain SELECT queries.",
      "A well-designed index makes full table scans completely unnecessary in all possible queries.",
      "Maintaining indexes consumes additional storage space.",
      "Inserting or updating indexed columns can sometimes slow down write operations."
    ],
    "correctAnswer": "A well-designed index makes full table scans completely unnecessary in all possible queries.",
    "codingPrompt": "Calculate 2 to the power of 8 using ** operator and print.",
    "expectedOutput": "256"
  },
  {
    "id": 16,
    "title": "Technical Module 16",
    "text": "Which of these layout design principles after examination describes Flexbox?",
    "options": [
      "Flexbox is a layout module used for aligning and distributing items within a container.",
      "It primarily arranges elements along a single axis, horizontal or vertical.",
      "Flexbox provides flexible alignment properties for items along the main and cross axes.",
      "Flexbox replaces JavaScript entirely for implementing interactive UI logic."
    ],
    "correctAnswer": "Flexbox replaces JavaScript entirely for implementing interactive UI logic.",
    "codingPrompt": "Create a function that takes 'name' and returns 'Hello ' + name. Call it with 'Admin' and print.",
    "expectedOutput": "Hello Admin"
  },
  {
    "id": 17,
    "title": "Technical Module 17",
    "text": "Regarding asynchronous runtime properties and which answer describes Node.js architecture?",
    "options": [
      "Node.js follows an event‑driven programming model centered around an event loop.",
      "It performs non‑blocking I/O operations to handle many concurrent connections efficiently.",
      "Node.js spawns a dedicated thread for servicing each incoming request",
      "The Node.js runtime is built on top of Google’s V8 JavaScript engine."
    ],
    "correctAnswer": "Node.js spawns a dedicated thread for servicing each incoming request",
    "codingPrompt": "Print the sum of [1, 5, 10].",
    "expectedOutput": "16"
  },
  {
    "id": 18,
    "title": "Technical Module 18",
    "text": "Reviewing encryption system properties and which answer reflects accurate cryptographic classification?",
    "options": [
      "Symmetric encryption relies on a single secret key shared between sender and receiver.",
      "Asymmetric encryption uses a mathematically related public and private key pair.",
      "AES is a widely used symmetric‑key encryption algorithm.",
      "RSA is an example of symmetric encryption."
    ],
    "correctAnswer": "RSA is an example of symmetric encryption.",
    "codingPrompt": "Convert 'hello' to uppercase and print.",
    "expectedOutput": "HELLO"
  },
  {
    "id": 19,
    "title": "Technical Module 19",
    "text": "Analyze associative storage mechanisms and select the correct answer representing hash table behavior.",
    "options": [
      "Hash tables inherently maintain elements in a sorted order.",
      "Performance degrades as the load factor increases beyond a threshold.",
      "Different keys can map to the same bucket, leading to collisions.",
      "Under typical conditions, the average‑case lookup time is constant."
    ],
    "correctAnswer": "Hash tables inherently maintain elements in a sorted order.",
    "codingPrompt": "Check if 'a' in 'apple' and print 'True' if it is.",
    "expectedOutput": "True"
  },
  {
    "id": 20,
    "title": "Technical Module 20",
    "text": "Observing hierarchical decision structures which answer describes decision tree behavior?",
    "options": [
      "Decision trees recursively partition the data using splitting criteria based on features.",
      "Decision trees always produce piecewise‑linear decision boundaries.",
      "They naturally accommodate categorical input variables without requiring explicit conversion.",
      "Deep or unpruned decision trees tend to memorize training patterns and are prone to overfitting."
    ],
    "correctAnswer": "Decision trees always produce piecewise‑linear decision boundaries.",
    "codingPrompt": "Print the type of 123.",
    "expectedOutput": "<class 'int'>"
  },
  {
    "id": 21,
    "title": "Technical Module 21",
    "text": "Within concurrency hazard discussions, determine the claim contradicting classic deadlock conditions.",
    "options": [
      "A deadlock cannot occur unless at least one resource requires mutual exclusion.",
      "The “hold and wait” condition implies that at least one process holds a resource while waiting for another.",
      "Deadlocks are impossible when more than one process is present in the system.",
      "A circular dependency among processes waiting for resources is part of the deadlock condition."
    ],
    "correctAnswer": "Deadlocks are impossible when more than one process is present in the system.",
    "codingPrompt": "Implement a simple class 'Thread' with a 'run' method that prints 'Running'.",
    "expectedOutput": "Running"
  },
  {
    "id": 22,
    "title": "Technical Module 22",
    "text": "Across distributed name resolution mechanisms, which statement is inconsistent with DNS operation?",
    "options": [
      "DNS resolution commonly uses UDP for query/response exchanges.",
      "DNS encrypts and protects all application-layer traffic traversing the internet.",
      "The DNS namespace is organized in a hierarchical distributed tree.",
      "DNS translates symbolic hostnames into numerical IP addresses."
    ],
    "correctAnswer": "DNS encrypts and protects all application-layer traffic traversing the internet.",
    "codingPrompt": "Create a list [10, 20, 30], append 40, and print the list.",
    "expectedOutput": "[10, 20, 30, 40]"
  },
  {
    "id": 23,
    "title": "Technical Module 23",
    "text": "Within schema design refinement techniques, determine which assertion undermines normalization principles.",
    "options": [
      "Normalization helps reduce redundant data duplication across tables.",
      "It contributes to maintaining data integrity and consistency.",
      "It structures relations into logically organized tables with well-defined dependencies.",
      "Normalization always improves the speed of every query executed on the database."
    ],
    "correctAnswer": "Normalization always improves the speed of every query executed on the database.",
    "codingPrompt": "Write a function 'compute' that returns 5*5 and print the result.",
    "expectedOutput": "25"
  },
  {
    "id": 24,
    "title": "Technical Module 24",
    "text": "Across browser-side exploitation vectors, which claim is misaligned with XSS attack behavior?",
    "options": [
      "XSS attacks primarily exploit vulnerabilities in SQL query construction.",
      "Input sanitization and output encoding can help defend against common XSS variants.",
      "These scripts execute in the victim's browser under the context of the vulnerable site.",
      "Cross-site scripting attacks inject malicious scripts into otherwise trusted web pages."
    ],
    "correctAnswer": "XSS attacks primarily exploit vulnerabilities in SQL query construction.",
    "codingPrompt": "Print the first 3 characters of 'HACKATHON'.",
    "expectedOutput": "HAC"
  },
  {
    "id": 25,
    "title": "Technical Module 25",
    "text": "In modular distributed architectures, which statement contradicts microservice design patterns?",
    "options": [
      "Each service usually encapsulates a specific business capability or domain.",
      "All microservices must share a single underlying database instance.",
      "Services typically communicate over network-based APIs.",
      "Individual services can be deployed independently of one another."
    ],
    "correctAnswer": "All microservices must share a single underlying database instance.",
    "codingPrompt": "Calculate 2 to the power of 8 using ** operator and print.",
    "expectedOutput": "256"
  },
  {
    "id": 26,
    "title": "Technical Module 26",
    "text": "Within asynchronous control flow constructs, which claim is inconsistent with JavaScript promise behavior?",
    "options": [
      "Promises can be chained together using methods like .then() and .catch().",
      "Promises exist in three states: pending, fulfilled, and rejected.",
      "A promise executes synchronously immediately upon creation.",
      "A promise represents the eventual outcome of an asynchronous operation."
    ],
    "correctAnswer": "A promise executes synchronously immediately upon creation.",
    "codingPrompt": "Create a function that takes 'name' and returns 'Hello ' + name. Call it with 'Admin' and print.",
    "expectedOutput": "Hello Admin"
  },
  {
    "id": 27,
    "title": "Technical Module 27",
    "text": "Across logarithmic search strategies, determine which statement violates binary search requirements.",
    "options": [
      "The input array must be arranged in sorted order for binary search to function correctly.",
      "In the worst case, binary search runs in logarithmic time relative to the input size.",
      "It repeatedly divides the search interval in half and narrows down the target region.",
      "Binary search works efficiently on arrays that have not been sorted."
    ],
    "correctAnswer": "Binary search works efficiently on arrays that have not been sorted.",
    "codingPrompt": "Print the sum of [1, 5, 10].",
    "expectedOutput": "16"
  },
  {
    "id": 28,
    "title": "Technical Module 28",
    "text": "Within convolution-based pattern recognition systems, which statement is inconsistent with CNN design?",
    "options": [
      "CNNs are designed exclusively for processing text‑based data.",
      "CNNs are particularly effective at detecting spatial patterns such as edges and textures.",
      "They employ convolutional layers that apply filters to local receptive fields.",
      "CNNs are widely used in computer vision and image‑related tasks."
    ],
    "correctAnswer": "CNNs are designed exclusively for processing text‑based data.",
    "codingPrompt": "Convert 'hello' to uppercase and print.",
    "expectedOutput": "HELLO"
  },
  {
    "id": 29,
    "title": "Technical Module 29",
    "text": "Across CPU scheduling policies, which assertion incompatible with standard scheduling behavior?",
    "options": [
      "Shortest job first (SJF) scheduling can minimize the average waiting time when all jobs are known in advance.",
      "First-come, first-served (FCFS) does not preempt a running process unless it voluntarily yields.",
      "Every widely used scheduling algorithm in modern operating systems is inherently preemptive.",
      "In round‑robin scheduling, each process is allocated a fixed time slice called a quantum."
    ],
    "correctAnswer": "Every widely used scheduling algorithm in modern operating systems is inherently preemptive.",
    "codingPrompt": "Check if 'a' in 'apple' and print 'True' if it is.",
    "expectedOutput": "True"
  },
  {
    "id": 30,
    "title": "Technical Module 30",
    "text": "Within network boundary protection mechanisms, identify the statement conflicting with firewall functionality.",
    "options": [
      "Firewalls can filter incoming network packets based on rule sets.",
      "Some firewalls inspect packet headers and payloads to enforce security policies.",
      "Firewalls are primarily responsible for encrypting data stored persistently on disk.",
      "Firewalls are core components of network‑layer security infrastructure."
    ],
    "correctAnswer": "Firewalls are primarily responsible for encrypting data stored persistently on disk.",
    "codingPrompt": "Print the type of 123.",
    "expectedOutput": "<class 'int'>"
  }
];

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

  // Anti-Cheat: Tab Switching Detection
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
        .map(doc => ({ 
          team: doc.id, 
          score: doc.data().score || 0,
          tabSwitches: doc.data().tabSwitches || 0 
        }));
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
        // PROACTIVE FIX: Check if they are using the correct Project ID in the alert too
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
          alert(`⚠️ Team "${actualTeamName}" is already playing on another device!`);
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

  const syncProgress = async (updates: { score?: number, round?: number, qIndex?: number, answered?: number[], isFinished?: boolean, isRound1Completed?: boolean, tabSwitches?: number }, targetTeam?: string) => {
    const name = targetTeam || teamName || localStorage.getItem("eventTeamName");
    if (!name) return;

    const data: any = {};
    if (updates.score !== undefined) data.score = updates.score;
    if (updates.round !== undefined) data.round = updates.round;
    if (updates.qIndex !== undefined) data.currentQIndex = updates.qIndex;
    if (updates.answered !== undefined) data.answeredInR1 = updates.answered;
    if (updates.isFinished !== undefined) data.isFinished = updates.isFinished;
    if (updates.isRound1Completed !== undefined) data.isRound1Completed = updates.isRound1Completed;
    if (updates.tabSwitches !== undefined) data.tabSwitches = updates.tabSwitches;

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
                      <td colSpan={5} className="p-24 text-center text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">
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

  if (view === "role-selection" || view === "student-login" || view === "admin-login") {
    return (
      <div className="min-h-screen bg-fancy relative flex flex-col items-center justify-center p-6 bg-slate-950">
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
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
              >
                <motion.button
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("student-login")}
                  className="glass-card group text-left !p-12 border-white/5 hover:border-emerald-500/20"
                >
                  <div className="p-5 bg-emerald-500/10 rounded-3xl w-fit mb-10 group-hover:bg-emerald-600 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500">
                    <User className="w-10 h-10 text-emerald-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-5xl font-black mb-4 tracking-tight italic text-white group-hover:text-emerald-400 transition-colors">PARTICIPANT</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">Join the global arena, solve complex modules, and ascend the technical leaderboard.</p>
                  <div className="flex items-center gap-3 mt-10 text-emerald-400 font-black uppercase text-sm tracking-[0.2em] group-hover:translate-x-3 transition-transform">
                    ENTER ARENA <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("admin-login")}
                  className="glass-card group text-left !p-12 border-white/5 hover:border-blue-500/20"
                >
                  <div className="p-5 bg-slate-800/50 rounded-3xl w-fit mb-10 group-hover:bg-blue-600 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500">
                    <ShieldCheck className="w-10 h-10 text-slate-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-5xl font-black mb-4 tracking-tight italic opacity-40 group-hover:text-blue-500 group-hover:opacity-100 transition-all">ADMIN</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">Administrative control, real-time node monitoring, and system management.</p>
                  <div className="flex items-center gap-3 mt-10 text-slate-600 font-black uppercase text-sm tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                    DASHBOARD <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>
              </motion.div>
            )}

            {view === "role-selection" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                whileHover={{ opacity: 1 }}
                className="mt-24"
              >
                <button
                  onClick={seedTeams}
                  className="px-6 py-2 border border-white/5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  [ SYSTEM_INITIALIZATION_BYPASS ]
                </button>
              </motion.div>
            )}

            {view === "student-login" && (
              <motion.div
                key="student-login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="glass-card max-w-lg mx-auto !p-16 border-emerald-500/10"
              >
                <div className="text-left mb-12">
                  <h2 className="text-5xl font-black mb-4 tracking-tighter italic text-white">ACCESSING_</h2>
                  <p className="text-slate-400 font-medium text-lg">Initialize your team node to synchronize with the arena.</p>
                </div>

                <div className="space-y-8">
                  <div className="group">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3 ml-2 group-focus-within:text-white transition-colors">Team_Identity</div>
                    <input
                      placeholder="e.g. CyberKnights"
                      value={teamName}
                      className="w-full px-8 py-6 bg-slate-950/50 rounded-[1.5rem] text-2xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white"
                      onChange={e => setTeamName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
                    />
                  </div>
                  <div className="group">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3 ml-2 group-focus-within:text-white transition-colors">Secure_Passkey</div>
                    <input
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      className="w-full px-8 py-6 bg-slate-950/50 rounded-[1.5rem] text-2xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white"
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStudentLogin}
                    disabled={isLoggingIn}
                    className="btn-premium w-full mt-10 !py-8 text-xl shadow-emerald-500/40"
                  >
                    {isLoggingIn ? (
                      <RefreshCcw className="w-8 h-8 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-4">
                        SYNCHRONIZE SESSION
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    )}
                  </motion.button>

                  <button
                    onClick={() => setView("role-selection")}
                    className="w-full text-slate-500 font-black uppercase text-xs tracking-[0.4em] hover:text-white transition-colors pt-8 flex items-center justify-center gap-4 group"
                  >
                    <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
                    DISCONNECT
                    <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-white transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}

            {view === "admin-login" && (
              <motion.div
                key="admin-login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="glass-card max-w-sm mx-auto !p-12 border-blue-500/10"
              >
                <div className="text-left mb-10">
                  <h2 className="text-4xl font-black mb-3 tracking-tighter italic text-white flex items-center gap-4">
                    ADMIN_
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                  </h2>
                  <p className="text-slate-500 font-medium">Verify system authority.</p>
                </div>

                <div className="space-y-6">
                  <input
                    type="password"
                    placeholder="System Passkey"
                    value={inputAdminPass}
                    className="w-full px-6 py-5 bg-slate-950/50 rounded-2xl text-xl border border-white/5 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold text-white"
                    onChange={e => setInputAdminPass(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdminLogin}
                    className="btn-premium w-full !bg-blue-600 shadow-blue-500/30 !py-6 text-lg"
                  >
                    AUTHORIZE
                  </motion.button>

                  <button
                    onClick={() => setView("role-selection")}
                    className="w-full text-slate-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors"
                  >
                    ABORT_
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full scale-150" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-2xl w-full text-center !p-24 border border-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative z-10"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="inline-block mb-12 p-10 glass rounded-[4rem] border border-white/5 relative"
          >
            <Trophy className="w-28 h-28 text-emerald-400 accent-glow shadow-2xl" />
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
          </motion.div>

          <h1 className="text-8xl font-black mb-6 text-gradient italic tracking-tighter uppercase text-glow">VICTORY_</h1>
          <p className="text-3xl text-slate-400 font-bold mb-12 italic leading-tight tracking-tight">
            Node successfully synchronized. <br />Challenge requirements satisfied.
          </p>

          <div className="bg-slate-950/50 p-12 rounded-[2.5rem] border border-white/5 mb-16 shadow-inner">
            <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4 opacity-60">Final_Cumulative_Score</p>
            <div className="text-9xl font-black text-emerald-400 text-glow tracking-tighter">{score}</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn-premium !bg-emerald-600 !px-24 !py-10 text-2xl shadow-emerald-500/40"
          >
            TERMINATE SESSION
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isRound1Completed) {
    return (
      <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-2xl w-full text-center !p-24 border border-emerald-500/10 shadow-2xl"
        >
          <div className="inline-block mb-12 p-10 glass rounded-[4rem] border border-white/5">
            <Award className="w-28 h-28 text-emerald-400 accent-glow shadow-2xl" />
          </div>
          <h1 className="text-7xl font-black mb-8 text-gradient italic tracking-tighter uppercase text-glow">PHASE_01_COMPLETE</h1>
          <p className="text-3xl text-slate-400 font-bold mb-12 italic leading-tight">
            Analytical logic modules finished. <br />Stand by for synthetic phase authorization.
          </p>
          <div className="bg-slate-950/50 p-12 rounded-[2.5rem] border border-white/5 mb-8">
            <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4 opacity-60">Phase_01_Score</p>
            <div className="text-8xl font-black text-emerald-400 text-glow tracking-tighter">{score}</div>
          </div>

          {round2Enabled ? (
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setRound(2);
                setCurrentQIndex(0);
                setIsRound1Completed(false);
                setShowRoundIntro(true);
                localStorage.setItem("eventRound", "2");
                localStorage.setItem("eventQIndex", "0");
                syncProgress({ round: 2, qIndex: 0 });
              }}
              className="btn-premium !bg-indigo-600 !px-24 !py-8 text-2xl shadow-indigo-500/40"
            >
              PROCEED TO PHASE 02
            </motion.button>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/10 p-10 rounded-[2.5rem]">
              <p className="text-amber-500 font-black uppercase text-sm tracking-[0.5em] animate-pulse italic">
                Awaiting Authorization for Phase 02...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (showRoundIntro) {
    const isR1 = round === 1;
    return (
      <div className="min-h-screen bg-fancy flex items-center justify-center p-8 bg-slate-950 text-white relative">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card max-w-4xl w-full text-center !p-24 border border-emerald-500/10 shadow-2xl"
        >
          <div className="flex justify-center mb-12">
            <div className="p-10 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10 relative">
              {isR1 ? <Award className="w-24 h-24 text-emerald-400" /> : <Code2 className="w-24 h-24 text-emerald-400" />}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
          </div>

          <p className="text-emerald-400 font-black tracking-[0.8em] uppercase text-[10px] mb-5 opacity-40">System_Initialization_v1.0.4</p>
          <h1 className="text-9xl font-black mb-10 text-gradient italic tracking-tighter uppercase text-glow">PHASE_0{round}</h1>

          <div className="bg-slate-950/60 p-12 rounded-[3rem] border border-white/5 mb-16 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Terminal className="w-32 h-32" />
            </div>
            <h3 className="text-3xl font-black text-emerald-400 italic mb-6 uppercase tracking-tighter">
              {isR1 ? "01: Analytical Neural Patterns" : "02: Synthetic Logic Deployment"}
            </h3>
            <p className="text-2xl text-slate-400 leading-relaxed font-medium italic">
              {isR1
                ? "In this phase, you must decode complex structural deviations. Latency and accuracy are critical for global synchronization."
                : "Manual implementation required. Deploy high-level Python protocols to solve the objective."}
            </p>
          </div>

          {round1Enabled && isR1 && (
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsQuestionTimerActive(true);
                setQuestionTimeLeft(30);
                localStorage.setItem("eventQTimeLeft", "30");
                localStorage.setItem("eventQTimerActive", "true");
              }}
              className="btn-premium !bg-emerald-600 !px-32 !py-10 text-3xl shadow-emerald-500/40 tracking-tighter italic"
            >
              INITIALIZE_LOGIC
            </motion.button>
          )}

          {!round1Enabled && isR1 && (
            <div className="bg-amber-500/5 border border-amber-500/10 p-10 rounded-[2.5rem] mt-10">
              <p className="text-amber-500 font-black uppercase text-sm tracking-[0.5em] animate-pulse italic">
                Awaiting System Authorization...
              </p>
            </div>
          )}

          {!isR1 && (
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRoundIntro(false)}
              className="btn-premium !bg-emerald-600 !px-32 !py-10 text-3xl shadow-emerald-500/40 tracking-tighter italic"
            >
              DEPLOY_CODE
            </motion.button>
          )}
        </motion.div>
      </div>
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
        <header className="glass rounded-[2rem] p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group border-white/5 shadow-2xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
          <div className="flex-1 flex items-center gap-8">
            <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
              <User className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="text-left">
              <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase">
                {teamName}
                <div className="badge-live !bg-emerald-500/5 !text-emerald-400 !border-emerald-500/20">NODE_ACTIVE</div>
              </h2>
              <p className="text-slate-500 font-black uppercase tracking-[0.6em] mt-2 text-[10px] opacity-60">Session_Lead: {password}</p>
            </div>
          </div>


          <div className="flex-1 flex items-center justify-end gap-12">
            {round === 1 && (
              <div className="flex items-center gap-4 bg-slate-900/60 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                <Timer className="w-5 h-5 text-emerald-400" />
                <span className={`text-2xl font-black italic tabular-nums ${globalTimeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                  {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden md:inline ml-2">Total_Phase_Time</span>
              </div>
            )}

            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-60">Standing_Score</p>
              <div className="text-6xl font-black text-white flex items-center gap-5">
                <span className="text-emerald-400 text-glow">{score}</span>
                <Trophy className="w-8 h-8 text-blue-500 accent-glow shadow-blue-500/20" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-secondary !text-rose-500 !border-rose-500/10 hover:!border-rose-500/50 !px-6 !py-4"
            >
              <LogOut className="w-5 h-5" />
              ABORT
            </motion.button>
          </div>
        </header>


        <AnimatePresence mode="wait">
          {round === 1 ? (
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
                    {/* Subtle spinning accent for the circle */}
                    <div className={`absolute inset-0 border-t-4 border-transparent rounded-full animate-spin transition-colors ${questionTimeLeft <= 3 ? 'border-rose-500/40' : 'border-emerald-500/40'
                      }`} style={{ animationDuration: '2s' }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentQ.options.map((o, i) => (
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
                          const newScore = o === currentQ.correctAnswer ? score + 1 : score;
                          if (o === currentQ.correctAnswer) setScore(newScore);

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
                            localStorage.setItem("eventQTimerActive", "false");
                            setIsRound1Completed(true);
                            localStorage.setItem("eventRound1Completed", "true");
                            syncProgress({ score: newScore, answered: answeredArr });
                          }
                        } else {
                          const nextIndex = currentQIndex + 1;
                          if (nextIndex < 30) {
                            setCurrentQIndex(nextIndex);
                            localStorage.setItem("eventQIndex", nextIndex.toString());
                            syncProgress({ qIndex: nextIndex });
                          } else {
                            setIsQuestionTimerActive(false);
                            localStorage.setItem("eventQTimerActive", "false");
                            setIsRound1Completed(true);
                            localStorage.setItem("eventRound1Completed", "true");
                          }
                        }
                      }}
                      className="glass !bg-white/[0.01] p-10 rounded-[2.5rem] text-2xl font-black hover:!bg-emerald-600/10 hover:border-emerald-500/40 transition-all border border-white/5 group relative overflow-hidden text-center italic"
                    >
                      <div className="absolute top-6 left-10 text-[9px] font-black text-slate-800 group-hover:text-emerald-400/60 transition-colors uppercase tracking-[0.5em]">
                        Choice_0{i + 1}
                      </div>
                      <span className="relative z-10 text-white group-hover:text-glow transition-all tracking-tight">{o}</span>
                      <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
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
                  <h3 className="text-5xl font-black text-white mb-10 italic text-left tracking-tighter text-glow underline decoration-blue-500/30 decoration-4 underline-offset-8">{currentQ.title}</h3>
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
                  <div className="pt-20 h-full relative z-10 bg-slate-950/40">
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
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}