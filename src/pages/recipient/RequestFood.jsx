import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';
import { format } from 'date-fns';

const db = getFirestore();

const RequestFood = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodRequests = async () => {
      try {
        console.log('Fetching food requests...');
        const donorSnapshot = await getDocs(collection(db, 'donors'));
        
        if (donorSnapshot.empty) {
          console.log('No donors found in the Firestore collection.');
          setLoading(false);
          return;
        }
  
        const requests = [];
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5); // Get HH:MM format
  
        console.log(`Current Date: ${currentDate}`);
        console.log(`Current Time: ${currentTime}`);
  
        for (const donorDoc of donorSnapshot.docs) {
          const donorId = donorDoc.id;
          const donorData = donorDoc.data();
  
          console.log(`Checking donor: ${donorId}, Name: ${donorData.name}`);
  
          const donorscheduleSnapshot = await getDocs(collection(db, `donors/${donorId}/donorschedule`));
  
          if (donorscheduleSnapshot.empty) {
            console.log(`No schedules found for donor: ${donorId}`);
          }
  
          donorscheduleSnapshot.forEach((donationDoc) => {
            const donationData = donationDoc.data();
  
            console.log(`Checking donation: ${donationDoc.id}, Food Name: ${donationData.foodName}`);
            console.log(`Donation Date: ${donationData.date}, Pickup Time (To): ${donationData.timeTo}`);
  
            // Normalize `timeTo` for comparison
            const timeTo = donationData.timeTo.substring(0, 5); // Get HH:MM format
  
            // Filter based on current date and time conditions
            if (
              donationData.date === currentDate && 
              timeTo >= currentTime
            ) {
              console.log(`Adding donation: ${donationDoc.id} to the requests list.`);
              requests.push({
                id: donationDoc.id,
                donorId,
                donorName: donorData.name || 'Unknown',
                donorEmail: donorData.email || 'N/A',
                donorMobile: donorData.mobile || 'N/A',
                donorAddress: donorData.address || 'Unknown Address',
                donorProfilePicture: donorData.profilePicture || '',
                foodName: donationData.foodName,
                foodType: donationData.foodType,
                quantity: donationData.quantity,
                location: donationData.address || 'Unknown Location',
                pincode: donationData.pincode || 'N/A',
                expiryDate: donationData.date || '',
                image: donationData.foodImage || '',
                timeFrom: donationData.timeFrom, // Include timeFrom
                timeTo: donationData.timeTo,     // Include timeTo
              });              
            } else {
              console.log(
                `Skipping donation: ${donationDoc.id}. It does not match the date and time criteria.`
              );
            }
          });
        }
        
        console.log('Final filtered requests:', requests);
        setFoodRequests(requests);
      } catch (error) {
        console.error('Error fetching food requests:', error);
      }
      setLoading(false);
    };
  
    fetchFoodRequests();
  }, []);
      
  const handlePickupOption = async (food, pickupType) => {
    const recipientWants = pickupType === 'self' ? 'Self Pickup' : 'Want a Volunteer';
  
    if (!user || !user.uid || !food) {
      console.error('User is not authenticated or food information is missing.');
      return;
    }
  
    try {
      console.log('Food object in handlePickupOption:', food); // Debug log
      const recipientFoodRef = doc(db, `recipients/${user.uid}/availablefood`, food.id);
      const existingDoc = await getDoc(recipientFoodRef);
  
      if (!existingDoc.exists()) {
        const recipientDocRef = doc(db, 'recipients', user.uid);
        const recipientDoc = await getDoc(recipientDocRef);
  
        if (!recipientDoc.exists()) {
          console.error('Recipient profile data not found in Firestore.');
          return;
        }
  
        const recipientData = recipientDoc.data();
  
        // Extract timeFrom and timeTo
        const pickupTimeFrom = food.timeFrom || 'Not Specified';
        const pickupTimeTo = food.timeTo || 'Not Specified';
  
        console.log(`Pickup Time From: ${pickupTimeFrom}`);
        console.log(`Pickup Time To: ${pickupTimeTo}`);
  
        // Save data to recipient's availablefood collection
        const formattedDate = new Date().toISOString().split('T')[0];
        await setDoc(recipientFoodRef, {
          ...food,
          orderDate: formattedDate,
          recipientWants,
          Foodstatus: 'Pending',
          recipientName: recipientData.name,
          recipientPhone: recipientData.mobile,
          recipientEmail: recipientData.email,
          recipientAddress: recipientData.address,
          recipientPincode: recipientData.pincode,
          recipientProfilePicture: recipientData.profilePicture,
          pickupTimeFrom,
          pickupTimeTo,
        });
  
        console.log(`${recipientWants} request saved to recipient's availablefood collection.`);
  
        // Save data to donor's notifications collection
        const donorNotificationRef = doc(db, `donors/${food.donorId}/notifications`, food.id);
        await setDoc(donorNotificationRef, {
          ...food,
          orderDate: formattedDate,
          recipientWants,
          Foodstatus: 'Pending',
          recipientName: recipientData.name,
          recipientPhone: recipientData.mobile,
          recipientEmail: recipientData.email,
          recipientAddress: recipientData.address,
          recipientPincode: recipientData.pincode,
          recipientProfilePicture: recipientData.profilePicture,
          pickupTimeFrom,
          pickupTimeTo,
        });
  
        console.log('Data saved to donor\'s notifications collection.');
  
        // Show confirmation popup
        alert(`A request has been scheduled from ${pickupTimeFrom} to ${pickupTimeTo} on ${formattedDate}.`);
  
        navigate('/recipient/dashboard');
      } else {
        alert('You have already requested this food item.');
      }
    } catch (error) {
      console.error(`Error saving ${recipientWants} request:`, error);
    }
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
      <nav className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-white font-bold text-lg">ZeroHunger - Request Food</div>
        <div>
          <Link to="/" className="text-white px-4 py-2 rounded-full hover:text-black hover:bg-neutral-200 transition duration-200">
            Sign out as Recipient
          </Link>
        </div>
      </nav>
      <div className="flex">
        <div className="fixed w-64 bg-blue-500 text-white h-[calc(100vh-60px)] p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/recipient/dashboard" className="hover:bg-blue-600 p-2 rounded">
              Dashboard Overview
            </Link>
            <Link to="/recipient/request" className="hover:bg-blue-600 p-2 rounded">
              Available Food
            </Link>
            <Link to="/recipient/profile" className="hover:bg-blue-600 p-2 rounded">
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex-grow p-6 bg-white min-h-screen ml-64">
          <h1 className="text-4xl font-bold mb-6 text-blue-500">Food Donation Requests</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodRequests.map((request) => (
              <div key={`${request.id}-${request.donorId}`} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={request.image} alt={request.foodType} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={request.donorProfilePicture}
                      alt="Donor Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <p className="font-semibold text-lg">{request.donorName}</p>
                  </div>
                  <h3 className="text-xl font-semibold">{request.foodName}</h3>
                  <p className="text-gray-600">Food Type: {request.foodType}</p>
                  <p className="text-gray-600">Quantity: {request.quantity}</p>
                  <p className="text-gray-600">Location: {request.location}</p>
                  <p className="text-gray-600">Pincode: {request.pincode}</p>
                  <p className="text-gray-600">
                    Expiry Date:{' '}
                    {request.expiryDate ? format(new Date(request.expiryDate), 'dd MMM yyyy') : 'N/A'}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handlePickupOption(request, 'self')}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Self Pickup
                    </button>
                    <button
                      onClick={() => handlePickupOption(request, 'volunteer')}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
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
  );
};

export default RequestFood;