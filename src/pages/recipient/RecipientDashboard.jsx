import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Recipient Requests
const mockRecipientRequests = [
  {
    id: 1,
    date: '2024-10-01',
    foodType: 'Rice',
    quantity: '5 kg',
    status: 'Delivered',
  },
  {
    id: 2,
    date: '2024-09-25',
    foodType: 'Bread',
    quantity: '10 loaves',
    status: 'In Progress',
  },
  {
    id: 3,
    date: '2024-09-20',
    foodType: 'Canned Food',
    quantity: '15 cans',
    status: 'Pending',
  },
];

// Sidebar for Recipient Dashboard
const RecipientSidebar = () => {
  return (
    <div className="w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Recipient Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/recipient/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
        <Link to="/recipient/requests" className="hover:bg-blue-600 p-2 rounded">My Requests</Link>
        <Link to="/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
      </nav>
    </div>
  );
};

// Navbar Component
const RecipientNavbar = () => {
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

// RecipientDashboard Component
const RecipientDashboard = () => {
  const [requests, setRequests] = useState(mockRecipientRequests);
  const [newRequest, setNewRequest] = useState({
    foodType: '',
    quantity: '',
    date: '',
  });

  // Handle input for new request
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({
      ...newRequest,
      [name]: value,
    });
  };

  // Handle submission of new request
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    setRequests([
      ...requests,
      { ...newRequest, id: requests.length + 1, status: 'Pending' },
    ]);
    setNewRequest({
      foodType: '',
      quantity: '',
      date: '',
    });
  };

  return (
    <div>
      <RecipientNavbar /> {/* Navbar at the top */}
      <div className="flex bg-yellow-100">
        <RecipientSidebar /> {/* Sidebar on the left */}
        <div className="flex-grow p-6">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Recipient Dashboard</h1>

          {/* Request History Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">My Requests</h2>
            <div className="bg-gray-50 shadow rounded-lg p-4">
              {requests.length === 0 ? (
                <p>No requests yet.</p>
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
                    {requests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="py-2 px-4">{request.date}</td>
                        <td className="py-2 px-4">{request.foodType}</td>
                        <td className="py-2 px-4">{request.quantity}</td>
                        <td className="py-2 px-4">{request.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-4">Request New Food Donation</h2>
            <form onSubmit={handleSubmit} className="bg-gray-50 shadow rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="foodType">
                  Food Type
                </label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  value={newRequest.foodType}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
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
                  value={newRequest.quantity}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  placeholder="Enter the quantity"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="date">
                  Request Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newRequest.date}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;