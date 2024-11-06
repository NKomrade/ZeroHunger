import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/usercontext';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DonorSignup({ setUserRole }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const { handleSignup } = useUserContext(); // Access handleSignup from context
  const [formData, setFormData] = useState({
    role: 'Donor',
    name: '',
    mobile: '',
    email: '',
    password: '',
    organizationName: '',
    address: '',
    pincode: '',
    fssaiNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleSignup('Donor', formData, navigate); // Pass navigate as a parameter
      setUserRole('Donor'); // Set the user role after successful signup
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        <button onClick={() => navigate("/")} className="absolute top-10 left-8 text-gray-600">
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-neutral-900 text-center">
          Donor Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="name">Name</label>
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

            {/* Mobile Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="mobile">Mobile</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Email Field */}
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

            {/* Password Field with Toggle Icon */}
            <div className="mb-4 relative">
              <label className="block text-neutral-900 mb-1" htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Organization Name Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="organizationName">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                id="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter your organization name"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Pincode Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="pincode">Pincode</label>
              <input
                type="text"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your pincode"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="address">Address</label>
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

            {/* FSSAI Number Field */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="fssaiNumber">FSSAI Number</label>
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
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4"
          >
           {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}