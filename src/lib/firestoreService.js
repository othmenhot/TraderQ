import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, where, writeBatch, serverTimestamp, runTransaction, setDoc } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);
const XP_PER_LEVEL = 100;

// --- Learning Content ---

export const getLearningPaths = async () => {
  try {
    const q = query(collection(db, 'learning_paths'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error(e); throw e; }
};

export const getLearningPathById = async (pathId) => {
  try {
    const docRef = doc(db, 'learning_paths', pathId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (e) { console.error(e); throw e; }
};

export const getModulesForPath = async (pathId) => {
  try {
    const q = query(collection(db, `learning_paths/${pathId}/modules`), orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error(e); throw e; }
};

export const updateChapterContent = async (chapterId, content) => {
  try {
    await setDoc(doc(db, 'chapter_content', chapterId), { content, updatedAt: serverTimestamp() });
  } catch (e) { console.error(e); throw e; }
};

export const getChapterContent = async (chapterId) => {
  try {
    const docSnap = await getDoc(doc(db, 'chapter_content', chapterId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) { console.error(e); throw e; }
};

// --- User Progress ---

export const startModuleForUser = async (userId, pathId, moduleId) => {
  try {
    const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`);
    await setDoc(progressRef, { userId, pathId, moduleId, status: 'in-progress', startedAt: serverTimestamp(), completedAt: null }, { merge: true });
  } catch (e) { console.error(e); throw e; }
};

export const completeModuleForUser = async (userId, moduleId) => {
  const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`);
  try {
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(progressRef);
      if (!doc.exists() || doc.data().status === 'completed') return;
      transaction.update(progressRef, { status: 'completed', completedAt: serverTimestamp() });
    });
  } catch (e) { console.error(e); throw e; }
};

export const getUserProgressForPath = async (userId, pathId) => {
  try {
    const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('pathId', '==', pathId));
    const snapshot = await getDocs(q);
    const progress = {};
    snapshot.forEach(doc => { progress[doc.data().moduleId] = doc.data(); });
    return progress;
  } catch (e) { console.error(e); return {}; }
};

export const getInProgressModules = async (userId) => {
  try {
    const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('status', '==', 'in-progress'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    const promises = snapshot.docs.map(p => getDoc(doc(db, `learning_paths/${p.data().pathId}/modules`, p.data().moduleId)));
    const docs = await Promise.all(promises);
    return docs.filter(d => d.exists()).map((d, i) => ({ ...d.data(), id: d.id, pathId: snapshot.docs[i].data().pathId }));
  } catch (e) { console.error(e); return []; }
};

// --- User Profile, Gamification, Badges ---

export const createUserProfile = async (userId, email) => {
  const ref = doc(db, 'user_profiles', userId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) {
    await setDoc(ref, { email: email || 'guest', xp: 0, level: 1, createdAt: serverTimestamp() });
  }
};

export const getUserProfile = async (userId) => {
  const docSnap = await getDoc(doc(db, 'user_profiles', userId));
  return docSnap.exists() ? docSnap.data() : null;
};

export const addXP = async (userId, amount) => {
  const ref = doc(db, 'user_profiles', userId);
  try {
    await runTransaction(db, async (t) => {
      const doc = await t.get(ref);
      if (!doc.exists()) throw "Profile does not exist!";
      const newXP = doc.data().xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      t.update(ref, { xp: newXP, level: newLevel });
    });
  } catch (e) { console.error(e); throw e; }
};

export const awardBadge = async (userId, badgeId) => {
  const ref = doc(db, 'user_badges', `${userId}_${badgeId}`);
  try {
    await runTransaction(db, async (t) => {
      const doc = await t.get(ref);
      if (doc.exists()) return;
      t.set(ref, { userId, badgeId, earnedAt: serverTimestamp() });
    });
  } catch (e) { console.error(e); }
};

export const getUserBadges = async (userId) => {
  try {
    const q = query(collection(db, 'user_badges'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data());
  } catch (e) { console.error(e); return []; }
};
