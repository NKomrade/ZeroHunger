import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

export default function VolunteerSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const [formData, setFormData] = useState({
    role: 'Volunteer',
    name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
  });

  const [pincodes, setPincodes] = useState(['']); // Array to store preferred pincodes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePincodeChange = (index, value) => {
    const newPincodes = [...pincodes];
    newPincodes[index] = value;
    setPincodes(newPincodes);
  };

  const addPincodeField = () => {
    setPincodes([...pincodes, '']); // Add a new empty pincode field
  };

  const removePincodeField = (index) => {
    if (pincodes.length > 1) {
      const newPincodes = [...pincodes];
      newPincodes.splice(index, 1); // Remove the pincode field at the given index
      setPincodes(newPincodes);
    }
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
      dataToSave.pincodes = pincodes; // Add the array of preferred pincodes

      const docRef = await addDoc(collection(db, 'volunteers'), dataToSave);
      console.log('Document successfully written with ID:', docRef.id);

      // Redirect to Volunteer Dashboard after successful signup
      navigate('/volunteer/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Back Arrow at Top Left */}
        <button onClick={() => navigate("/")} className="absolute top-10 left-8 text-gray-600">
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-neutral-900 text-center">
          Volunteer Signup
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'mobile', 'email'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-neutral-900 mb-1" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>
            ))}

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

            {/* Address field spanning across two columns */}
            <div className="col-span-1 md:col-span-2 mb-4">
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
          </div>

          <div className="mb-4">
            <label className="block text-neutral-900 mb-2">Preferred Pincode(s)</label>
            {pincodes.map((pincode, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(index, e.target.value)}
                  placeholder={`Enter preferred pincode ${index + 1}`}
                  className="w-full border rounded p-2 mr-2 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => addPincodeField()}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  +1
                </button>
                {pincodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePincodeField(index)}
                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    -
                  </button>
                )}
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