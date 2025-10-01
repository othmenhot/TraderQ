import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during registration:", error.code, error.message);
    throw error;
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during login:", error.code, error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign-in:", error.code, error.message);
    throw error;
  }
};

export const signInAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Error during guest sign-in:", error.code, error.message);
    throw error;
  }
};
