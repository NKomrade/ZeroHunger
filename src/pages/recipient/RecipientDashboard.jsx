import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';

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
  const { user } = useUserContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.uid) {
      console.error('User not authenticated or UID not available');
      setLoading(false);
      return;
    }

    // Real-time Firestore listener for recipient's availablefood collection
    const foodCollectionRef = collection(db, `recipients/${user.uid}/availablefood`);
    const unsubscribe = onSnapshot(foodCollectionRef, (snapshot) => {
      const foodRequests = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          volunteer: data.status === 'Self Pickup' ? 'Self' : data.volunteerName || 'NULL', // Volunteer column logic
        };
      });
      setRequests(foodRequests);
      setLoading(false);
      console.log('Real-time updates received:', foodRequests);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const handleReject = async (id) => {
    if (!user || !user.uid) {
      console.error('User ID is not available.');
      return;
    }
  
    try {
      // Reference for the recipient's availablefood document
      const recipientFoodRef = doc(db, `recipients/${user.uid}/availablefood`, id);
      const recipientFoodSnapshot = await getDoc(recipientFoodRef);
  
      if (!recipientFoodSnapshot.exists()) {
        console.error(`Food request with id ${id} not found in recipient's collection.`);
        return;
      }
  
      const foodData = recipientFoodSnapshot.data();
      const { foodName } = foodData;
  
      // Delete the recipient's availablefood document
      await deleteDoc(recipientFoodRef);
      console.log(`Request with id ${id} has been removed from recipient's availablefood collection.`);
  
      // Remove corresponding volunteer's task document
      const volunteerTasksRef = collection(db, 'volunteers');
      const volunteerSnapshot = await getDocs(volunteerTasksRef);
  
      volunteerSnapshot.forEach(async (volunteerDoc) => {
        const taskCollectionRef = collection(db, `volunteers/${volunteerDoc.id}/task`);
        const taskSnapshot = await getDocs(taskCollectionRef);
  
        taskSnapshot.forEach(async (taskDoc) => {
          const taskData = taskDoc.data();
          if (taskData.foodName === foodName) {
            await deleteDoc(doc(db, `volunteers/${volunteerDoc.id}/task`, taskDoc.id));
            console.log(`Task related to foodName "${foodName}" deleted from volunteer's collection.`);
          }
        });
      });
  
      // Remove corresponding donor's notification document
      const donorNotificationsRef = collection(db, 'donors');
      const donorSnapshot = await getDocs(donorNotificationsRef);
  
      donorSnapshot.forEach(async (donorDoc) => {
        const notificationCollectionRef = collection(db, `donors/${donorDoc.id}/notifications`);
        const notificationSnapshot = await getDocs(notificationCollectionRef);
  
        notificationSnapshot.forEach(async (notificationDoc) => {
          const notificationData = notificationDoc.data();
          if (notificationData.foodName === foodName) {
            await deleteDoc(doc(db, `donors/${donorDoc.id}/notifications`, notificationDoc.id));
            console.log(`Notification related to foodName "${foodName}" deleted from donor's collection.`);
          }
        });
      });
    } catch (error) {
      console.error(`Error removing request and related documents: ${error}`);
    }
  };  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading requests...</p>
      </div>
    );
  }

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
                      <th className="border-b py-2 px-4">Volunteer</th>
                      <th className="border-b py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="py-2 px-4">{request.orderDate}</td>
                        <td className="py-2 px-4">{request.foodName}</td>
                        <td className="py-2 px-4">{request.foodType}</td>
                        <td className="py-2 px-4">{request.quantity}</td>
                        <td className="py-2 px-4">{request.donorName}</td>
                        <td className="py-2 px-4">{request.pincode}</td>
                        <td className="py-2 px-4">{request.status}</td>
                        <td className="py-2 px-4">{request.volunteer}</td>
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