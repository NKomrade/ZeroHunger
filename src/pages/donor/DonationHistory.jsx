import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock Donation History Data
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

// Sidebar Component (Same as in DonorDashboard)
const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Donor Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
        <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">Donation History</Link>
        <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">Schedule Donation</Link>
        <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
      </nav>
    </div>
  );
};

// Navbar Component (Same as in DonorDashboard)
const Navbar = () => {
  return (
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
  );
};

// DonationHistory Component
const DonationHistory = () => {
  const [donationHistory, setDonationHistory] = useState([]);

  // Simulating fetching data from backend
  useEffect(() => {
    setDonationHistory(mockDonationHistory);
  }, []);

  return (
    <div className="bg-yellow-100 min-h-screen">
      <Navbar /> {/* Navbar at the top */}
      <div className="flex">
        <Sidebar /> {/* Sidebar on the left */}
        <div className="flex-grow p-6">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Donation History</h1>
          <div className="bg-gray-50 shadow rounded-lg p-4">
            {donationHistory.length === 0 ? (
              <p>No donations found.</p>
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
      </div>
    </div>
  );
};

export default DonationHistory;