import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function DonorSignup() {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const [formData, setFormData] = useState({
    role: 'Donor',
    name: '',
    mobile: '',
    email: '',
    password: '',
    venueName: '',
    address: '',
    pincode: '',
    fssaiNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    // Add logic to send data to the backend if required.

    // Redirect to Donor Dashboard after successful submission
    navigate('/donor/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-neutral-900 text-center">
          Donor Signup
        </h2>
        <form onSubmit={handleSubmit}>
          {['name', 'mobile', 'email', 'password', 'venueName', 'address', 'pincode', 'fssaiNumber'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}