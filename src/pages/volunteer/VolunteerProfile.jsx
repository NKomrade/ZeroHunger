import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useUserContext } from '../context/usercontext';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const storage = getStorage();
const db = getFirestore();

const VolunteerProfile = () => {
  const { user, updateUser, loading } = useUserContext();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    pincodes: user?.pincodes || [''], // Use pincodes array here
    role: user?.role || 'Volunteer',
    profilePicture: user?.profilePicture || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      pincodes: user?.pincodes || [''], // Initialize with an array
      role: user?.role || 'Volunteer',
      profilePicture: user?.profilePicture || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        await updateUser(profile); // Update profile in context and Firestore
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user?.uid) {
      setUploading(true);
      const storageRef = ref(storage, `volunteerphoto/${user.uid}/profilePicture`);
      try {
        await uploadBytes(storageRef, file);
        const profilePictureURL = await getDownloadURL(storageRef);
        setProfile((prevProfile) => ({ ...prevProfile, profilePicture: profilePictureURL }));
        await updateUser({ ...profile, profilePicture: profilePictureURL });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (user?.uid) {
      const storageRef = ref(storage, `volunteerphoto/${user.uid}/profilePicture`);
      try {
        await deleteObject(storageRef);
        setProfile((prevProfile) => ({ ...prevProfile, profilePicture: '' }));
        await updateUser({ ...profile, profilePicture: '' });
        alert('Profile picture deleted successfully!');
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
    }
  };

  const handleAddPincode = () => {
    setProfile((prevProfile) => ({ ...prevProfile, pincodes: [...prevProfile.pincodes, ''] }));
  };

  const handlePincodeChange = (index, value) => {
    const updatedPincodes = profile.pincodes.map((pin, i) => (i === index ? value : pin));
    setProfile((prevProfile) => ({ ...prevProfile, pincodes: updatedPincodes }));
  };

  const handleRemovePincode = async (index) => {
    const updatedPincodes = profile.pincodes.filter((_, i) => i !== index);
    setProfile((prevProfile) => ({ ...prevProfile, pincodes: updatedPincodes }));

    // Update Firestore to save changes immediately after removing pincode
    const docRef = doc(db, 'volunteers', user.uid);
    try {
      await updateDoc(docRef, { pincodes: updatedPincodes });
      console.log("Pincode removed successfully");
    } catch (error) {
      console.error("Error removing pincode:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-white font-bold text-lg">ZeroHunger</div>
        <div>
          <Link to="/" className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
            Sign out as Volunteer
          </Link>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/volunteer/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/volunteer/tasks" className="hover:bg-blue-600 p-2 rounded">My Tasks</Link>
            <Link to="/volunteer/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow ml-64 p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Volunteer Profile</h1>

          <div className="bg-white shadow rounded-lg p-6 flex">
            {/* Profile Icon and Basic Info */}
            <div className="w-1/3 flex flex-col items-center">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl mb-4" />
              )}
              <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
              <p className="text-gray-700 mb-2">{profile.role}</p>

              {/* Upload and Delete Profile Picture Buttons */}
              <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" id="uploadInput" />
              <label
                htmlFor="uploadInput"
                className={`${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded cursor-pointer transition mb-2`}
              >
                {uploading ? 'Uploading...' : 'Upload Profile Picture'}
              </label>
              {profile.profilePicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-2"
                >
                  Delete Profile Picture
                </button>
              )}
            </div>

            {/* Editable User Info */}
            <div className="w-2/3 ml-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
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
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={profile.mobile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pincode(s)</label>
                  {profile.pincodes.map((pin, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={pin}
                        onChange={(e) => handlePincodeChange(index, e.target.value)}
                        disabled={!isEditing}
                        className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2 mr-2`}
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleRemovePincode(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={handleAddPincode}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                    >
                      + Add Pincode
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                />
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;