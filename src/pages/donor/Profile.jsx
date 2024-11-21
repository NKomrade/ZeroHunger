import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const DonorProfile = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [certificates, setCertificates] = useState([]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    organizationName: '',
    pincode: '',
    role: 'Donor',
    profilePicture: '',
    certificates: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const userDocRef = doc(db, 'donors', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setCertificates(userDoc.data().certificates || []);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, 'donors', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
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
    if (file && auth.currentUser.uid) {
      const storageRef = ref(storage, `donorphoto/${auth.currentUser.uid}/profilePicture`);
      try {
        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Update local state with new profile picture URL
        setUser((prevUser) => ({ ...prevUser, profilePicture: downloadURL }));
        
        // Save profile picture URL to Firestore
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

    // Update Firestore to remove profile picture
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

  const handleDeleteCertificate = async (pdfUrl, thumbnailUrl) => {
    try {
      // Extract path from URL
      const getPathFromUrl = (url) => {
        const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/[your-project-id].appspot.com/o/';
        return decodeURIComponent(url.replace(baseUrl, '').split('?')[0]);
      };

      const pdfPath = getPathFromUrl(pdfUrl);
      const thumbnailPath = getPathFromUrl(thumbnailUrl);

      // Delete the PDF and thumbnail from storage
      const pdfRef = ref(storage, pdfPath);
      await deleteObject(pdfRef);

      const thumbnailRef = ref(storage, thumbnailPath);
      await deleteObject(thumbnailRef);

      // Update Firestore
      const userDocRef = doc(db, 'donors', auth.currentUser.uid);
      const updatedCertificates = certificates.filter(cert => cert.pdfUrl !== pdfUrl);
      await updateDoc(userDocRef, { certificates: updatedCertificates });

      // Update local state
      setCertificates(updatedCertificates);
      alert('Certificate deleted successfully');
    } catch (error) {
      console.error('Error deleting certificate:', error);
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
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-30">
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

          <div ref={profileRef} className="bg-white shadow rounded-lg p-6 flex">
            {/* Profile Picture and Basic Info */}
            <div className="w-1/3 flex flex-col items-center">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-700">{user.role}</p>

              {/* Upload and Delete Photo Buttons */}
              <div className="mt-4">
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200">
                  Upload Photo
                  <input type="file" onChange={handleUploadPhoto} accept="image/*" style={{ display: 'none' }} />
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
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
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

          {/* Certificates Section */}
          {certificates && certificates.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-2">Your Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded shadow">
                    <img 
                      src={cert.thumbnailUrl} 
                      alt={`Certificate ${index + 1} Thumbnail`} 
                      className="w-full rounded mb-2" 
                    />
                    <div className="flex justify-between items-center">
                      <a 
                        href={cert.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteCertificate(cert.pdfUrl, cert.thumbnailUrl)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;