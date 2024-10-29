import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Recipient Requests and Available Foods
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

// Mock Data for Available Foods
const mockAvailableFoods = [
  {
    id: 1,
    foodType: 'Rice',
    quantity: '5 kg',
    location: 'Warehouse A',
    expiryDate: '2024-12-01',
    donatorName: 'John Doe',
    image: '/rice.jpg', // Assuming images are in the public/images folder
  },
  {
    id: 2,
    foodType: 'Bread',
    quantity: '20 loaves',
    location: 'Warehouse B',
    expiryDate: '2024-10-30',
    donatorName: 'Jane Smith',
    image: '/bread.jpg',
  },
  {
    id: 3,
    foodType: 'Canned Food',
    quantity: '30 cans',
    location: 'Warehouse C',
    expiryDate: '2025-01-15',
    donatorName: 'Alice Johnson',
    image: '/canned_food.jpg',
  },
];

// Sidebar for Recipient Dashboard
const RecipientSidebar = () => {
  return (
    <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
      <nav className="flex flex-col space-y-4">
        <Link to="/recipient/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
        <Link to="/recipient/request" className="hover:bg-blue-600 p-2 rounded">Available Food</Link>
        <Link to="/recipient/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
      </nav>
    </div>
  );
};

// Navbar Component
const RecipientNavbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-white font-bold text-lg">
          ZeroHunger
        </div>
        <div>
          <Link to="/" className=" text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
            Sign out as Recipient
          </Link>
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
    <div className="flex flex-col min-h-screen">
      <RecipientNavbar /> {/* Navbar at the top */}
      <div className="flex flex-grow">
        <RecipientSidebar /> {/* Sidebar on the left */}
        <div className="flex-grow p-6 ml-64"> {/* Add margin-left for sidebar */}
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

          {/* Available Foods Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-4">Available Foods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAvailableFoods.map((food) => (
                <div key={food.id} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                  <img src={food.image} alt={food.foodType} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{food.foodType}</h3>
                    <p className="text-gray-600">Quantity: {food.quantity}</p>
                    <p className="text-gray-600">Location: {food.location}</p>
                    <p className="text-gray-600">Expiry Date: {food.expiryDate}</p>
                    <p className="text-gray-600">Donator: {food.donatorName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;