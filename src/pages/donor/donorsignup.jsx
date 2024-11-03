import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('User signed up:', userCredential.user.uid);

      // Prepare data to save, excluding password
      const { password, ...dataToSave } = formData;

      // Save data to Firestore without the password
      const docRef = await addDoc(collection(db, 'donors'), dataToSave);
      console.log('Document written with ID:', docRef.id);

      // Set user role in local storage and state
      localStorage.setItem('userRole', 'Donor');
      setUserRole('Donor');

      // Redirect to Donor Dashboard after successful submission
      navigate('/donor/dashboard');
    } catch (error) {
      console.error('Error adding document:', error);
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
            {['name', 'mobile', 'email', 'password', 'organizationName', 'pincode', 'address', 'fssaiNumber'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-neutral-900 mb-1" htmlFor={field}>
                  {field === 'organizationName'
                    ? 'Organization Name'
                    : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === 'organizationName'
                      ? 'Enter your organization name'
                      : `Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
                  }
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>
            ))}
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