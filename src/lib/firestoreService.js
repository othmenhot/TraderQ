import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, where, serverTimestamp, runTransaction, setDoc, updateDoc, addDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);
const XP_PER_LEVEL = 100;

// --- Learning Content ---
export const getLearningPaths = async () => { try { const q = query(collection(db, 'learning_paths'), orderBy('name')); const querySnapshot = await getDocs(q); return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { console.error("Error getting learning paths: ", e); throw e; } };
export const getLearningPathById = async (pathId) => { try { const docRef = doc(db, 'learning_paths', pathId); const docSnap = await getDoc(docRef); return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null; } catch (e) { console.error("Error getting learning path by ID: ", e); throw e; } };
export const getModulesForPath = async (pathId) => { try { const q = query(collection(db, `learning_paths/${pathId}/modules`), orderBy('order')); const querySnapshot = await getDocs(q); return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { console.error("Error getting modules for path: ", e); throw e; } };
export const getModuleById = async (pathId, moduleId) => {
  try {
    const docRef = doc(db, `learning_paths/${pathId}/modules`, moduleId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (e) {
    console.error("Error getting module by ID: ", e);
    throw e;
  }
};
export const getChaptersForModule = async (pathId, moduleId) => {
  try {
    const q = query(collection(db, `learning_paths/${pathId}/modules/${moduleId}/chapters`), orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Error getting chapters for module: ", e);
    throw e;
  }
};
export const getChapterContent = async (chapterId) => { try { const docSnap = await getDoc(doc(db, 'chapter_content', chapterId)); return docSnap.exists() ? docSnap.data() : null; } catch (e) { console.error(e); throw e; } };
export const updateChapterContent = async (chapterId, content) => { try { await setDoc(doc(db, 'chapter_content', chapterId), { content, updatedAt: serverTimestamp() }); } catch (e) { console.error(e); throw e; } };
export const getQuizById = async (quizId) => {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (e) {
    console.error("Error getting quiz by ID: ", e);
    throw e;
  }
};


// --- User Progress ---
export const startModuleForUser = async (userId, pathId, moduleId) => { try { const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`); await setDoc(progressRef, { userId, pathId, moduleId, status: 'in-progress', startedAt: serverTimestamp(), completedAt: null }, { merge: true }); } catch (e) { console.error("Error starting module for user: ", e); throw e; } };
export const completeModuleForUser = async (userId, moduleId) => { const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`); try { await runTransaction(db, async (transaction) => { const doc = await transaction.get(progressRef); if (!doc.exists() || doc.data().status === 'completed') return; transaction.update(progressRef, { status: 'completed', completedAt: serverTimestamp() }); }); } catch (e) { console.error("Error completing module for user: ", e); throw e; } };
export const getInProgressModules = async (userId) => { try { const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('status', '==', 'in-progress')); const snapshot = await getDocs(q); if (snapshot.empty) return []; const promises = snapshot.docs.map(p => getDoc(doc(db, `learning_paths/${p.data().pathId}/modules`, p.data().moduleId))); const docs = await Promise.all(promises); return docs.filter(d => d.exists()).map((d, i) => ({ ...d.data(), id: d.id, pathId: snapshot.docs[i].data().pathId })); } catch (e) { console.error(e); return []; } };
export const getUserProgressForPath = async (userId, pathId) => {
  const progress = {};
  const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('pathId', '==', pathId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const data = doc.data();
    progress[data.moduleId] = data;
  });
  return progress;
};

// --- User Profile, Gamification, Badges ---
export const createUserProfile = async (user) => {
    const ref = doc(db, 'user_profiles', user.uid);
    const docSnap = await getDoc(ref);
    const initialBalance = 100000;
    const simulationData = {
        balance: initialBalance,
        equity: initialBalance,
        marginUsed: 0,
        freeMargin: initialBalance,
        leverage: 100 // <-- ADDED DEFAULT LEVERAGE
    };

    if (!docSnap.exists()) {
      const { email, displayName, photoURL } = user;
      await setDoc(ref, {
        email,
        displayName: displayName || "Guest",
        photoURL,
        xp: 0,
        level: 1,
        createdAt: serverTimestamp(),
        simulation: simulationData,
        plan: 'Pro'
      });
    } else {
      const data = docSnap.data();
      if (!data.simulation) {
        await updateDoc(ref, { simulation: simulationData });
      } else if (data.simulation.leverage === undefined) {
        // Backfill leverage for existing users
        await updateDoc(ref, { "simulation.leverage": 100 });
      }
    }
};

export const onUserProfileChange = (userId, callback) => {
  const docRef = doc(db, 'user_profiles', userId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
};

export const getUserProfile = async (userId) => { const docSnap = await getDoc(doc(db, 'user_profiles', userId)); return docSnap.exists() ? docSnap.data() : null; };
export const addXP = async (userId, amount) => { const ref = doc(db, 'user_profiles', userId); try { await runTransaction(db, async (t) => { const doc = await t.get(ref); if (!doc.exists()) throw "Profile does not exist!"; const newXP = doc.data().xp + amount; const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1; t.update(ref, { xp: newXP, level: newLevel }); }); } catch (e) { console.error(e); throw e; } };
export const awardBadge = async (userId, badgeId) => { const ref = doc(db, 'user_badges', `${userId}_${badgeId}`); try { await runTransaction(db, async (t) => { const doc = await t.get(ref); if (doc.exists()) return; t.set(ref, { userId, badgeId, earnedAt: serverTimestamp() }); }); } catch (e) { console.error(e); } };
export const getUserBadges = async (userId) => { try { const q = query(collection(db, 'user_badges'), where('userId', '==', userId)); const snapshot = await getDocs(q); return snapshot.docs.map(d => d.data()); } catch (e) { console.error("Error getting user badges: ", e); return []; } };

// --- Trading Simulation ---
export const addTrade = async (userId, tradeData) => {
  try {
    await addDoc(collection(db, 'trades'), { ...tradeData, userId, createdAt: serverTimestamp() });
  } catch (error) {
    console.error("Error adding trade: ", error);
  }
};

export const getUserTrades = (userId, callback) => {
  const q = query(collection(db, 'trades'), where('userId', '==', userId));
  return onSnapshot(q, (querySnapshot) => {
    const trades = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(trades);
  }, (error) => {
    console.error("Firestore onSnapshot error:", error);
  });
};

export const updateTrade = async (tradeId, data) => {
  const tradeRef = doc(db, 'trades', tradeId);
  try {
    await updateDoc(tradeRef, data);
  } catch (error) {
    console.error("Error updating trade: ", error);
  }
};

export const deleteTrade = async (tradeId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  try {
    await deleteDoc(tradeRef);
  } catch (error) {
    console.error("Error deleting trade: ", error);
    throw error;
  }
};

export const closeTradeAndUpdateBalance = async (userId, trade, closingPrice, pnl) => {
  const tradeRef = doc(db, 'trades', trade.id);
  const userProfileRef = doc(db, 'user_profiles', userId);

  try {
    await runTransaction(db, async (transaction) => {
      const userProfileDoc = await transaction.get(userProfileRef);
      if (!userProfileDoc.exists()) throw "User profile does not exist!";
      transaction.update(tradeRef, { status: 'closed', closingPrice: closingPrice, closedAt: serverTimestamp(), pnl: pnl });
      const newBalance = userProfileDoc.data().simulation.balance + pnl;
      transaction.update(userProfileRef, { "simulation.balance": newBalance });
    });
  } catch (error) {
    console.error("Trade closing transaction failed: ", error);
    throw error;
  }
};
