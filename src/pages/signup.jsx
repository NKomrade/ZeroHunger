import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom for navigation

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg"><Link to="/">ZeroHunger</Link></div>
      <div>
        <Link to="/" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Home</Link>
        <Link to="/Donate" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Donate</Link>
        <Link to="/About" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">About</Link>
        <Link to="/Contact" className="text-white mx-2 hover:underline hover:text-blue-200 transition duration-200">Contact</Link>
        <Link to="/Login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
        <Link to="/Signup" className="bg-yellow-100 text-neutral-800 px-4 py-2 rounded-full hover:bg-yellow-200 transition duration-200">Sign up</Link>
      </div>
    </nav>
  );
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    mobile: '',
    email: '',
    password: '',
    venueName: '',
    address: '',
    fssaiNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-yellow-100 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-blue-500 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="role">Select Your Role</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            >
              <option value="" disabled>Select your role</option>
              <option value="Donor">Donor</option>
              <option value="Recipient">Recipient</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="venueName">Name of the Venue</label>
            <input
              type="text"
              name="venueName"
              id="venueName"
              value={formData.venueName}
              onChange={handleChange}
              placeholder="Enter the name of the venue"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="address">Address</label>
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

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="fssaiNumber">FSSAI Number</label>
            <input
              type="text"
              name="fssaiNumber"
              id="fssaiNumber"
              value={formData.fssaiNumber}
              onChange={handleChange}
              placeholder="Enter your FSSAI number"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;