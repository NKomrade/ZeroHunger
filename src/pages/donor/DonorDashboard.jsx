import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const db = getFirestore();

const Sidebar = () => {
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
      <div className="text-white font-bold text-lg">ZeroHunger</div>
      <div>
        <Link to="/" className=" text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
          Sign out as Donor
        </Link>
      </div>
    </nav>
  );
};

const DonorDashboard = () => {
  const { user } = useUserContext();
  const [donationHistory, setDonationHistory] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    if (!user) return;

    const donorScheduleRef = collection(db, `donors/${user.uid}/donorschedule`);

    const unsubscribe = onSnapshot(donorScheduleRef, (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDonationHistory(donations);
      calculateMonthlyData(donations);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate monthly donation amounts
  const calculateMonthlyData = (donations) => {
    const data = {};

    donations.forEach((donation) => {
      const date = new Date(donation.date); // Ensure date is parsed correctly
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const quantity = parseInt(donation.quantity) || 0;

      if (data[month]) {
        data[month] += quantity;
      } else {
        data[month] = quantity;
      }
    });

    setMonthlyData(data);
  };

  const toggleStatus = async (donationId, currentStatus) => {
    const newStatus = currentStatus === 'Delivered' ? 'In Transit' : 'Delivered';
    const donationDocRef = doc(db, `donors/${user.uid}/donorschedule`, donationId);

    try {
      await updateDoc(donationDocRef, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Prepare data for Bar Chart
  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Quantity Donated (kg)',
        data: Object.values(monthlyData),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Donation History</h1>
          <div className="bg-gray-50 shadow rounded-lg p-4 mb-6">
            {donationHistory.length === 0 ? (
              <p>No donations found.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left">
                    <th className="border-b py-2 px-4">Date</th>
                    <th className="border-b py-2 px-4">Food Name</th>
                    <th className="border-b py-2 px-4">Food Type</th>
                    <th className="border-b py-2 px-4">Quantity</th>
                    <th className="border-b py-2 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((donation) => (
                    <tr key={donation.id} className="border-t">
                      <td className="py-2 px-4">{donation.date}</td>
                      <td className="py-2 px-4">{donation.foodName}</td>
                      <td className="py-2 px-4">{donation.foodType}</td>
                      <td className="py-2 px-4">{donation.quantity}</td>
                      <td className="py-2 px-4">
                        <span>{donation.status}</span>
                        <button
                          onClick={() => toggleStatus(donation.id, donation.status)}
                          className="ml-4 text-blue-600 hover:underline"
                        >
                          {donation.status === 'Delivered' ? 'Mark as In Transit' : 'Mark as Delivered'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="bg-gray-50 shadow rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">Monthly Donation Summary</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }}}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;