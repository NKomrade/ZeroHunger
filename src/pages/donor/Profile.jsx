import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';  // Importing the React Icon

// Mock user data
const mockUserData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '(239) 816-9029',
  mobile: '(320) 380-4539',
  address: 'Bay Area, San Francisco, CA',
  profilePicture: '', // Placeholder, empty value for now
};

const Profile = () => {
  const [user, setUser] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change for user details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Toggle editing mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to="/">ZeroHunger</Link>
        </div>
        <div>
          <Link to="/" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Home</Link>
          <Link to="/donate" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Donate</Link>
          <Link to="/about" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">About</Link>
          <Link to="/contact" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Contact</Link>
          <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Login</Link>
          <Link to="/signup" className="bg-yellow-100 text-neutral-800 px-4 py-2 rounded-full hover:bg-yellow-200 transition duration-200">Sign up</Link>
        </div>
      </nav>

      <div className="flex bg-yellow-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
          <h2 className="text-2xl font-bold mb-6">Donor Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">Donation History</Link>
            <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">Schedule Donation</Link>
            <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Profile</h1>

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg p-6 flex">
            {/* Left Section: Profile Icon and Basic Info */}
            <div className="w-1/3 flex flex-col items-center">
              {/* Profile Icon (React Icon) */}
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
              <p className="text-gray-700">Full Stack Developer</p>
              <p className="text-gray-700">{user.address}</p>
            </div>

            {/* Right Section: Editable User Info */}
            <div className="w-2/3 ml-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
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
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border ${isEditing ? 'bg-white' : 'bg-gray-100'} rounded p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={user.mobile || ''}
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
                  value={user.address}
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

export default Profile;