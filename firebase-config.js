// ====================================================
// Firebase Configuration & Initialization for Sibaq
// ====================================================

const firebaseConfig = {
  apiKey: "AIzaSyBunpRFN4h5B3u7byIMEDV4hddgik7sRY0",
  authDomain: "sibaq-2a1b4.firebaseapp.com",
  projectId: "sibaq-2a1b4",
  storageBucket: "sibaq-2a1b4.firebasestorage.app",
  messagingSenderId: "579482556257",
  appId: "1:579482556257:web:9bf319c62ede6795401720",
  measurementId: "G-YL1ZE6MQ94"
};

// Initialize Firebase
let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let firebaseStorage = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    firebaseAuth = firebase.auth();
    firebaseStorage = firebase.storage();
    console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
  } else {
    console.warn("Firebase SDK scripts not loaded yet. Make sure to include Firebase compat SDK scripts.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// ====================================================
// Helper Services for Firestore Synchronization
// ====================================================
window.SibaqFirebase = {
  app: firebaseApp,
  db: firestoreDb,
  auth: firebaseAuth,
  storage: firebaseStorage,
  config: firebaseConfig,

  // --- Mail Accounts Service ---
  async syncMailAccountToFirestore(account) {
    if (!firestoreDb) return false;
    try {
      const docId = account.id ? String(account.id) : String(Date.now());
      await firestoreDb.collection('mail_accounts').doc(docId).set(account, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for mail_accounts:", err.message);
      return false;
    }
  },

  async deleteMailAccountFromFirestore(idOrEmail) {
    if (!firestoreDb) return false;
    try {
      const col = firestoreDb.collection('mail_accounts');
      if (String(idOrEmail).includes('@')) {
        const snap = await col.where('email', '==', idOrEmail).get();
        snap.forEach(doc => doc.ref.delete());
      } else {
        await col.doc(String(idOrEmail)).delete();
      }
      return true;
    } catch (err) {
      console.warn("Firestore delete warning for mail_accounts:", err.message);
      return false;
    }
  },

  async loadMailAccountsFromFirestore() {
    if (!firestoreDb) return null;
    try {
      const snapshot = await firestoreDb.collection('mail_accounts').get();
      if (snapshot.empty) return null;
      const list = [];
      snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
      return list;
    } catch (err) {
      console.warn("Firestore load warning for mail_accounts:", err.message);
      return null;
    }
  },

  // Real-time listener for live sync
  listenToMailAccounts(callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('mail_accounts').onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
        callback(list);
      }, err => {
        console.warn("Firestore listener error for mail_accounts:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Users Access Service ---
  async syncUserAccessToFirestore(userAccess) {
    if (!firestoreDb) return false;
    try {
      const docId = userAccess.id ? String(userAccess.id) : ('ua_' + Date.now());
      await firestoreDb.collection('users_access').doc(docId).set(userAccess, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for users_access:", err.message);
      return false;
    }
  },

  async deleteUserAccessFromFirestore(id) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('users_access').doc(String(id)).delete();
      return true;
    } catch (err) {
      console.warn("Firestore delete warning for users_access:", err.message);
      return false;
    }
  },

  async loadUserAccessFromFirestore() {
    if (!firestoreDb) return null;
    try {
      const snapshot = await firestoreDb.collection('users_access').get();
      if (snapshot.empty) return null;
      const list = [];
      snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
      return list;
    } catch (err) {
      console.warn("Firestore load warning for users_access:", err.message);
      return null;
    }
  },

  // Real-time listener for live sync
  listenToUserAccess(callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('users_access').onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
        callback(list);
      }, err => {
        console.warn("Firestore listener error for users_access:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Program Data Service ---
  async syncProgramRecordToFirestore(record) {
    if (!firestoreDb) return false;
    try {
      const docId = record.id ? String(record.id) : String(Date.now());
      await firestoreDb.collection('program_records').doc(docId).set(record, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for program_records:", err.message);
      return false;
    }
  },

  async deleteProgramRecordFromFirestore(id) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('program_records').doc(String(id)).delete();
      return true;
    } catch (err) {
      console.warn("Firestore delete warning for program_records:", err.message);
      return false;
    }
  },

  async loadProgramRecordsFromFirestore() {
    if (!firestoreDb) return null;
    try {
      const snapshot = await firestoreDb.collection('program_records').get();
      if (snapshot.empty) return null;
      const list = [];
      snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
      return list;
    } catch (err) {
      console.warn("Firestore load warning for program_records:", err.message);
      return null;
    }
  },

  // Real-time listener for program records live sync
  listenToProgramRecords(callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('program_records').onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
        callback(list);
      }, err => {
        console.warn("Firestore listener error for program_records:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Time Sets Service ---
  async syncTimeSetToFirestore(timeSet) {
    if (!firestoreDb) return false;
    try {
      const docId = timeSet.id ? String(timeSet.id) : ('ts_' + Date.now());
      await firestoreDb.collection('time_sets').doc(docId).set(timeSet, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for time_sets:", err.message);
      return false;
    }
  },

  async deleteTimeSetFromFirestore(id) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('time_sets').doc(String(id)).delete();
      return true;
    } catch (err) {
      console.warn("Firestore delete warning for time_sets:", err.message);
      return false;
    }
  },

  listenToTimeSets(callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('time_sets').onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
        callback(list);
      }, err => {
        console.warn("Firestore listener error for time_sets:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Schedule Service ---
  async syncScheduleToFirestore(scheduleItem) {
    if (!firestoreDb) return false;
    try {
      const docId = scheduleItem.id ? String(scheduleItem.id) : ('sched_' + Date.now());
      await firestoreDb.collection('schedules').doc(docId).set(scheduleItem, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for schedules:", err.message);
      return false;
    }
  },

  async deleteScheduleFromFirestore(id) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('schedules').doc(String(id)).delete();
      return true;
    } catch (err) {
      console.warn("Firestore delete warning for schedules:", err.message);
      return false;
    }
  },

  async loadSchedulesFromFirestore() {
    if (!firestoreDb) return null;
    try {
      const snapshot = await firestoreDb.collection('schedules').get();
      if (snapshot.empty) return null;
      const list = [];
      snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
      return list;
    } catch (err) {
      console.warn("Firestore load warning for schedules:", err.message);
      return null;
    }
  },

  listenToSchedules(callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('schedules').onSnapshot(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
        callback(list);
      }, err => {
        console.warn("Firestore listener error for schedules:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Student Attendance Service ---
  async syncStudentAttendanceToFirestore(date, attendanceList) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('student_attendance').doc(String(date)).set({
        date,
        records: attendanceList,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for student_attendance:", err.message);
      return false;
    }
  },

  async loadStudentAttendanceFromFirestore(date) {
    if (!firestoreDb) return null;
    try {
      const doc = await firestoreDb.collection('student_attendance').doc(String(date)).get();
      if (!doc.exists) return null;
      return doc.data().records || null;
    } catch (err) {
      console.warn("Firestore load warning for student_attendance:", err.message);
      return null;
    }
  },

  listenToStudentAttendance(date, callback) {
    if (!firestoreDb) return null;
    try {
      return firestoreDb.collection('student_attendance').doc(String(date)).onSnapshot(doc => {
        if (doc && doc.exists) {
          callback(doc.data().records || []);
        }
      }, err => {
        console.warn("Firestore listener error for student_attendance:", err.message);
      });
    } catch (e) {
      return null;
    }
  },

  // --- Coach Attendance Service ---
  async syncCoachAttendanceToFirestore(date, attendanceList) {
    if (!firestoreDb) return false;
    try {
      await firestoreDb.collection('coach_attendance').doc(String(date)).set({
        date,
        records: attendanceList,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("Firestore sync warning for coach_attendance:", err.message);
      return false;
    }
  },

  async loadCoachAttendanceFromFirestore(date) {
    if (!firestoreDb) return null;
    try {
      const doc = await firestoreDb.collection('coach_attendance').doc(String(date)).get();
      if (!doc.exists) return null;
      return doc.data().records || null;
    } catch (err) {
      console.warn("Firestore load warning for coach_attendance:", err.message);
      return null;
    }
  }
};


