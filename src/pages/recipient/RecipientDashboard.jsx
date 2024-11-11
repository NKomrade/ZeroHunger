import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

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

const RecipientNavbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-white font-bold text-lg">ZeroHunger</div>
      <div>
        <Link to="/" className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
          Sign out as Recipient
        </Link>
      </div>
    </nav>
  );
};

const RecipientDashboard = () => {
  const location = useLocation();
  const acceptedFood = location.state?.acceptedFood || null;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure `acceptedFood` is only added once by checking both `id` and `orderDate`
    if (acceptedFood) {
      const currentDate = new Date().toISOString().split('T')[0];
      const uniqueKey = `${acceptedFood.id}-${currentDate}`;

      if (!requests.some(request => request.uniqueKey === uniqueKey)) {
        const newRequest = {
          ...acceptedFood,
          orderDate: currentDate,
          status: 'Pending',
          uniqueKey, // Add a truly unique key for each request
        };
        setRequests(prevRequests => [...prevRequests, newRequest]);
      }
    }
    setLoading(false);
  }, [acceptedFood, requests]);

  // Toggle the status of a request
  const toggleStatus = (id) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id
          ? {
              ...request,
              status: request.status === 'Pending' ? 'Delivered' : 'Pending',
            }
          : request
      )
    );
  };

  // Reject a request and remove it from Firestore
  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, `recipients/${location.state?.recipientId}/availablefood`, id));
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      console.log(`Request with id ${id} has been removed from Firestore.`);
    } catch (error) {
      console.error(`Error removing request: ${error}`);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <RecipientNavbar />
      <div className="flex flex-grow">
        <RecipientSidebar />
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Recipient Dashboard</h1>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">My Requests</h2>
            <div className="bg-gray-50 shadow rounded-lg p-4">
              {requests.length === 0 ? (
                <p>No requests yet.</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-left">
                      <th className="border-b py-2 px-4">Order Date</th>
                      <th className="border-b py-2 px-4">Food Name</th>
                      <th className="border-b py-2 px-4">Food Type</th>
                      <th className="border-b py-2 px-4">Quantity</th>
                      <th className="border-b py-2 px-4">Donor Name</th>
                      <th className="border-b py-2 px-4">Pincode</th>
                      <th className="border-b py-2 px-4">Status</th>
                      <th className="border-b py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.uniqueKey} className="border-t">
                        <td className="py-2 px-4">{request.orderDate}</td>
                        <td className="py-2 px-4">{request.foodName}</td>
                        <td className="py-2 px-4">{request.foodType}</td>
                        <td className="py-2 px-4">{request.quantity}</td>
                        <td className="py-2 px-4">{request.donorName}</td>
                        <td className="py-2 px-4">{request.pincode}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => toggleStatus(request.id)}
                            className={`px-4 py-2 rounded ${
                              request.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                            } text-white hover:opacity-75`}
                          >
                            {request.status}
                          </button>
                        </td>
                        <td className="py-2 px-4 space-x-2">
                          <button
                            onClick={() => handleReject(request.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
