import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useUserContext } from '../context/usercontext'; // Import Context to access user data

const storage = getStorage();

const RecipientProfile = () => {
  const { user, loading, updateUser } = useUserContext(); // Access user, loading, and updateUser from context

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    pincode: user?.pincode || '',
    address: user?.address || '',
    role: user?.role || 'Recipient',
    profilePicture: user?.profilePicture || '', // Load initial profile picture if available
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Update local state with user data when the user context updates
  useEffect(() => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      pincode: user?.pincode || '',
      address: user?.address || '',
      role: user?.role || 'Recipient',
      profilePicture: user?.profilePicture || '',
    }));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleEditClick = () => {
    if (isEditing) {
      // Save updated data to Firestore and context
      updateUser(profile)
        .then(() => alert('Profile updated successfully!'))
        .catch((error) => console.error('Error updating profile:', error));
    }
    setIsEditing(!isEditing);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user?.uid) {
      setUploading(true);
      const storageRef = ref(storage, `recipientphoto/${user.uid}/profilePicture`);
      try {
        await uploadBytes(storageRef, file);
        const profilePictureURL = await getDownloadURL(storageRef);
  
        // Use updateUser to save profile picture URL
        await updateUser({ profilePicture: profilePictureURL });
        
        // Update local profile state for immediate UI feedback
        setProfile((prevProfile) => ({ ...prevProfile, profilePicture: profilePictureURL }));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setUploading(false);
      }
    }
  };  

  const handleDeleteProfilePicture = async () => {
    if (user?.uid) {
      const storageRef = ref(storage, `recipientphoto/${user.uid}/profilePicture`);
      try {
        await deleteObject(storageRef);
        
        // Use updateUser to remove profile picture URL
        await updateUser({ profilePicture: '' });
        
        setProfile((prevProfile) => ({ ...prevProfile, profilePicture: '' }));
        alert('Profile picture deleted successfully!');
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
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
            Sign out as Recipient
          </Link>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="fixed w-64 bg-blue-500 text-white h-[calc(100vh-60px)] p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/recipient/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/recipient/request" className="hover:bg-blue-600 p-2 rounded">Available Food</Link>
            <Link to="/recipient/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow ml-64 p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Recipient Profile</h1>

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg p-6 flex">
            {/* Profile Icon and Details */}
            <div className="w-1/3 flex flex-col items-center">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
              ) : (
                <FaUserCircle className="text-gray-400 text-6xl mb-4" />
              )}
              <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
              <p className="text-gray-700 mb-2">{profile.role}</p>

              {/* Upload and Delete Photo Buttons */}
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

            {/* User Info */}
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
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
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
                  <label className="block text-sm font-medium mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
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

export default RecipientProfile;