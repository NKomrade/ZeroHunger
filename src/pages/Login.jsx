import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom for navigation

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg"><Link to="/">ZeroHunger</Link></div>
      <div>
        <Link to="/" className="text-white mx-2 hover:underline hover: transition duration-200">Home</Link>
        <Link to="/donate" className="text-white mx-2 hover:underline hover: transition duration-200">Donate</Link>
        <Link to="/about" className="text-white mx-2 hover:underline hover: transition duration-200">About</Link>
        <Link to="/contact" className="text-white mx-2 hover:underline hover: transition duration-200">Contact</Link>
        <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
        <Link to="/signup" className="bg-white text-neutral-800 px-4 py-2 rounded-full hover:bg-neutral-200 transition duration-200">Sign up</Link>
      </div>
    </nav>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '', // Added phone number field
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
    // Handle login submission logic here
    console.log('Login submitted:', formData);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-neutral-900 mb-1" htmlFor="mobile">Mobile Number</label>
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
            <label className="block text-neutral-900 mb-1" htmlFor="email">Email</label>
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
            <label className="block text-neutral-900 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded p-2 placeholder-gray-400"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;