import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../lib/firebase';
import { createUserProfile, onUserProfileChange } from '../lib/firestoreService';

const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Unsubscribe from any previous profile listener
      unsubscribeProfile();

      if (user) {
        setLoading(true);
        await createUserProfile(user); // Ensure profile exists
        // Set up the real-time listener for the user's profile
        unsubscribeProfile = onUserProfileChange(user.uid, (profile) => {
          setUserProfile(profile);
          setLoading(false);
        });
        setUser(user);
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    // Cleanup both auth and profile listeners on component unmount
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
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
