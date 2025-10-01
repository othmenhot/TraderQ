import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, where, writeBatch, serverTimestamp, runTransaction } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);
const XP_PER_LEVEL = 100;

// --- Learning Paths and Modules ---

export const getLearningPaths = async () => {
  try {
    const q = query(collection(db, 'learning_paths'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) { console.error("Error fetching learning paths: ", error); throw error; }
};

export const getLearningPathById = async (pathId) => {
  try {
    const docRef = doc(db, 'learning_paths', pathId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) { console.error("Error fetching learning path by ID: ", error); throw error; }
};

export const getModulesForPath = async (pathId) => {
  try {
    const q = query(collection(db, `learning_paths/${pathId}/modules`), orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) { console.error("Error fetching modules for path: ", error); throw error; }
};

// --- User Progress ---

export const startModuleForUser = async (userId, pathId, moduleId) => {
  try {
    const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`);
    await writeBatch(db).set(progressRef, { userId, pathId, moduleId, status: 'in-progress', startedAt: serverTimestamp(), completedAt: null }, { merge: true }).commit();
  } catch (error) { console.error("Error starting module for user: ", error); throw error; }
};

export const completeModuleForUser = async (userId, moduleId) => {
  const progressRef = doc(db, 'user_progress', `${userId}_${moduleId}`);
  try {
    await runTransaction(db, async (transaction) => {
      const progressDoc = await transaction.get(progressRef);
      if (!progressDoc.exists() || progressDoc.data().status === 'completed') return;
      transaction.update(progressRef, { status: 'completed', completedAt: serverTimestamp() });
    });
  } catch (error) { console.error("Error completing module:", error); throw error; }
};

export const getUserProgressForPath = async (userId, pathId) => {
  try {
    const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('pathId', '==', pathId));
    const querySnapshot = await getDocs(q);
    const progress = {};
    querySnapshot.forEach(doc => { progress[doc.data().moduleId] = doc.data(); });
    return progress;
  } catch (error) { console.error("Error fetching user progress: ", error); return {}; }
};

export const getInProgressModules = async (userId) => {
  try {
    const q = query(collection(db, 'user_progress'), where('userId', '==', userId), where('status', '==', 'in-progress'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return [];
    const modulePromises = querySnapshot.docs.map(p => getDoc(doc(db, `learning_paths/${p.data().pathId}/modules`, p.data().moduleId)));
    const moduleDocs = await Promise.all(modulePromises);
    return moduleDocs.filter(d => d.exists()).map((d, i) => ({ ...d.data(), id: d.id, pathId: querySnapshot.docs[i].data().pathId }));
  } catch (error) { console.error("Error fetching in-progress modules: ", error); return []; }
};

// --- User Profile, Gamification, and Badges ---

export const createUserProfile = async (userId, email) => {
  const userProfileRef = doc(db, 'user_profiles', userId);
  const docSnap = await getDoc(userProfileRef);
  if (!docSnap.exists()) {
    await writeBatch(db).set(userProfileRef, { email: email || 'guest', xp: 0, level: 1, createdAt: serverTimestamp() }).commit();
  }
};

export const getUserProfile = async (userId) => {
  const docSnap = await getDoc(doc(db, 'user_profiles', userId));
  return docSnap.exists() ? docSnap.data() : null;
};

export const addXP = async (userId, amount) => {
  const userProfileRef = doc(db, 'user_profiles', userId);
  try {
    await runTransaction(db, async (transaction) => {
      const userProfile = await transaction.get(userProfileRef);
      if (!userProfile.exists()) throw "User profile does not exist!";
      const { xp } = userProfile.data();
      const newXP = xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      transaction.update(userProfileRef, { xp: newXP, level: newLevel });
    });
  } catch (error) { console.error("Transaction failed: ", error); throw error; }
};

export const awardBadge = async (userId, badgeId) => {
  const badgeRef = doc(db, 'user_badges', `${userId}_${badgeId}`);
  try {
    await runTransaction(db, async (transaction) => {
      const badgeDoc = await transaction.get(badgeRef);
      if (badgeDoc.exists()) return;
      transaction.set(badgeRef, { userId, badgeId, earnedAt: serverTimestamp() });
    });
  } catch (error) { console.error("Error awarding badge:", error); }
};

export const getUserBadges = async (userId) => {
  try {
    const q = query(collection(db, 'user_badges'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) { console.error("Error fetching user badges: ", error); return []; }
};
