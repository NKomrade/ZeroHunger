import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration using environment variables
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

export default function DonorSignup({ setUserRole }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    role: 'Donor',
    name: '',
    mobile: '',
    email: '',
    password: '',
    organizationName: '',
    address: '',
    pincode: '',
    fssaiNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User signed up with UID:', user.uid);

      // Step 2: Save additional user data in Firestore, linked by UID
      const { password, ...dataToSave } = formData; // Exclude password from Firestore
      dataToSave.uid = user.uid; // Link Firestore data to Firebase Auth user

      const docRef = await addDoc(collection(db, 'donors'), dataToSave);
      console.log('Document written with ID:', docRef.id);

      // Step 3: Set the user role and navigate to the Donor dashboard
      localStorage.setItem('userRole', 'Donor');
      setUserRole('Donor');

      navigate('/donor/dashboard');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        <button onClick={() => navigate("/")} className="absolute top-10 left-8 text-gray-600">
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-neutral-900 text-center">
          Donor Signup
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Mobile Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="mobile">Mobile</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Email Field */}
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

            {/* Password Field with Toggle Icon */}
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Organization Name Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="organizationName">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                id="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter your organization name"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Pincode Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="pincode">Pincode</label>
              <input
                type="text"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* FSSAI Number Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="fssaiNumber">FSSAI Number</label>
              <input
                type="text"
                name="fssaiNumber"
                id="fssaiNumber"
                value={formData.fssaiNumber}
                onChange={handleChange}
                placeholder="Enter your FSSAI number"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}