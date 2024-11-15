import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';
import { format } from 'date-fns';

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
          const { name, address, email, mobile, profilePicture } = donorData;

          const donorscheduleSnapshot = await getDocs(collection(db, `donors/${donorId}/donorschedule`));
          donorscheduleSnapshot.forEach((donationDoc) => {
            const donationData = donationDoc.data();
            requests.push({
              id: donationDoc.id,
              donorId,
              donorName: name,
              donorEmail: email,
              donorMobile: mobile,
              donorAddress: address,
              donorProfilePicture: profilePicture,
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

  const handlePickupOption = async (food, pickupType) => {
    const pickupStatus = pickupType === 'self' ? 'Self Pickup' : 'Want a Volunteer';

    if (user && user.uid && food) {
      try {
        const recipientFoodRef = doc(db, `recipients/${user.uid}/availablefood`, food.id);
        const existingDoc = await getDoc(recipientFoodRef);

        if (!existingDoc.exists()) {
          const recipientDocRef = doc(db, 'recipients', user.uid);
          const recipientDoc = await getDoc(recipientDocRef);

          if (!recipientDoc.exists()) {
            console.error("Recipient profile data not found in Firestore.");
            return;
          }

          const recipientData = recipientDoc.data();

          // Save to recipient's availablefood collection
          await setDoc(recipientFoodRef, {
            ...food,
            orderDate: new Date().toISOString().split('T')[0],
            status: pickupStatus,
            recipientName: recipientData.name,
            recipientPhone: recipientData.mobile,
            recipientEmail: recipientData.email,
            recipientAddress: recipientData.address,
            recipientPincode: recipientData.pincode,
            recipientProfilePicture: recipientData.profilePicture,
            volunteerId: pickupType === 'volunteer' ? user.uid : null,
            volunteerName: pickupType === 'volunteer' ? user.displayName || 'Anonymous' : null,
          });

          // Save notification for donor
          if (pickupType === 'self') {
            const donorNotificationRef = doc(db, `donors/${food.donorId}/notifications`, food.id);

            await setDoc(donorNotificationRef, {
              recipientId: user.uid,
              recipientName: recipientData.name,
              recipientPhone: recipientData.mobile,
              recipientEmail: recipientData.email,
              recipientProfilePicture: recipientData.profilePicture,
              foodName: food.foodName,
              pickupStatus: pickupStatus,
              timestamp: new Date(),
              comment: 'This recipient will pick up the food themselves.',
            });
          }
        } else {
          alert("You have already requested this food item.");
        }
      } catch (error) {
        console.error(`Error saving ${pickupStatus} notification to Firestore:`, error);
      }
    } else {
      console.error("User is not authenticated or food item information is missing.");
    }

    navigate('/recipient/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading food requests...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <RecipientNavbar />
      <div className="flex flex-grow">
        <RecipientSidebar />
        <div className="flex-grow p-6 ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Food Donation Requests</h1>
          <div>
            <h2 className="text-3xl font-semibold mb-4">Available Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodRequests.map((request) => (
                <div key={`${request.id}-${request.donorId}`} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img src={request.image} alt={request.foodType} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <img src={request.donorProfilePicture} alt="Donor Profile" className="w-10 h-10 rounded-full mr-3" />
                      <p className="font-semibold text-lg">{request.donorName}</p>
                    </div>
                    <h3 className="text-xl font-semibold">{request.foodName}</h3>
                    <p className="text-gray-600">Food Type: {request.foodType}</p>
                    <p className="text-gray-600">Quantity: {request.quantity}</p>
                    <p className="text-gray-600">Location: {request.location}</p>
                    <p className="text-gray-600">Pincode: {request.pincode}</p>
                    <p className="text-gray-600">Expiry Date: {format(new Date(request.expiryDate), 'dd MMM yyyy')}</p>
                    <p className="text-gray-600">Donor Email: {request.donorEmail}</p>
                    <p className="text-gray-600">Donor Mobile: {request.donorMobile}</p>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handlePickupOption(request, 'self')}
                        className="bg-green-500 text-white px-4 py-2 rounded">
                        Self Pickup
                      </button>
                      <button
                        onClick={() => handlePickupOption(request, 'volunteer')}
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Want a Volunteer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFood;