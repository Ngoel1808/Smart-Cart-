import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { mockUsers } from '../data/mockData'; // Fallback to know roles for new accounts

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
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
      let userCredential;
      try {
        // Try to sign in first
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        // If the user doesn't exist yet (for our demo), auto-register them!
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Determine demo role based on email or fallback to mockUsers
          const mockMatch = mockUsers.find(u => u.email === email);
          let role = 'CUSTOMER';
          let name = 'New Customer';
          
          if (mockMatch) {
            role = mockMatch.role;
            name = mockMatch.name;
          } else if (email.includes('manager')) {
            role = 'MANAGER';
            name = 'Store Manager';
          } else if (email.includes('staff')) {
            role = 'STAFF';
            name = 'Staff Member';
          }
          
          // Save the new user profile to Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            role,
            points: 0,
            email
          });
        } else {
          throw err;
        }
      }
      
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

  return (
    <AuthContext.Provider value={{ user, login, logout, addPoints }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
