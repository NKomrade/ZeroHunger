// AuthContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a Context for Authentication
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Stop loading once the user state is set
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false); // Stop loading if there's an error
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Memoize the value to avoid unnecessary re-renders
  const value = useMemo(() => ({ currentUser, loading }), [currentUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children always */}
    </AuthContext.Provider>
  );
};