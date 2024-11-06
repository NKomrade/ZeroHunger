import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const DonorProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    organizationName: '',
    pincode: '',
    fssaiNumber: '',
    role: 'Donor',
    profilePicture: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, 'donors', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error('No user data found');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `donorphoto/${auth.currentUser.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUser((prevUser) => ({ ...prevUser, profilePicture: downloadURL }));
        const userDocRef = doc(db, 'donors', auth.currentUser.uid);
        await updateDoc(userDocRef, { profilePicture: downloadURL });
      } catch (error) {
        console.error('Error saving profile picture:', error);
        setErrorMessage('Error saving profile picture. Please try again.');
      }
    }
  };

  const handleDeletePhoto = async () => {
    setUser((prevUser) => ({ ...prevUser, profilePicture: '' }));

    try {
      const userDocRef = doc(db, 'donors', auth.currentUser.uid);
      await updateDoc(userDocRef, { profilePicture: '' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      const userDocRef = doc(db, 'donors', auth.currentUser.uid);
      await updateDoc(userDocRef, user);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem('donorUID');
      navigate('/login');
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-white font-bold text-lg">ZeroHunger</div>
        <div>
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200"
          >
            Sign out as Donor
          </button>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
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

          <div className="bg-white shadow rounded-lg p-6 flex">
            {/* Profile Picture and Basic Info */}
            <div className="w-1/3 flex flex-col items-center">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-700">{user.role}</p>

              {/* Upload and Delete Photo Buttons */}
              <div className="mt-4">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200">
                  Upload Photo
                  <input
                    type="file"
                    onChange={handleUploadPhoto}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </label>
                {user.profilePicture && (
                  <button
                    onClick={handleDeletePhoto}
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete Photo
                  </button>
                )}
              </div>
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
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
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
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    value={user.mobile || ''}
                    onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">FSSAI Number</label>
                  <input
                    type="text"
                    name="fssaiNumber"
                    value={user.fssaiNumber || ''}
                    onChange={(e) => setUser({ ...user, fssaiNumber: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
              </div>

              {/* Pincode and Address in a single row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={user.pincode || ''}
                    onChange={(e) => setUser({ ...user, pincode: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address || ''}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (isEditing) handleSaveClick();
                  setIsEditing(!isEditing);
                }}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
                disabled={saving}
              >
                {saving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
              </button>
              {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;