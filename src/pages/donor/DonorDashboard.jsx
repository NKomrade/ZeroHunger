import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';
import { Bar } from 'react-chartjs-2';
import Certificate from './donorcertificate';
import Confetti from 'react-confetti';
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
  const [monthlyDonationCount, setMonthlyDonationCount] = useState(0);
  const [certificateEligible, setCertificateEligible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false); // State for modal visibility
  const [milestone, setMilestone] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        const donorScheduleRef = collection(db, `donors/${user.uid}/donorschedule`);
        const donorNotificationsRef = collection(db, `donors/${user.uid}/notifications`);

        const scheduleSnapshot = await getDocs(donorScheduleRef);
        const notificationSnapshot = await getDocs(donorNotificationsRef);

        // Create a lookup table for notifications
        const notifications = {};
        notificationSnapshot.forEach((doc) => {
          const data = doc.data();
          notifications[doc.id] = {
            recipientName: data.recipientName || 'N/A',
            volunteerName: data.volunteerName || 'N/A',
            foodStatus: data.Foodstatus || '-', // Fetching Foodstatus
          };
        });

        // Merge data from both collections
        const donations = scheduleSnapshot.docs.map((doc) => {
          const data = doc.data();
          const notification = notifications[doc.id] || {};
          return {
            id: doc.id,
            ...data,
            recipientName: notification.recipientName,
            volunteerName: notification.volunteerName,
            foodStatus: notification.foodStatus,
          };
        });

        setDonationHistory(donations);
        calculateMonthlyData(donations);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      }
    };

    fetchDonations();
  }, [user]);

  // Calculate monthly donation amounts
  const calculateMonthlyData = (donations) => {
    const data = {};
    let count = 0;

    donations.forEach((donation) => {
      const date = new Date(donation.date); // Ensure date is parsed correctly
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const quantity = parseInt(donation.quantity) || 0;

      if (data[month]) {
        data[month] += quantity;
      } else {
        data[month] = quantity;
      }
      // Count donations for progress
      if (date.getMonth() === new Date().getMonth()) count++;
    });

    setMonthlyData(data);
    setMonthlyDonationCount(count);

    if (count > 0 && count % 5 === 0 && count > milestone){
      setCertificateEligible(true);
      setShowConfetti(true); // Show confetti effect
      setMilestone(newMilestone);

      // Hide confetti after a short delay
      setTimeout(() => setShowConfetti(false), 5000);
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

  // Function to handle opening and closing the certificate modal
  const handleViewCertificate = () => {
    setShowCertificateModal(true); // Show the certificate modal
  };

  const handleCloseModal = () => {
    setShowCertificateModal(false); // Hide the certificate modal
  };

  return (
    <div className="bg-white min-h-screen">
      {showConfetti && <Confetti />}
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Donation Bar</h1>
          <div className="bg-gray-50 shadow rounded-lg p-4 mb-6">
            <div className="mb-4">
                <p>Monthly Donations Progress: {monthlyDonationCount % 5}/5</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(monthlyDonationCount % 5) * 20}%` }}
                  >
                  </div>
                </div>
            </div>
            {certificateEligible && (
              <div className="p-4 mb-6 bg-green-100 border border-green-400 text-green-800 rounded-lg">
                🎉 Congratulations! Your achievement certificate is ready.{' '}
                <button
                  onClick={handleViewCertificate} // Show the modal on click
                  className="underline text-blue-600 hover:text-blue-800 ml-2"
                >
                  View it
                </button>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto"> {/* This makes the table container scrollable */}
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
                      <th className="border-b py-2 px-4">Recipient Name</th>
                      <th className="border-b py-2 px-4">Volunteer Name</th>
                      <th className="border-b py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Reverse the array to show latest entries first and limit to last 5 */}
                    {donationHistory.slice(-5).reverse().map((donation) => (
                      <tr key={donation.id} className="border-t">
                        <td className="py-2 px-4">{donation.date}</td>
                        <td className="py-2 px-4">{donation.foodName}</td>
                        <td className="py-2 px-4">{donation.foodType}</td>
                        <td className="py-2 px-4">{donation.quantity}</td>
                        <td className="py-2 px-4">{donation.recipientName}</td>
                        <td className="py-2 px-4">{donation.volunteerName}</td>
                        <td className="py-2 px-4">{donation.foodStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="bg-gray-50 shadow rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">Monthly Donation Summary</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }}}} />
          </div>
        </div>
      </div>

      {/* Modal for displaying the certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2">
            <button
              onClick={handleCloseModal}
              className="text-white hover:text-gray-800 absolute top-4 right-4"
            >
              Close
            </button>
            <Certificate donorName={user.displayName} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;