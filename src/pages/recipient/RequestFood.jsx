import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
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

const RequestFood = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchFoodRequests = async () => {
      console.log('Fetching food requests...');
      try {
        const donorSnapshot = await getDocs(collection(db, 'donors'));
        if (donorSnapshot.empty) {
          setLoading(false);
          return;
        }

        const requests = [];
        for (const donorDoc of donorSnapshot.docs) {
          const donorId = donorDoc.id;
          const donorData = donorDoc.data();
          const profilePicture = donorData.profilePicture;

          const donorscheduleSnapshot = await getDocs(collection(db, `donors/${donorId}/donorschedule`));
          donorscheduleSnapshot.forEach((donationDoc) => {
            const donationData = donationDoc.data();
            requests.push({
              id: donationDoc.id,
              donorId: donorId,
              donorName: donorData.name,
              donorEmail: donorData.email,
              profilePicture: profilePicture,
              foodName: donationData.foodName,
              foodType: donationData.foodType,
              quantity: donationData.quantity,
              location: donationData.address,
              pincode: donationData.pincode,
              expiryDate: donationData.date,
              image: donationData.foodImage,
            });
          });
        }
        console.log('Fetched food requests:', requests);
        setFoodRequests(requests);
      } catch (error) {
        console.error('Error fetching food requests:', error);
      }
      setLoading(false);
    };

    fetchFoodRequests();
  }, []);

  const handleAccept = (food) => {
    console.log('Selected food for acceptance:', food);
    setSelectedFood(food); // Set selected food, but do not save to Firestore yet
    setShowPopup(true); // Show popup
  };

  const handlePopupOk = async () => {
    setShowPopup(false);
    console.log('Popup OK clicked. Selected food:', selectedFood);

    if (user && user.uid && selectedFood) {
      try {
        console.log('Saving accepted food to Firestore...');
        const recipientFoodRef = doc(collection(db, `recipients/${user.uid}/availablefood`));
        
        await setDoc(recipientFoodRef, {
          ...selectedFood,
          orderDate: new Date().toISOString().split('T')[0], // Add order date
          status: 'Pending',
        });

        console.log('Accepted food saved to Firestore:', selectedFood);
      } catch (error) {
        console.error('Error saving accepted food to Firestore:', error);
      }
    } else {
      console.error('User ID not available or selected food is null.');
    }

    // Navigate to the dashboard and pass selected food in state
    navigate('/recipient/dashboard', { state: { acceptedFood: selectedFood } });
  };

  const handleReject = async (foodId) => {
    // Deletes the selected food from `availablefood` under the current recipient's collection
    if (user && user.uid) {
      try {
        console.log(`Rejecting food with ID: ${foodId} from availablefood collection.`);
        const recipientFoodRef = doc(db, `recipients/${user.uid}/availablefood`, foodId);
        await deleteDoc(recipientFoodRef);

        // Remove from local state as well
        setFoodRequests(prevRequests => prevRequests.filter((request) => request.id !== foodId));
        console.log(`Food with ID ${foodId} has been removed from availablefood.`);
      } catch (error) {
        console.error(`Error removing food with ID ${foodId} from availablefood:`, error);
      }
    } else {
      console.error('User ID not available.');
    }
  };

  if (loading) return <p>Loading food requests...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <RecipientNavbar />
      <div className="flex flex-grow">
        <RecipientSidebar />
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Food Donation Requests</h1>
          <div>
            <h2 className="text-3xl font-semibold mb-4">Pending Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodRequests.map((request) => (
                <div key={`${request.id}-${request.donorId}`} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                  <img src={request.image} alt={request.foodType} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <img src={request.profilePicture} alt="Donor Profile" className="w-10 h-10 rounded-full mr-3" />
                      <p className="font-semibold text-lg">{request.donorName}</p>
                    </div>
                    <h3 className="text-xl font-semibold">{request.foodName}</h3>
                    <p className="text-gray-600">Food Type: {request.foodType}</p>
                    <p className="text-gray-600">Quantity: {request.quantity}</p>
                    <p className="text-gray-600">Location: {request.location}</p>
                    <p className="text-gray-600">Pincode: {request.pincode}</p>
                    <p className="text-gray-600">Expiry Date: {request.expiryDate}</p>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button 
                        onClick={() => handleAccept(request)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(request.id)} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup for Accept Confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Food Accepted</h3>
            <p>This food ({selectedFood?.foodName}) has been selected.</p>
            <button
              onClick={handlePopupOk}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestFood;