import React, { useState, useEffect } from 'react';

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

// DonationHistory Component
const DonationHistory = () => {
  const [donationHistory, setDonationHistory] = useState([]);

  // Simulating fetching data from backend
  useEffect(() => {
    setDonationHistory(mockDonationHistory);
  }, []);

  return (
    <div>
      <nav className="bg-green-600 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-lg">ZeroHunger</div>
        <div>
          <a href="/" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Home</a>
          <a href="/donate" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Donate</a>
          <a href="/about" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">About</a>
          <a href="/contact" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Contact</a>
          <a href="/login" className="text-white mx-2 hover:bg-green-500 transition duration-200 rounded-full px-4 py-2">Log in</a>
          <a href="/signup" className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-green-200 transition duration-200">Sign up</a>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-green-600 text-white h-screen flex flex-col p-4">
          <h2 className="text-2xl font-bold mb-6">Donor Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <a href="/donor/dashboard" className="hover:bg-green-700 p-2 rounded">Dashboard Overview</a>
            <a href="/donor/history" className="hover:bg-green-700 p-2 rounded">Donation History</a>
            <a href="/donor/new-donation" className="hover:bg-green-700 p-2 rounded">Schedule Donation</a>
            <a href="/profile" className="hover:bg-green-700 p-2 rounded">Profile</a>
          </nav>
        </div>

        <div className="flex-grow p-6">
          <h1 className="text-3xl font-bold mb-6 text-green-600">Donation History</h1>
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