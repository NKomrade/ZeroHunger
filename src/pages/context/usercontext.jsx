import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app, Firestore, and Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Create UserContext
const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for user data
  const navigate = useNavigate();

  // Function to handle signup for Donor, Recipient, and Volunteer
  const handleSignup = async (role, formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const { uid } = userCredential.user;
  
      const { password, ...dataToSave } = formData;
      dataToSave.uid = uid;
  
      await setDoc(doc(db, role.toLowerCase() + 's', uid), dataToSave);
  
      setUser(dataToSave);
      setRole(role);
      localStorage.setItem('userRole', role);
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };
  
  // Handle login based on role
  const handleLogin = async (role, email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
  
      const collectionName = role.toLowerCase() + 's'; // 'donors', 'recipients', 'volunteers'
      const userDocRef = doc(db, collectionName, uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        throw new Error(`No user found with role ${role}. Please check your selection.`);
      }
  
      const userData = userDoc.data();
      setUser(userData);
      setRole(role);
      localStorage.setItem('userRole', role);
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error('Login error:', error);
  
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      } else {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Update user profile function
  const updateUser = async (updatedData) => {
    try {
      if (user && user.uid) {
        const collectionName = role.toLowerCase() + 's';
        const userDocRef = doc(db, collectionName, user.uid);
        await updateDoc(userDocRef, updatedData);
        
        setUser((prev) => ({ ...prev, ...updatedData }));
        console.log('User profile updated successfully');
      } else {
        console.warn('No user is logged in to update');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update profile.');
    }
  };

  // Load user data on app initialization
  useEffect(() => {
    const loadUserData = async (currentUser) => {
      if (currentUser) {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          const userDocRef = doc(db, storedRole.toLowerCase() + 's', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(userDoc.data());
            setRole(storedRole);
          } else {
            console.error('User data not found in Firestore for stored role.');
          }
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setLoading(true);
      loadUserData(currentUser);
    });

    const updateUser = async (updatedData) => {
      if (!user || !user.uid) {
        console.error("User is not authenticated or UID is missing.");
        return;
      }
    
      const collectionName = `${role.toLowerCase()}s`; // Collection name based on role
      const userDocRef = doc(db, collectionName, user.uid);
    
      try {
        // Update Firestore
        await setDoc(userDocRef, { ...user, ...updatedData }, { merge: true });
    
        // Update local user state
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
      } catch (error) {
        console.error("Error updating user data:", error);
        throw error; // Re-throw to handle in the component if needed
      }
    };

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  return (
    <UserContext.Provider value={{ user, role, handleSignup, handleLogin, handleLogout, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};