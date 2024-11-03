import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function VolunteerSignup() {
  const navigate = useNavigate();

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
    const dataToSave = { ...formData, pincodes }; // Merging formData and pincodes

    console.log('Form Data:', dataToSave);

    try {
      // Save data to the "volunteers" collection in Firestore
      const docRef = await addDoc(collection(db, 'volunteers'), dataToSave);
      console.log('Document successfully written with ID:', docRef.id);

      // Redirect to Volunteer Dashboard after successful submission
      navigate('/volunteer/dashboard');
    } catch (error) {
      console.error('Error adding document:', error);
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
            {['name', 'mobile', 'email', 'password'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-neutral-900 mb-1" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
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

            {/* Address field spanning across two columns */}
            <div className="col-span-1 md:col-span-2 mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="address">
                Address
              </label>
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