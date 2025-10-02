import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../lib/firebase';
import { createUserProfile, getUserProfile } from '../lib/firestoreService';

const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (uid) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          await createUserProfile(user); // CORRECTED: Pass the whole user object
          await fetchUserProfile(user.uid);
          setUser(user);
        } else {
          // User is signed out.
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth Hook Error on state change:", error);
        setUser(user); 
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const logout = async () => {
    await signOut(auth);
  };
  
  // ADDED: Function to manually refresh the user profile data
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  const value = { user, userProfile, loading, logout, refreshUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
