import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/usercontext';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DonorSignup({ setUserRole }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState({}); // Error state for individual fields
  const { handleSignup } = useUserContext(); // Access handleSignup from context
  const [formData, setFormData] = useState({
    role: 'Donor',
    name: '',
    mobile: '+91',
    email: '',
    password: '',
    organizationName: '',
    address: '',
    pincode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedValue = value;

      if (name === 'mobile' && value.length <= 13) {
        // Ensure +91 prefix is maintained
        if (!value.startsWith('+91')) {
          updatedValue = '+91' + value.replace('+91', '');
        }
      }

      return { ...prevData, [name]: updatedValue };
    });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must only contain letters and spaces.';
    }
    if (!/^\+91[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits with +91 prefix.';
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid Gmail address (e.g., user@gmail.com).';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.';
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0; // No errors mean valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({}); // Clear previous errors

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      await handleSignup('Donor', formData, navigate); // Pass navigate as a parameter
      setUserRole('Donor'); // Set the user role after successful signup
    } catch (error) {
      console.error('Error during signup:', error);
      setError({ general: 'An error occurred during signup. Please try again.' });
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

        {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}

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
              {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
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
                placeholder="+91xxxxxxxxxx"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
              {error.mobile && <p className="text-red-500 text-sm">{error.mobile}</p>}
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
                placeholder="Enter your Gmail address"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
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
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
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
              {error.organizationName && <p className="text-red-500 text-sm">{error.organizationName}</p>}
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
              {error.pincode && <p className="text-red-500 text-sm">{error.pincode}</p>}
            </div>

            {/* Address Field */}
            <div className="col-span-1 md:col-span-2 mb-4">
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
              {error.address && <p className="text-red-500 text-sm">{error.address}</p>}
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