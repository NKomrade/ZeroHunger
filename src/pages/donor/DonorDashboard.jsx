import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
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
  const [showCertificateModal, setShowCertificateModal] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

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

  // Fetch notifications from Firestore
  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, `donors/${user.uid}/notifications`);

    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(newNotifications);
      if (newNotifications.length > 0) {
        setShowNotificationModal(true); // Show modal if there are new notifications
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClose = () => {
    setShowNotificationModal(false); // Close notification modal

    // Update donation history with recipient data for corresponding food items
    const updatedDonationHistory = donationHistory.map((donation) => {
      const matchingNotification = notifications.find((notif) => notif.foodName === donation.foodName);

      if (matchingNotification) {
        return {
          ...donation,
          recipientName: matchingNotification.recipientName,
          recipientPhone: matchingNotification.recipientPhone,
          recipientRole: 'Recipient',
        };
      }
      return donation;
    });

    setDonationHistory(updatedDonationHistory); // Update donation history with recipient data
  };

  // Calculate monthly donation amounts
  const calculateMonthlyData = (donations) => {
    const data = {};
    let count = donations.length;

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
    setMonthlyDonationCount(count);

    if (count > 0 && count % 5 === 0){
      setCertificateEligible(true);
      setShowConfetti(true); 

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

            <div className="max-h-96 overflow-y-auto">
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
                      <th className="border-b py-2 px-4">Status</th>
                      <th className="border-b py-2 px-4">Recipient Name</th>
                      <th className="border-b py-2 px-4">Recipient Phone</th>
                      <th className="border-b py-2 px-4">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.slice(-5).reverse().map((donation) => (
                      <tr key={donation.id} className="border-t">
                        <td className="py-2 px-4">{donation.date}</td>
                        <td className="py-2 px-4">{donation.foodName}</td>
                        <td className="py-2 px-4">{donation.foodType}</td>
                        <td className="py-2 px-4">{donation.quantity}</td>
                        <td className="py-2 px-4">{donation.status || 'In Transit'}</td>
                        <td className="py-2 px-4">{donation.recipientName || ''}</td>
                        <td className="py-2 px-4">{donation.recipientPhone || ''}</td>
                        <td className="py-2 px-4">{donation.recipientRole || ''}</td>
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

      {/* Redesigned Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">New Pickup Notifications</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border rounded-lg shadow-sm">
                  <p><strong>Name:</strong> {notification.recipientName}</p>
                  <p><strong>Email:</strong> {notification.recipientEmail}</p>
                  <p><strong>Phone:</strong> {notification.recipientPhone}</p>
                  {notification.recipientProfilePicture && (
                    <img src={notification.recipientProfilePicture} alt="Profile" className="w-16 h-16 rounded-full mt-2" />
                  )}
                  <p><strong>Food Name:</strong> {notification.foodName}</p>
                  <p><strong>Status:</strong> {notification.pickupStatus}</p>
                  <p><strong>Comment:</strong> {notification.comment}</p>
                </div>
              ))}
            </div>
            <button onClick={handleNotificationClose} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;