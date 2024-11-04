import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

// Navbar Component
const Navbar = () => (
  <nav className="bg-blue-500 p-4 flex justify-between items-center">
    <div className="text-white font-bold text-lg">
      <Link to="/">ZeroHunger</Link>
    </div>
    <div>
      <Link to="/" className="text-white mx-2 hover:underline transition duration-200">Home</Link>
      <Link to="/about" className="text-white mx-2 hover:underline transition duration-200">About</Link>
      <Link to="/contact" className="text-white mx-2 hover:underline transition duration-200">Contact</Link>
      <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
    </div>
  </nav>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
  });
  const [step, setStep] = useState(1); // Track the current step
  const [errorMessage, setErrorMessage] = useState(''); // Track error messages
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2); // Proceed to next step after selecting role
  };

  const handlePrevious = () => {
    setFormData({ role: '', email: '', password: '' });
    setErrorMessage(''); // Clear any error message
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    const { role, email, password } = formData;
  
    try {
      // Authenticate user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Log user details for debugging
      console.log('User successfully logged in:', user);
  
      // Store UID in localStorage and log it
      localStorage.setItem('donorUID', user.uid);
      console.log('UID stored in localStorage:', user.uid);
  
      // Redirect to the donor dashboard (without passing state directly)
      alert(`Welcome, ${role}!`);
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        {step === 1 && (
          <>
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">Welcome Back!</h2>
            <h2 className="text-2xl mb-4 text-neutral-900">Log in as:</h2>
            <div className="mb-4 flex justify-between">
              <button
                onClick={() => handleRoleSelect('Donor')}
                className="flex-1 mr-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Donor
              </button>
              <button
                onClick={() => handleRoleSelect('Recipient')}
                className="flex-1 mr-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Recipient
              </button>
              <button
                onClick={() => handleRoleSelect('Volunteer')}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Volunteer
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-neutral-900">
              Log in as {formData.role}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-neutral-900 mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-neutral-900 mb-1" htmlFor="password">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 py-12 px-5 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errorMessage && (
                <p className="text-red-500 font-semibold mb-4">{errorMessage}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="mr-2 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;