import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Make sure to import the useAuth hook

// Initialize Firestore
const db = getFirestore();

const DonorProfile = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null); // User data
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for user feedback
  const [saving, setSaving] = useState(false); // Saving state for button

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) { // Check if currentUser is available
        const uid = currentUser.uid; // Get UID from authenticated user
        console.log('UID from AuthContext:', uid);

        try {
          const userDocRef = doc(db, 'donors', uid); // Reference to the user document by UID
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser(userDoc.data()); // Set the retrieved data to state
            console.log('User data set to state:', userDoc.data());
          } else {
            console.error('No such document for UID:', uid);
            setError('User profile not found.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data. Please try again.');
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      } else {
        console.error('No authenticated user found.');
        setLoading(false);
        setError('User is not authenticated.');
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setUser((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save the updated data to Firestore
  const handleSaveClick = async () => {
    if (currentUser && user) {
      const uid = currentUser.uid; // Get UID from current user
      console.log('Saving updated profile data for UID:', uid);
      setSaving(true);

      try {
        const userDocRef = doc(db, 'donors', uid);
        await updateDoc(userDocRef, user);
        console.log('Profile updated successfully in Firestore:', user);
        setIsEditing(false); // Exit editing mode
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      } finally {
        setSaving(false); // Set saving to false after completion
      }
    } else {
      console.error('User data or UID is missing');
    }
  };
  
  // Toggle editing mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    console.log('Editing mode toggled:', !isEditing);
  };

  if (loading) {
    console.log('Component is loading...');
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!user) {
    console.error('User data not found');
    return <div>User data not found.</div>; // Handle case where user data is not found
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Frozen Navbar */}
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

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4" style={{ top: '60px' }}>
          <nav className="flex flex-col space-y-4">
            <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">Donation History</Link>
            <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">Schedule Donation</Link>
            <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow ml-64 p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Donor Profile</h1>

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg p-6 flex">
            {/* Profile Icon and Basic Info */}
            <div className="w-1/3 flex flex-col items-center">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl mb-4" /> // Placeholder profile icon
              )}
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-700">Donor</p>
              <p className="text-gray-700">{user.address}</p>
            </div>

            {/* Editable User Info */}
            <div className="w-2/3 ml-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
              </div>

              {/* Edit / Save Button */}
              {isEditing ? (
                <button
                  onClick={handleSaveClick}
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;