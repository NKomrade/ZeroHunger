import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ScheduleDonation Component
const ScheduleDonation = () => {
  const [newDonation, setNewDonation] = useState({
    foodType: '',
    quantity: '',
    date: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDonation({
      ...newDonation,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real-world scenario, you would send this data to your backend.
    console.log('Donation scheduled:', newDonation);
    setSuccessMessage('Your donation has been successfully scheduled!');
    // Clear the form after submission
    setNewDonation({
      foodType: '',
      quantity: '',
      date: '',
    });
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
          <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
          <Link to="/signup" className="bg-yellow-100 text-neutral-800 px-4 py-2 rounded-full hover:bg-yellow-200 transition duration-200">Sign up</Link>
        </div>
      </nav>

      <div className="flex">
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
        <div className="flex-grow p-6 bg-yellow-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Schedule a New Donation</h1>
          <div className="bg-gray-50 shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="foodType">
                  Food Type
                </label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  value={newDonation.foodType}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 placeholder-gray-400"
                  placeholder="Enter the type of food"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={newDonation.quantity}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 placeholder-gray-400"
                  placeholder="Enter the quantity"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="date">
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newDonation.date}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 placeholder-gray-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Schedule Donation
              </button>
            </form>
            {successMessage && (
              <p className="text-blue-600 font-semibold mt-4">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDonation;