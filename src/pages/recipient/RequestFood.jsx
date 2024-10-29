import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Food Donation Requests
const mockFoodRequests = [
  {
    id: 1,
    foodType: 'Rice',
    quantity: '5 kg',
    location: 'Warehouse A',
    expiryDate: '2024-12-01',
    donatorName: 'John Doe',
    status: 'Pending',
    image: '/rice.jpg', // Assuming images are in the public/images folder
  },
  {
    id: 2,
    foodType: 'Bread',
    quantity: '20 loaves',
    location: 'Warehouse B',
    expiryDate: '2024-10-30',
    donatorName: 'Jane Smith',
    status: 'Pending',
    image: '/bread.jpg',
  },
  {
    id: 3,
    foodType: 'Canned Food',
    quantity: '30 cans',
    location: 'Warehouse C',
    expiryDate: '2025-01-15',
    donatorName: 'Alice Johnson',
    status: 'Pending',
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

// RequestFood Component
const RequestFood = () => {
  const [foodRequests] = useState(mockFoodRequests);

  return (
    <div className="flex flex-col min-h-screen">
      <RecipientNavbar /> {/* Navbar at the top */}
      <div className="flex flex-grow">
        <RecipientSidebar /> {/* Sidebar on the left */}
        <div className="flex-grow p-6 ml-64"> {/* Add margin-left for sidebar */}
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Food Donation Requests</h1>

          {/* Food Requests Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-4">Pending Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                  <img src={request.image} alt={request.foodType} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{request.foodType}</h3>
                    <p className="text-gray-600">Quantity: {request.quantity}</p>
                    <p className="text-gray-600">Location: {request.location}</p>
                    <p className="text-gray-600">Expiry Date: {request.expiryDate}</p>
                    <p className="text-gray-600">Donator: {request.donatorName}</p>
                    <p className="text-gray-600">Status: {request.status}</p>
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

export default RequestFood;
