import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUserContext } from '../context/usercontext';

export default function RecipientSignup() {
  const navigate = useNavigate();
  const { handleSignup } = useUserContext();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '+91',
    email: '',
    password: '',
    organizationName: '',
    address: '',
    pincode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // State to store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedValue = value;

      // Maintain +91 prefix for mobile
      if (name === 'mobile' && value.length <= 13) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await handleSignup('Recipient', formData);
      navigate('/recipient/dashboard'); // Redirect to Recipient Dashboard after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Back Arrow at Top Left */}
        <button onClick={() => navigate("/")} className="absolute top-10 left-8 text-gray-600">
          <FaArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-neutral-900 text-center">
          Recipient Signup
        </h2>

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
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
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
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 pt-7 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Organization Name Field */}
            <div className="col-span-1 md:col-span-2 mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="organizationName">
                Organization Name
              </label>
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
              {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
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
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Pincode Field */}
            <div className="col-span-1 md:col-span-2 mb-4">
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
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}