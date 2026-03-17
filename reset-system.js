const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, deleteDoc, deleteField, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAxF7DVaAVGZ-8GHqhtNHcdU-ERdbbBQWE",
  authDomain: "hackandcrack-protype.firebaseapp.com",
  projectId: "hackandcrack-protype",
  storageBucket: "hackandcrack-protype.firebasestorage.app",
  messagingSenderId: "1079618302498",
  appId: "1:1079618302498:web:a92dd4a77f5503befa107b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fullReset() {
  console.log("🔄 Starting full system database reset...");
  try {
    const teamsSnap = await getDocs(collection(db, "teams"));
    let teamCount = 0;
    for (const docSnap of teamsSnap.docs) {
      await updateDoc(docSnap.ref, {
        score: 0,
        tabSwitches: 0,
        deviceId: deleteField(),
        answeredInR1: deleteField(),
        isCompleted: deleteField(),
        currentQIndex: deleteField()
      });
      teamCount++;
    }
    console.log(`✅ Reset ${teamCount} teams successfully.`);

    const activeSnap = await getDocs(collection(db, "activeSessions"));
    let sessionCount = 0;
    for (const docSnap of activeSnap.docs) {
      await deleteDoc(docSnap.ref);
      sessionCount++;
    }
    console.log(`✅ Cleared ${sessionCount} active sessions.`);
    console.log("-----------------------------------------");
    console.log("🚀 SYSTEM RESET COMPLETE. READY FOR GO-LIVE!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to reset:", err);
    process.exit(1);
  }
}
fullReset();