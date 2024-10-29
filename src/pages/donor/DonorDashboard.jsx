import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Donation History
const mockDonationHistory = [
  { id: 1, date: '2024-10-01', foodType: 'Vegetables', quantity: '10 kg', status: 'Delivered' },
  { id: 2, date: '2024-09-25', foodType: 'Rice', quantity: '5 kg', status: 'In Transit' },
  { id: 3, date: '2024-09-20', foodType: 'Bread', quantity: '20 loaves', status: 'Delivered' },
];

export const Sidebar = () => (
  <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4" style={{ top: '60px' }}>
    <nav className="flex flex-col space-y-4">
      <Link to="/donor/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
      <Link to="/donor/history" className="hover:bg-blue-600 p-2 rounded">Donation History</Link>
      <Link to="/donor/new-donation" className="hover:bg-blue-600 p-2 rounded">Schedule Donation</Link>
      <Link to="/donor/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
    </nav>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-blue-500 p-4 flex justify-between items-center z-30">
    <div className="text-white font-bold text-lg">ZeroHunger</div>
    <div>
      <Link to="/" className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
        Sign out as Donor
      </Link>
    </div>
  </nav>
);

const DonorDashboard = () => {
  const [donationHistory, setDonationHistory] = useState(mockDonationHistory);
  const [newDonation, setNewDonation] = useState({
    foodName: '',
    foodType: '',
    quantity: '',
    foodImage: null,
    timeFrom: '',
    timeTo: '',
    address: '',
    pincode: '',
    contactNumber: '',
    donatorName: '',
    donatorEmail: '',
    instructions: '',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewDonation({
      ...newDonation,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDonationHistory([...donationHistory, { ...newDonation, id: donationHistory.length + 1, status: 'Pending' }]);
    setNewDonation({
      foodName: '',
      foodType: '',
      quantity: '',
      foodImage: null,
      timeFrom: '',
      timeTo: '',
      address: '',
      pincode: '',
      contactNumber: '',
      donatorName: '',
      donatorEmail: '',
      instructions: '',
    });
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Navbar />
      <Sidebar />
      <div className="flex-grow ml-64 mt-16 p-6 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-500">Donor Dashboard Overview</h1>

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

        <div>
          <h2 className="text-3xl font-semibold mb-4">Schedule a New Donation</h2>
          <form onSubmit={handleSubmit} className="bg-gray-50 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'foodName', label: 'Food Name', placeholder: 'Enter the food name' },
                { id: 'foodType', label: 'Food Type', placeholder: 'Enter the food type' },
                { id: 'quantity', label: 'Quantity', placeholder: 'Enter the quantity' },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium mb-2">{field.label}</label>
                  <input
                    type="text"
                    id={field.id}
                    name={field.id}
                    value={newDonation[field.id]}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

              <div>
                <label htmlFor="foodImage" className="block text-sm font-medium mb-2">Upload Food Image</label>
                <input
                  type="file"
                  id="foodImage"
                  name="foodImage"
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              {[
                { id: 'timeFrom', label: 'Pickup Time (From)' },
                { id: 'timeTo', label: 'Pickup Time (To)' },
                { id: 'address', label: 'Address', placeholder: 'Enter the address' },
                { id: 'pincode', label: 'Pincode', placeholder: 'Enter the pincode' },
                { id: 'contactNumber', label: 'Contact Number', placeholder: 'Enter your contact number' },
                { id: 'donatorName', label: 'Donator Name', placeholder: 'Enter your name' },
                { id: 'donatorEmail', label: 'Donator Email', placeholder: 'Enter your email' },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium mb-2">{field.label}</label>
                  <input
                    type={field.id.includes('time') ? 'time' : 'text'}
                    id={field.id}
                    name={field.id}
                    value={newDonation[field.id]}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder={field.placeholder || ''}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label htmlFor="instructions" className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                id="instructions"
                name="instructions"
                value={newDonation.instructions}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                rows="3"
                placeholder="Enter any additional notes"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 transition duration-200"
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