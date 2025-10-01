import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../lib/firebase';
import { createUserProfile, getUserProfile } from '../lib/firestoreService';

const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          // These operations might fail if Firestore rules are not set up.
          await createUserProfile(user.uid, user.email);
          const profile = await getUserProfile(user.uid);
          setUser(user);
          setUserProfile(profile);
        } else {
          // User is signed out.
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth Hook Error:", error);
        // Still set the user to avoid breaking the app, but profile will be null.
        setUser(user); 
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = { user, userProfile, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
