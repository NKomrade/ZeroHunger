import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, `volunteers/${user.uid}/task`);
    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMyTasks(tasksData);
      },
      (error) => {
        console.error("Error with snapshot listener:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleFoodstatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';

    try {
      // Update Foodstatus in volunteer's task collection
      const taskRef = doc(db, `volunteers/${user.uid}/task`, taskId);
      await updateDoc(taskRef, { Foodstatus: newStatus });

      console.log(`Foodstatus updated to ${newStatus} in volunteers/task for task ${taskId}`);

      // Update Foodstatus in the corresponding donor's notifications collection
      const donorsSnapshot = await getDocs(collection(db, 'donors'));
      for (const donorDoc of donorsSnapshot.docs) {
        const donorId = donorDoc.id;
        const notificationRef = doc(db, `donors/${donorId}/notifications`, taskId);

        // Check if the notification exists
        const notificationDoc = await getDoc(notificationRef);
        if (notificationDoc.exists()) {
          await updateDoc(notificationRef, { Foodstatus: newStatus });
          console.log(`Foodstatus updated to ${newStatus} in donors/${donorId}/notifications for task ${taskId}`);
        }
      }
    } catch (error) {
      console.error('Error syncing Foodstatus:', error);
    }
  };

  const cancelTask = async (taskId, recipientId) => {
    try {
      // Remove the task from the volunteer's task collection
      const taskRef = doc(db, `volunteers/${user.uid}/task`, taskId);
      await deleteDoc(taskRef);

      // Remove the notification from the donor's notifications collection
      const donorsSnapshot = await getDocs(collection(db, 'donors'));
      for (const donorDoc of donorsSnapshot.docs) {
        const donorId = donorDoc.id;
        const notificationRef = doc(db, `donors/${donorId}/notifications`, taskId);
        const notificationDoc = await getDoc(notificationRef);
        if (notificationDoc.exists()) {
          await deleteDoc(notificationRef);
          console.log(`Notification deleted for task ${taskId} in donors/${donorId}/notifications`);
        }
      }

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
                          onClick={() => toggleFoodstatus(task.id, task.Foodstatus)}
                          className={`px-4 py-2 rounded ${
                            task.Foodstatus === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white hover:opacity-75`}
                        >
                          {task.Foodstatus || 'Pending'}
                        </button>
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        <button
                          onClick={() => cancelTask(task.id, task.recipientId)}
                          className={`px-4 py-2 rounded ${
                            task.Foodstatus === 'Delivered'
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          disabled={task.Foodstatus === 'Delivered'}
                        >
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