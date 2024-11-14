import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';

const db = getFirestore();

const VolunteerSidebar = () => (
  <div className="fixed w-64 bg-blue-500 text-white h-screen flex flex-col p-4">
    <nav className="flex flex-col space-y-4">
      <Link to="/volunteer/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard Overview</Link>
      <Link to="/volunteer/tasks" className="hover:bg-blue-600 p-2 rounded">My Tasks</Link>
      <Link to="/volunteer/profile" className="hover:bg-blue-600 p-2 rounded">Profile</Link>
    </nav>
  </div>
);

const VolunteerNavbar = () => (
  <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
    <div className="text-white font-bold text-lg">ZeroHunger</div>
    <div>
      <Link to="/" className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
        Sign out as Volunteer
      </Link>
    </div>
  </nav>
);

const VolunteerTaskManager = () => {
  const { user } = useUserContext();
  const [myTasks, setMyTasks] = useState([]);

  // Real-time listener for "My Tasks" (tasks accepted by the volunteer)
  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, `volunteers/${user.uid}/task`);
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  // Toggle the task status between "Pending" and "Delivered"
  const toggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
    const taskRef = doc(db, `volunteers/${user.uid}/task`, taskId);

    try {
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Cancel and remove the task
  const cancelTask = async (taskId) => {
    const taskRef = doc(db, `volunteers/${user.uid}/task`, taskId);

    try {
      await deleteDoc(taskRef);
      setMyTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error cancelling task:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <VolunteerNavbar />
      <div className="flex flex-grow">
        <VolunteerSidebar />
        
        {/* My Tasks (Dashboard) Section */}
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Volunteer Dashboard Overview</h1>
          <div className="bg-gray-50 shadow rounded-lg p-4">
            {myTasks.length === 0 ? (
              <p>No tasks available yet.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-center">
                    <th className="border-b py-2 px-4">Date</th>
                    <th className="border-b py-2 px-4">Donor's Name</th>
                    <th className="border-b py-2 px-4">Recipient's Name</th>
                    <th className="border-b py-2 px-4">Food Name</th>
                    <th className="border-b py-2 px-4">Pickup Location</th>
                    <th className="border-b py-2 px-4">Delivery Location</th>
                    <th className="border-b py-2 px-4">Status</th>
                    <th className="border-b py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task) => (
                    <tr key={task.id} className="border-t text-center">
                      <td className="py-2 px-4">{task.acceptedDate || 'N/A'}</td>
                      <td className="py-2 px-4">{task.donorName || 'Unknown'}</td>
                      <td className="py-2 px-4">{task.recipientName || 'Unknown'}</td>
                      <td className="py-2 px-4">{task.foodName}</td>
                      <td className="py-2 px-4">{task.donorAddress || 'Unknown Address'}</td>
                      <td className="py-2 px-4">{task.recipientAddress || 'Unknown Address'}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => toggleStatus(task.id, task.status)}
                          className={`px-4 py-2 rounded ${task.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'} text-white hover:opacity-75`}
                        >
                          {task.status}
                        </button>
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        <button onClick={() => cancelTask(task.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                          Cancel
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
  );
};

export default VolunteerTaskManager;