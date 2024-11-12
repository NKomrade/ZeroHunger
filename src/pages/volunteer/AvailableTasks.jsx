import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';

const db = getFirestore();

const AvailableTasks = () => {
  const { user, loading } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (loading || !user) {
        console.log("User context is still loading or user is not available.");
        return;
      }

      try {
        // Retrieve volunteer's served pincodes
        console.log("Fetching served pincodes for volunteer:", user.uid);
        const volunteerDocRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerDocRef);
        
        if (!volunteerDoc.exists()) {
          console.log("No volunteer document found for user.");
          setTasks([]);
          setLoadingTasks(false);
          return;
        }

        const volunteerData = volunteerDoc.data();
        console.log("Volunteer data retrieved:", volunteerData);

        // Check if volunteer has any served pincodes
        const { pincodes } = volunteerData;
        if (!pincodes || pincodes.length === 0) {
          console.log('No pincodes assigned to this volunteer.');
          setTasks([]);
          setLoadingTasks(false);
          return;
        }

        const allTasks = [];

        // Fetch all donors and their donations
        const donorSnapshot = await getDocs(collection(db, 'donors'));
        for (const donorDoc of donorSnapshot.docs) {
          const donorId = donorDoc.id;
          const donorData = donorDoc.data();

          console.log(`Checking donor: ${donorData.name}`);

          // Fetch each donor's donations
          const donorScheduleSnapshot = await getDocs(collection(db, `donors/${donorId}/donorschedule`));
          donorScheduleSnapshot.forEach((donationDoc) => {
            const donationData = donationDoc.data();
            console.log(`Donation found with pincode ${donationData.pincode}`);

            // Compare pincodes
            if (pincodes.includes(donationData.pincode)) {
              allTasks.push({
                id: donationDoc.id,
                donorId: donorId,
                donorName: donorData.name,
                profilePicture: donorData.profilePicture,
                ...donationData,
              });
              console.log("Matching pincode found. Task added:", donationData);
            }
          });
        }

        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      setLoadingTasks(false);
    };

    fetchTasks();
  }, [user, loading]);

  if (loadingTasks) return <p>Loading tasks...</p>;

  return (
    <div>
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-white font-bold text-lg">ZeroHunger - Available Tasks</div>
        <div>
          <Link
            to="/"
            className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200"
          >
            Sign out as Volunteer
          </Link>
        </div>
      </nav>

      <div className="flex">
        <div className="fixed w-64 bg-blue-500 text-white h-[calc(100vh-60px)] p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/volunteer/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
            <Link to="/volunteer/tasks" className="hover:bg-blue-600 p-2 rounded">Available Tasks</Link>
            <Link to="/volunteer/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
          </nav>
        </div>

        <div className="flex-grow p-6 bg-white min-h-screen ml-64">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Available Tasks</h1>
          
          {tasks.length === 0 ? (
            <p>No tasks available for the pincodes you serve.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                  <img src={task.foodImage} alt={task.foodType} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <img src={task.profilePicture} alt="Donor Profile" className="w-10 h-10 rounded-full mr-3" />
                      <p className="font-semibold text-lg">{task.donorName}</p>
                    </div>
                    <h3 className="text-xl font-semibold">{task.foodName}</h3>
                    <p className="text-gray-600">Food Type: {task.foodType}</p>
                    <p className="text-gray-600">Quantity: {task.quantity}</p>
                    <p className="text-gray-600">Location: {task.address}</p>
                    <p className="text-gray-600">Pincode: {task.pincode}</p>
                    <p className="text-gray-600">Expiry Date: {task.date}</p>
                    <p className="text-gray-600">Pickup Time: {task.timeFrom} - {task.timeTo}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => alert(`Task assigned: ${task.foodName}`)}
                      >
                        Accept Task
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableTasks;
