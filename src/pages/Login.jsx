import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

// Navbar Component
const Navbar = () => (
  <nav className="bg-blue-500 p-4 flex justify-between items-center">
    <div className="text-white font-bold text-lg">
      <Link to="/">ZeroHunger</Link>
    </div>
    <div>
      <Link to="/" className="text-white mx-2 hover:underline transition duration-200">Home</Link>
      <Link to="/about" className="text-white mx-2 hover:underline transition duration-200">About</Link>
      <Link to="/contact" className="text-white mx-2 hover:underline transition duration-200">Contact</Link>
      <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
    </div>
  </nav>
);

// Signup Component with Role Selection and Simple Inputs
const Login = () => {
  const [formData, setFormData] = useState({
    role: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [step, setStep] = useState(1); // Track the current step

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2); // Proceed to next step after selecting role
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        {step === 1 && (
          <>
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">Welcome Back!</h2>
            <h2 className="text-2xl mb-4 text-neutral-900">Log in as:</h2>
            <div className="mb-4 flex justify-between">
              <button
                onClick={() => handleRoleSelect('Donor')}
                className="flex-1 mr-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Donor
              </button>
              <button
                onClick={() => handleRoleSelect('Recipient')}
                className="flex-1 mr-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Recipient
              </button>
              <button
                onClick={() => handleRoleSelect('Volunteer')}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
              >
                Volunteer
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-neutral-900">
              Log in as {formData.role}
            </h2>
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
                  placeholder="Create a password"
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mr-2 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;