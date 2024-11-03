import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

// Initialize Firebase app, Firestore, and Storage
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const ScheduleDonation = () => {
  const [newDonation, setNewDonation] = useState({
    foodName: '',
    foodType: '',
    quantity: '',
    timeFrom: '',
    timeTo: '',
    address: '',
    pincode: '',
    contactNumber: '',
    donatorName: '',
    donatorEmail: '',
    instructions: '',
    foodImage: null,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const donorId = 'your-donor-id';

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        const donorDoc = await getDoc(doc(db, 'donors', donorId));
        if (donorDoc.exists()) {
          const donorData = donorDoc.data();
          setNewDonation((prev) => ({
            ...prev,
            donatorName: donorData.name,
            donatorEmail: donorData.email,
            contactNumber: donorData.mobile,
          }));
        }
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    fetchDonorInfo();
  }, [donorId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewDonation({
      ...newDonation,
      [name]: files ? files[0] : value,
    });
  };

  const uploadFoodImage = async () => {
    if (newDonation.foodImage) {
      setUploading(true);
      const imageRef = ref(storage, `foodImages/${newDonation.foodImage.name}`);
      await uploadBytes(imageRef, newDonation.foodImage);
      const imageUrl = await getDownloadURL(imageRef);
      setUploading(false);
      return imageUrl;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Reset success message
    try {
      // Upload image to Firebase Storage and get URL
      const foodImageUrl = await uploadFoodImage();

      // Create the data object to save in Firestore
      const donationData = {
        ...newDonation,
        foodImage: foodImageUrl,
      };

      // Save donation data to Firestore under "donorschedule" collection in "donors" document
      await addDoc(collection(db, 'donorschedule'), donationData);

      // Show success message
      setSuccessMessage('Your donation has been successfully scheduled!');
      alert(`A donation has been scheduled from ${newDonation.timeFrom} to ${newDonation.timeTo}.`);

      // Reset the form
      setNewDonation({
        foodName: '',
        foodType: '',
        quantity: '',
        timeFrom: '',
        timeTo: '',
        address: '',
        pincode: '',
        contactNumber: newDonation.contactNumber, // Preserved
        donatorName: newDonation.donatorName, // Preserved
        donatorEmail: newDonation.donatorEmail, // Preserved
        instructions: '',
        foodImage: null,
      });
    } catch (error) {
      console.error('Error scheduling donation:', error);
      setSuccessMessage('Failed to schedule donation. Please try again.');
    }
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-white font-bold text-lg">ZeroHunger</div>
        <div>
          <Link
            to="/"
            className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200"
          >
            Sign out as Donor
          </Link>
        </div>
      </nav>

      <div className="flex">
        <div className="fixed w-64 bg-blue-500 text-white h-[calc(100vh-60px)] p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">Donation History</Link>
            <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">Schedule Donation</Link>
            <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        <div className="flex-grow p-6 bg-white min-h-screen ml-64">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Schedule a New Donation</h1>
          <div className="bg-gray-50 shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="foodName" className="block text-sm font-medium mb-2">Food Name</label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    value={newDonation.foodName}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter the food name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="foodType" className="block text-sm font-medium mb-2">Food Type</label>
                  <input
                    type="text"
                    id="foodType"
                    name="foodType"
                    value={newDonation.foodType}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter the food type"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={newDonation.quantity}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter the quantity"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="foodImage" className="block text-sm font-medium mb-2">Upload Food Image</label>
                  <input
                    type="file"
                    id="foodImage"
                    name="foodImage"
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timeFrom" className="block text-sm font-medium mb-2">Pickup Time (From)</label>
                  <input
                    type="time"
                    id="timeFrom"
                    name="timeFrom"
                    value={newDonation.timeFrom}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timeTo" className="block text-sm font-medium mb-2">Pickup Time (To)</label>
                  <input
                    type="time"
                    id="timeTo"
                    name="timeTo"
                    value={newDonation.timeTo}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newDonation.address}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter the address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium mb-2">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={newDonation.pincode}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter the pincode"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium mb-2">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={newDonation.contactNumber}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="donatorName" className="block text-sm font-medium mb-2">Donator Name</label>
                  <input
                    type="text"
                    id="donatorName"
                    name="donatorName"
                    value={newDonation.donatorName}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="donatorEmail" className="block text-sm font-medium mb-2">Donator Email</label>
                  <input
                    type="email"
                    id="donatorEmail"
                    name="donatorEmail"
                    value={newDonation.donatorEmail}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="instructions" className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={newDonation.instructions}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  rows="3"
                  placeholder="Enter any additional notes"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 transition duration-200"
              >
                {uploading ? 'Uploading...' : 'Schedule Donation'}
              </button>
            </form>
            {successMessage && (
              <p className="text-blue-600 font-semibold mt-4">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDonation;