import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUserContext } from '../context/usercontext';

export default function RecipientSignup() {
  const navigate = useNavigate();
  const { handleSignup } = useUserContext();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    organizationName: '',
    address: '',
    pincode: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use context's handleSignup with 'Recipient' role
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
            {['name', 'mobile'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-neutral-900 mb-1" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>
            ))}

            {/* Email and Password fields in the same row */}
            <div className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="email">
                Email
              </label>
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

            <div className="mb-4 relative">
              <label className="block text-neutral-900 mb-1" htmlFor="password">
                Password
              </label>
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
            </div>

            {/* Organization Name field */}
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
            </div>

            {/* Address field spanning across two columns */}
            <div className="col-span-1 md:col-span-2 mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="address">
                Address
              </label>
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

            {/* Single Pincode field */}
            <div className="col-span-1 md:col-span-2 mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor="pincode">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter your preferred pincode"
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
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