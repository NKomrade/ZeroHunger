import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Donation History
const mockDonationHistory = [
  {
    id: 1,
    date: '2024-10-01',
    foodType: 'Vegetables',
    quantity: '10 kg',
    status: 'Delivered',
  },
  {
    id: 2,
    date: '2024-09-25',
    foodType: 'Rice',
    quantity: '5 kg',
    status: 'In Transit',
  },
  {
    id: 3,
    date: '2024-09-20',
    foodType: 'Bread',
    quantity: '20 loaves',
    status: 'Delivered',
  },
];

export const Sidebar = () => {
  return (
    <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4" style={{ top: '60px' }}>
      <nav className="flex flex-col space-y-4">
        <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">
          Dashboard Overview
        </Link>
        <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">
          Donation History
        </Link>
        <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">
          Schedule Donation
        </Link>
        <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">
          Profile
        </Link>
      </nav>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-500 p-4 flex justify-between items-center z-30">
      <div className="text-white font-bold text-lg">
        <Link to="/">ZeroHunger</Link>
      </div>
      <div>
        <Link to="/" className="text-white mx-2 hover:underline transition duration-200">Home</Link>
        <Link to="/donate" className="text-white mx-2 hover:underline transition duration-200">Donate</Link>
        <Link to="/about" className="text-white mx-2 hover:underline transition duration-200">About</Link>
        <Link to="/contact" className="text-white mx-2 hover:underline transition duration-200">Contact</Link>
        <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">
          Log in
        </Link>
        <Link to="/signup" className="bg-white text-neutral-800 px-4 py-2 rounded-full hover:bg-neutral-200 transition duration-200">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

// DonorDashboard Component
const DonorDashboard = () => {
  const [donationHistory, setDonationHistory] = useState(mockDonationHistory);
  const [newDonation, setNewDonation] = useState({
    foodType: '',
    quantity: '',
    date: '',
  });

  // Handle form input for new donation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDonation({
      ...newDonation,
      [name]: value,
    });
  };

  // Handle submission of new donation
  const handleSubmit = (e) => {
    e.preventDefault();
    setDonationHistory([
      ...donationHistory,
      { ...newDonation, id: donationHistory.length + 1, status: 'Pending' },
    ]);
    setNewDonation({
      foodType: '',
      quantity: '',
      date: '',
    });
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Navbar /> {/* Navbar at the top */}
      <Sidebar /> {/* Sidebar on the left */}

      {/* Main Content Section */}
      <div className="flex-grow ml-64 mt-16 p-6 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-500">Donor Dashboard Overview</h1>

        {/* Donation History Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Donation History</h2>
          <div className="bg-gray-50 shadow rounded-lg p-4">
            {donationHistory.length === 0 ? (
              <p>No donations yet.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left">
                    <th className="border-b py-2 px-4">Date</th>
                    <th className="border-b py-2 px-4">Food Type</th>
                    <th className="border-b py-2 px-4">Quantity</th>
                    <th className="border-b py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((donation) => (
                    <tr key={donation.id} className="border-t">
                      <td className="py-2 px-4">{donation.date}</td>
                      <td className="py-2 px-4">{donation.foodType}</td>
                      <td className="py-2 px-4">{donation.quantity}</td>
                      <td className="py-2 px-4">{donation.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Schedule a New Donation */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">Schedule a New Donation</h2>
          <form onSubmit={handleSubmit} className="bg-gray-50 shadow rounded-lg p-6">
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
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;