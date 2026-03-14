"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
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
  Users
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
const ADMIN_PASSWORD = "admin";

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
  const [leaderName, setLeaderName] = useState(""); // This acts as password
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

  // Refs to avoid stale closures inside async runCode
  const currentQIndexRef = useRef(currentQIndex);
  const isSolvedRef = useRef(isSolved);
  const scoreRef = useRef(score);
  const teamNameRef = useRef(teamName);

  useEffect(() => { currentQIndexRef.current = currentQIndex; }, [currentQIndex]);
  useEffect(() => { isSolvedRef.current = isSolved; }, [isSolved]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { teamNameRef.current = teamName; }, [teamName]);

  const currentQ = questions[currentQIndex];

  // Restore round progress from localStorage on session load
  useEffect(() => {
    const checkSession = async () => {
      const savedTeam = localStorage.getItem("eventTeamName");
      const savedScore = localStorage.getItem("eventTeamScore");
      const savedDeviceId = localStorage.getItem("eventDeviceId");

      if (savedTeam && savedDeviceId) {
        try {
          const sessionDoc = await getDocs(query(collection(db, "activeSessions"), where("teamName", "==", savedTeam)));
          if (!sessionDoc.empty) {
            const session = sessionDoc.docs[0].data();
            if (session.deviceId === savedDeviceId && session.active === true) {
              setTeamName(savedTeam);
              // Restore score from Firebase (authoritative)
              setScore(session.score || parseInt(savedScore || "0"));
              // Restore round progress from Firebase (authoritative)
              const fbRound = session.round || 1;
              const fbQIndex = session.currentQIndex || 0;
              const fbAnswered = session.answeredInR1 || [];
              setRound(fbRound);
              setCurrentQIndex(fbQIndex);
              setAnsweredInR1(new Set(fbAnswered));
              setIsFinished(session.isFinished || localStorage.getItem("eventFinished") === "true");
              // Sync localStorage too
              localStorage.setItem("eventRound", fbRound.toString());
              localStorage.setItem("eventQIndex", fbQIndex.toString());
              localStorage.setItem("eventAnsweredR1", JSON.stringify(fbAnswered));
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

    console.log("Login attempted:", { teamName, leaderName, inputVenueCode });

    // Validation
    if (!teamName.trim()) {
      alert("❌ Please enter team name!");
      return;
    }

    if (!leaderName.trim()) {
      alert("❌ Please enter team leader name!");
      return;
    }

    setIsLoggingIn(true);

    try {
      const deviceId = getDeviceId();

      // Check if team exists in Firebase with correct leader name (CASE INSENSITIVE)
      console.log("🔍 Checking team credentials...");

      const allTeamsSnapshot = await getDocs(collection(db, "teams"));
      let matchedTeamDoc: any = null;
      let actualTeamName = "";

      allTeamsSnapshot.forEach(doc => {
        const data = doc.data();

        // Handle variations in field names exactly as they are in your Firebase
        const rawTeamName = data.teamName || data.TeamName || data["Team name"] || doc.id || "";
        const rawLeaderName = data.leaderName || data.LeaderName || data["Leader Name"] || "";

        // Normalize strings by removing all spaces and making lowercase
        const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");

        const dbTeam = normalize(rawTeamName);
        const dbLeader = normalize(rawLeaderName);
        const inputTeam = normalize(teamName);
        const inputLeader = normalize(leaderName);

        if (dbTeam && dbLeader && dbTeam === inputTeam && dbLeader === inputLeader) {
          matchedTeamDoc = doc;
          actualTeamName = rawTeamName; // Use the exact casing stored in DB
        }
      });

      if (!matchedTeamDoc) {
        console.log("❌ No matching team found");
        alert("❌ Invalid team name or leader name!");
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
        leaderName: leaderName,
        loginTime: new Date(),
        score: currentScore,
        round: currentRound,
        currentQIndex: currentQIdx,
        answeredInR1: currentAnswered,
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

  const syncProgress = async (updates: { score?: number, round?: number, qIndex?: number, answered?: number[], isFinished?: boolean }, targetTeam?: string) => {
    const name = targetTeam || teamName || localStorage.getItem("eventTeamName");
    if (!name) return;

    const data: any = {};
    if (updates.score !== undefined) data.score = updates.score;
    if (updates.round !== undefined) data.round = updates.round;
    if (updates.qIndex !== undefined) data.currentQIndex = updates.qIndex;
    if (updates.answered !== undefined) data.answeredInR1 = updates.answered;
    if (updates.isFinished !== undefined) data.isFinished = updates.isFinished;

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

    setView("role-selection");
    setTeamName("");
    setLeaderName("");
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
      console.log("Current input - Team:", teamName, "Leader:", leaderName);

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

        if (normalize(rawTeamName) === normalize(teamName) && normalize(rawLeaderName) === normalize(leaderName)) {
          foundMatch = data;
          actualTeamName = rawTeamName;
        }
      });

      if (!foundMatch) {
        alert(`❌ No match found for Team: "${teamName}" with Leader: "${leaderName}"\n\nCheck console for all teams.`);
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
          isFinished: false
        }, { merge: true })
      );

      await Promise.all([...teamPromises, ...sessionPromises]);
      
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
    } catch (error: any) {
      console.error("Reset error:", error);
      alert("Failed to reset: " + error.message);
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
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-7xl font-black italic uppercase text-gradient text-glow mb-2"
              >
                Dashboard
              </motion.h1>
              <p className="text-slate-500 font-bold tracking-[0.6em] uppercase text-[10px] opacity-70">Event Control & Analytics</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetAllPoints}
                className="btn-premium !bg-rose-600 !shadow-rose-600/20"
              >
                <RefreshCcw className="w-5 h-5" />
                Reset Sessions
              </motion.button>
              
              <button 
                onClick={() => setView("role-selection")} 
                className="btn-secondary"
              >
                <LogOut className="w-5 h-5" />
                Leave
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
            className="glass rounded-[3rem] overflow-hidden"
          >
            <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h2 className="text-3xl font-black italic tracking-tight text-white/90">
                LIVE STANDINGS_
              </h2>
              <div className="badge-live">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Real-Time Data
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 text-xs font-black uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">Rank</th>
                    <th className="p-10">Team Identity</th>
                    <th className="p-10 text-center">Score</th>
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
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-white font-black italic text-3xl shadow-lg shadow-indigo-500/5">
                            {i + 1}
                          </div>
                        </td>
                        <td className="p-10">
                          <div className="font-black text-white text-2xl group-hover:text-indigo-400 transition-colors italic tracking-tight uppercase">{team.team}</div>
                        </td>
                        <td className="p-10">
                          <div className="flex justify-center">
                            <span className="bg-white/5 px-8 py-3 rounded-2xl font-black text-2xl border border-white/5 group-hover:border-indigo-500/30 transition-all">
                              {team.score}
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

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
            <div className="bg-gradient-to-br from-indigo-500 to-rose-500 p-4 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Award className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-8xl md:text-9xl font-black mb-6 tracking-tight leading-none text-gradient text-glow italic">
            HACKandCRACK
          </h1>
          <p className="text-indigo-300 font-bold tracking-[0.8em] uppercase text-xs mb-16 opacity-60">
            Grand Challenge_2026
          </p>

          <AnimatePresence mode="wait">
            {view === "role-selection" && (
              <motion.div 
                key="roles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("student-login")} 
                  className="glass-card group text-left"
                >
                  <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit mb-8 group-hover:bg-indigo-500 transition-all duration-500">
                    <User className="w-8 h-8 text-indigo-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-4xl font-black mb-3 tracking-tight italic">Participant</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Begin your journey, solve technical challenges, and climb the ranks.</p>
                  <div className="flex items-center gap-2 mt-8 text-indigo-400 font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                    Enter Arena <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("admin-login")} 
                  className="glass-card group text-left border-white/5 hover:border-white/10"
                >
                  <div className="p-4 bg-slate-800 rounded-2xl w-fit mb-8">
                    <ShieldCheck className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-4xl font-black mb-3 opacity-60 tracking-tight italic">Dashboard</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">System administration and real-time event analytics.</p>
                  <div className="flex items-center gap-2 mt-8 text-slate-600 font-black uppercase text-xs tracking-widest">
                    Manage <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              </motion.div>
            )}

            {view === "student-login" && (
              <motion.div 
                key="student-login"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="glass-card max-w-md mx-auto"
              >
                <h2 className="text-4xl font-black mb-3 text-left tracking-tight italic">Welcome_</h2>
                <p className="text-slate-400 text-left mb-10 font-medium">Please enter your team credentials to continue.</p>
                
                <div className="space-y-5">
                  <div className="relative">
                    <input
                      placeholder="Team Name"
                      value={teamName}
                      className="w-full px-6 py-5 bg-white/[0.03] rounded-2xl text-xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                      onChange={e => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      placeholder="Leader Name"
                      type="password"
                      value={leaderName}
                      className="w-full px-6 py-5 bg-white/[0.03] rounded-2xl text-xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                      onChange={e => setLeaderName(e.target.value)}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStudentLogin}
                    disabled={isLoggingIn}
                    className="btn-premium w-full mt-6 !py-6 disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <RefreshCcw className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        START CHALLENGE
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                  
                  <button 
                    onClick={() => setView("role-selection")} 
                    className="w-full text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors py-4"
                  >
                    ← Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {view === "admin-login" && (
              <motion.div 
                key="admin-login"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="glass-card max-w-sm mx-auto"
              >
                <h2 className="text-4xl font-black mb-8 text-left italic">Auth_</h2>
                
                <div className="space-y-6">
                  <input
                    type="password"
                    placeholder="Admin Password"
                    value={inputAdminPass}
                    className="w-full px-6 py-5 bg-white/[0.03] rounded-2xl text-xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                    onChange={e => setInputAdminPass(e.target.value)}
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdminLogin}
                    className="btn-premium w-full !bg-slate-100 !text-slate-900 shadow-white/10"
                  >
                    UNLOCK DASHBOARD
                  </motion.button>
                  
                  <button 
                    onClick={() => setView("role-selection")} 
                    className="w-full text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors"
                  >
                    ← Back
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
      <div className="min-h-screen bg-fancy flex items-center justify-center p-6 bg-slate-950 text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-2xl w-full text-center !p-20 border border-white/10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block mb-10 p-8 glass rounded-[3rem] border border-white/5"
          >
            <Trophy className="w-24 h-24 text-yellow-500 accent-glow shadow-2xl" />
          </motion.div>
          
          <h1 className="text-7xl font-black mb-6 text-gradient italic tracking-tight">CONGRATULATIONS!</h1>
          <p className="text-3xl text-slate-300 font-bold mb-10 italic leading-tight">
            You have successfully completed all challenges.
          </p>
          
          <div className="bg-white/[0.03] p-10 rounded-3xl border border-white/5 mb-12">
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Final Standing Score</p>
            <div className="text-8xl font-black text-indigo-400 text-glow">{score}</div>
          </div>

          <p className="text-slate-400 font-medium mb-12 leading-relaxed">
            Your results have been synchronized with the main server. <br/>
            Thank you for participating in HACKandCRACK 2026.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn-premium !bg-white !text-slate-900 !px-20 text-lg shadow-white/10"
          >
            QUIT SESSION
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (showRoundIntro) {
    const isR1 = round === 1;
    return (
      <div className="min-h-screen bg-fancy flex items-center justify-center p-6 bg-slate-950 text-white">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card max-w-3xl w-full text-center !p-20 border border-indigo-500/10"
        >
          <div className="flex justify-center mb-10">
            <div className="p-8 bg-indigo-500/10 rounded-[3rem] border border-indigo-500/20 relative">
              {isR1 ? <Award className="w-20 h-20 text-indigo-400" /> : <Code2 className="w-20 h-20 text-indigo-400" />}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full animate-ping" />
            </div>
          </div>
          
          <p className="text-slate-500 font-black tracking-[0.6em] uppercase text-xs mb-4">Module Preparation</p>
          <h1 className="text-8xl font-black mb-8 text-gradient italic tracking-tighter">ROUND 0{round}</h1>
          
          <div className="bg-white/[0.03] p-10 rounded-3xl border border-white/5 mb-12 text-left">
            <h3 className="text-2xl font-black text-indigo-400 italic mb-4 uppercase tracking-tight">
              {isR1 ? "Phase 01: Analytical Logic" : "Phase 02: Code Execution"}
            </h3>
            <p className="text-xl text-slate-400 leading-relaxed font-medium italic">
              {isR1 
                ? "In this phase, you must identify logical deviations and patterns. Speed and accuracy are critical for the global leaderboard." 
                : "The focus shifts to technical implementation. Deploy Python solutions to solve the given challenges."}
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoundIntro(false)}
            className="btn-premium !bg-indigo-600 !px-24 !py-8 text-2xl shadow-indigo-500/40"
          >
            START MODULE
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // GAME VIEW
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-fancy bg-slate-950 p-6 md:p-10 flex flex-col items-center"
    >
      <div className="w-full max-w-7xl">
        <header className="glass rounded-[2rem] p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
          <div className="flex-1 flex items-center gap-8">
            <div className="p-4 bg-indigo-500/10 rounded-2xl">
              <User className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4 italic uppercase">
                {teamName}
                <div className="badge-live !bg-indigo-500/10 !text-indigo-400 !border-indigo-500/20">Active Session</div>
              </h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mt-2 opacity-60">Lead: {leaderName}</p>
            </div>
          </div>

          <div className="flex-1 flex justify-center order-first md:order-none">
            <div className="text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-500/40 tracking-[0.8em] uppercase whitespace-nowrap">
                Current_Phase
              </div>
              <motion.div 
                key={round}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black italic text-gradient tracking-tighter"
              >
                ROUND 0{round}
              </motion.div>
              <div className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mt-1 opacity-40">
                {round === 1 ? "Analytical Logic" : "Code Execution"}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-end gap-10">
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Current Standing</p>
              <div className="text-5xl font-black text-white flex items-center gap-4">
                <span className="text-indigo-400 text-glow">{score}</span>
                <Trophy className="w-7 h-7 text-rose-500 accent-glow" />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-secondary !text-rose-500 !border-rose-500/10 hover:!border-rose-500/30"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </motion.button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {round === 1 ? (
            <motion.div 
              key="round1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="glass-card !p-10 md:!p-14 text-center relative overflow-hidden"
            >
            <div className="absolute top-0 right-0 p-8">
                <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mb-1">Module 01</div>
                <div className="text-indigo-400 text-2xl font-black italic uppercase tracking-tighter">Logic_Test</div>
              </div>

              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-3 bg-rose-500/10 text-rose-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-rose-500/20"
                >
                  <Award className="w-4 h-4" />
                  Challenge: Identify the Deviation
                </motion.div>
                
                <h3 className="text-3xl md:text-4xl mb-12 font-black leading-tight text-white tracking-tight italic">
                  {currentQ.text}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentQ.options.map((o, i) => (
                    <motion.button
                      key={o + i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const alreadyAnswered = answeredInR1.has(currentQ.id);
                        if (!alreadyAnswered) {
                          const newScore = o !== currentQ.correctAnswer ? score + 1 : score;
                          if (o !== currentQ.correctAnswer) setScore(newScore);
                          
                          const newAnswered = new Set(answeredInR1);
                          newAnswered.add(currentQ.id);
                          setAnsweredInR1(newAnswered);
                          
                          const answeredArr = Array.from(newAnswered);
                          localStorage.setItem("eventAnsweredR1", JSON.stringify(answeredArr));
                          localStorage.setItem("eventTeamScore", newScore.toString());

                          const nextIndex = currentQIndex + 1;
                          if (nextIndex < 30) {
                            setCurrentQIndex(nextIndex);
                            localStorage.setItem("eventQIndex", nextIndex.toString());
                            syncProgress({ score: newScore, qIndex: nextIndex, answered: answeredArr });
                          } else {
                            setRound(2);
                            setCurrentQIndex(0);
                            localStorage.setItem("eventRound", "2");
                            localStorage.setItem("eventQIndex", "0");
                            setShowRoundIntro(true);
                            syncProgress({ score: newScore, round: 2, qIndex: 0, answered: answeredArr });
                          }
                        } else {
                          const nextIndex = currentQIndex + 1;
                          if (nextIndex < 30) {
                            setCurrentQIndex(nextIndex);
                            localStorage.setItem("eventQIndex", nextIndex.toString());
                            syncProgress({ qIndex: nextIndex });
                          } else {
                            setRound(2);
                            setCurrentQIndex(0);
                            localStorage.setItem("eventRound", "2");
                            localStorage.setItem("eventQIndex", "0");
                            setShowRoundIntro(true);
                            syncProgress({ round: 2, qIndex: 0 });
                          }
                        }
                      }}
                      className="glass !bg-white/[0.02] p-8 rounded-[2rem] text-xl font-black hover:!bg-indigo-600/10 hover:border-indigo-500/40 transition-all border border-white/5 group relative overflow-hidden text-center italic"
                    >
                      <div className="absolute top-5 left-8 text-[10px] font-black text-slate-700 group-hover:text-indigo-400 transition-colors uppercase tracking-[0.4em]">
                        Choice_{i + 1}
                      </div>
                      <span className="relative z-10 text-white group-hover:text-glow transition-all">{o}</span>
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
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="glass-card border-indigo-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-[-20%] right-[-10%] opacity-5 rotate-12">
                    <Code2 className="w-64 h-64" />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]">Problem Definition</span>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-8 italic text-left tracking-tight">{currentQ.title}</h3>
                  <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5">
                    <p className="text-2xl text-slate-300 leading-relaxed font-medium italic text-left">
                      "{currentQ.codingPrompt}"
                    </p>
                  </div>
                </motion.div>

                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-center px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Execution Console</span>
                    </div>
                  </div>
                  <div className="glass rounded-[3rem] p-10 h-full min-h-[300px] font-mono text-2xl relative bg-black/60 overflow-hidden border-indigo-500/5">
                    <div className="absolute top-5 left-10 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">Ready_To_Process...</div>
                    <div className="text-white/90 whitespace-pre-wrap mt-6 leading-relaxed text-left">
                      {output || (
                        <span className="text-slate-800 animate-pulse italic">Awaiting deployment.</span>
                      )}
                    </div>
                    {isSolved && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-10 flex items-center gap-4 text-emerald-400 font-black italic bg-emerald-400/10 p-6 rounded-[2rem] border border-emerald-400/20 shadow-lg shadow-emerald-500/5"
                      >
                        <ShieldCheck className="w-7 h-7" />
                        COMPLETED: Output matches requirements.
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 w-full">
                <div className="h-[600px] glass rounded-[3rem] overflow-hidden border-2 border-white/5 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full p-5 glass !bg-slate-950/80 border-none border-b border-white/5 flex justify-between items-center px-10 z-20">
                    <div className="flex items-center gap-4">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 italic">Playground : Python</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-800" />
                      <div className="w-3 h-3 rounded-full bg-slate-800" />
                      <div className="w-3 h-3 rounded-full bg-indigo-500/20" />
                    </div>
                  </div>
                  <div className="pt-16 h-full relative z-10">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={code}
                      options={{
                        fontSize: 20,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        padding: { top: 30, bottom: 30 },
                        smoothScrolling: true,
                        cursorBlinking: "phase",
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden'
                        }
                      }}
                      onChange={v => setCode(v || "")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runCode}
                    disabled={isRunning}
                    className="md:col-span-3 btn-premium flex items-center justify-center gap-5 !py-8 !rounded-[2.5rem] shadow-indigo-500/20"
                  >
                    {isRunning ? (
                      <RefreshCcw className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-8 h-8 text-white accent-glow" />
                        <span className="text-4xl font-black italic tracking-tighter">EXECUTE</span>
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
                    className="glass rounded-[2.5rem] p-6 flex items-center justify-center border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition duration-500 disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    <ChevronRight className={`w-14 h-14 transition-all duration-700 ${isSolved ? 'text-emerald-400 scale-110' : 'text-slate-800'}`} />
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