import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';

const db = getFirestore();

const AvailableTasks = () => {
  const { user, loading } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (loading || !user) {
        console.log("User context is still loading or user is not available.");
        return;
      }

      try {
        console.log("Fetching tasks where recipient wants a volunteer.");
        const allTasks = [];
        const recipientSnapshot = await getDocs(collection(db, 'recipients'));

        for (const recipientDoc of recipientSnapshot.docs) {
          const recipientData = recipientDoc.data();
          const availableFoodSnapshot = await getDocs(collection(db, `recipients/${recipientDoc.id}/availablefood`));

          for (const foodDoc of availableFoodSnapshot.docs) {
            const foodData = foodDoc.data();

            if (foodData.recipientWants === 'Want a Volunteer') {
              allTasks.push({
                id: foodDoc.id,
                recipientId: recipientDoc.id, // Store recipientId for later updates
                recipientName: recipientData.name,
                recipientPhone: recipientData.mobile,
                recipientEmail: recipientData.email,
                recipientAddress: recipientData.address,
                recipientProfilePicture: recipientData.profilePicture,
                foodPicture: foodData.image,
                ...foodData,
              });
              console.log(`Adding task for food ${foodData.foodName} from recipient ${recipientData.name}`);
            }
          }
        }

        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      setLoadingTasks(false);
    };

    fetchTasks();
  }, [user, loading]);

  const acceptTask = async (task) => {
    if (!user) return;
  
    try {
      // Fetch volunteer details
      const volunteerRef = doc(db, `volunteers/${user.uid}`);
      const volunteerDoc = await getDoc(volunteerRef);
  
      if (!volunteerDoc.exists()) {
        console.error("Volunteer details not found.");
        return;
      }
  
      const volunteerData = volunteerDoc.data();
  
      // Format the current date as yyyy-mm-dd
      const formattedDate = new Date().toISOString().split('T')[0];
  
      // Prepare volunteer task data
      const taskData = {
        ...task,
        volunteerId: user.uid,
        volunteerName: volunteerData.name || 'Anonymous',
        volunteerEmail: volunteerData.email || 'N/A',
        volunteerPhone: volunteerData.mobile || 'N/A',
        volunteerProfilePicture: volunteerData.profilePicture || 'N/A',
        recipientWants: 'Want a Volunteer', 
        acceptedDate: formattedDate, // Use formatted date here
      };
  
      // Update the corresponding recipient's availablefood document
      const recipientFoodRef = doc(db, `recipients/${task.recipientId}/availablefood`, task.id);
      await setDoc(recipientFoodRef, taskData);
  
      // Save data to the volunteer's task collection
      const volunteerTaskRef = doc(db, `volunteers/${user.uid}/task`, task.id);
      await setDoc(volunteerTaskRef, taskData);
  
      // Save a notification in the donor's notifications collection
      const donorNotificationRef = doc(db, `donors/${task.donorId}/notifications`, task.id);
      await setDoc(donorNotificationRef, {
        ...taskData,
        notificationType: 'Task Accepted',
        notificationDate: formattedDate, // Use formatted date here
      });
  
      console.log("Task successfully updated and notifications sent.");
      alert(`You have accepted the task: ${task.foodName}`);
      setSelectedTask(null);
      navigate('/volunteer/dashboard'); // Redirect to volunteer dashboard
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };  

  const openDetailsModal = (task) => {
    setSelectedTask(task);
  };

  const closeDetailsModal = () => {
    setSelectedTask(null);
  };

  if (loadingTasks) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading tasks...</p>
      </div>
    );
  }

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
            <Link to="/volunteer/dashboard" className="hover:bg-blue-600 p-2 rounded">
              Dashboard Overview
            </Link>
            <Link to="/volunteer/tasks" className="hover:bg-blue-600 p-2 rounded">
              My Tasks
            </Link>
            <Link to="/volunteer/profile" className="hover:bg-blue-600 p-2 rounded">
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex-grow p-6 bg-white min-h-screen ml-64">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Available Tasks</h1>

          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                  <img src={task.foodPicture} alt="Food" className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{task.foodName}</h3>
                    <p className="text-gray-600">Food Type: {task.foodType}</p>
                    <p className="text-gray-600">Quantity: {task.quantity}</p>
                    <p className="text-gray-600">Pincode: {task.recipientPincode}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => openDetailsModal(task)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Task Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold">Donor Information</h3>
                <img src={selectedTask.donorProfilePicture} alt="Donor Profile" className="w-24 h-24 rounded-full my-2" />
                <p><strong>Name:</strong> {selectedTask.donorName}</p>
                <p><strong>Phone:</strong> {selectedTask.donorMobile}</p>
                <p><strong>Email:</strong> {selectedTask.donorEmail}</p>
                <p><strong>Address:</strong> {selectedTask.donorAddress}</p>
                <p><strong>Pincode:</strong> {selectedTask.pincode}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Recipient Information</h3>
                <img src={selectedTask.recipientProfilePicture} alt="Recipient Profile" className="w-24 h-24 rounded-full my-2" />
                <p><strong>Name:</strong> {selectedTask.recipientName}</p>
                <p><strong>Phone:</strong> {selectedTask.recipientPhone}</p>
                <p><strong>Email:</strong> {selectedTask.recipientEmail}</p>
                <p><strong>Address:</strong> {selectedTask.recipientAddress}</p>
                <p><strong>Pincode:</strong> {selectedTask.recipientPincode}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                onClick={closeDetailsModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => acceptTask(selectedTask)}
              >
                Accept Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableTasks;