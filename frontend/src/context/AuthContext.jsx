import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { mockUsers } from '../data/mockData'; // Fallback to know roles for new accounts
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom user data (role, points, name) from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ id: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() });
        } else {
          setUser({ id: firebaseUser.uid, email: firebaseUser.email, role: 'CUSTOMER' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data from Firestore to return immediately
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      const userData = { id: userCredential.user.uid, email, ...docSnap.data() };
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await GoogleAuth.signOut();
    } catch (e) {
      console.log("Not signed in with Google, or Google sign out failed", e);
    }
    await signOut(auth);
  };

  const addPoints = async (points) => {
    if (user && user.id) {
      const newPoints = (user.points || 0) + points;
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { points: newPoints });
      // The onAuthStateChanged isn't triggered by Firestore changes, 
      // so we update local state immediately for snappy UI
      setUser({ ...user, points: newPoints });
    }
  };

  const googleLogin = async () => {
    try {
      let userCredential;
      
      if (Capacitor.isNativePlatform()) {
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication.idToken;
        const credential = GoogleAuthProvider.credential(idToken);
        userCredential = await signInWithCredential(auth, credential);
      } else {
        const provider = new GoogleAuthProvider();
        userCredential = await signInWithPopup(auth, provider);
      }
      
      // Check if user exists in Firestore, if not create profile
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      let userData;
      if (!docSnap.exists()) {
        userData = {
          name: userCredential.user.displayName || 'New Customer',
          role: 'CUSTOMER',
          points: 0,
          email: userCredential.user.email
        };
        await setDoc(docRef, userData);
      } else {
        userData = docSnap.data();
      }
      
      return { success: true, user: { id: userCredential.user.uid, email: userCredential.user.email, ...userData } };
    } catch (error) {
      console.error("Google login failed", error);
      return { success: false, message: error.message || 'Google Sign-In failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, addPoints }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
