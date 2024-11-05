import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import DonorSignup from './pages/donor/donorsignup';
import VolunteerSignup from './pages/volunteer/volunteersignup';
import RecipientSignup from './pages/recipient/recipientsignup';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonationHistory from './pages/donor/DonationHistory';
import ScheduleDonation from './pages/donor/ScheduleDonation';
import Profile from './pages/donor/Profile';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import RecipientProfile from './pages/recipient/RecipientProfile';
import RequestFood from './pages/recipient/RequestFood';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AvailableTasks from './pages/volunteer/AvailableTasks';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';

const App = () => {
  const [userRole, setUserRole] = useState(null);

  // Retrieve userRole from local storage when the component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) setUserRole(storedRole);
  }, []);

  // Update local storage whenever userRole changes
  useEffect(() => {
    if (userRole) localStorage.setItem('userRole', userRole);
  }, [userRole]);

  // Component to handle protected routes based on user role
  const ProtectedRoute = ({ element, allowedRole }) => {
    if (!userRole) {
      // Redirect to login if no user role is set
      return <Navigate to="/login" />;
    } 
    // else if (userRole !== allowedRole) {
      // Redirect user to their specific dashboard if the role does not match
      // console.log(`Redirecting to correct dashboard based on role: ${userRole}`);
      // return (
      //   <Navigate
      //     to={
      //       userRole === 'Donor' ? '/donor/dashboard' :
      //       userRole === 'Recipient' ? '/recipient/dashboard' :
      //       userRole === 'Volunteer' ? '/volunteer/dashboard' : '/login'
      //     }
      //   />
      // );
    // }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/donor/signup" element={<DonorSignup setUserRole={setUserRole} />} />
        <Route path="/volunteer/signup" element={<VolunteerSignup setUserRole={setUserRole} />} />
        <Route path="/recipient/signup" element={<RecipientSignup setUserRole={setUserRole} />} />
        
        {/* Donor Routes - Only accessible to donors */}
        <Route path="/donor/dashboard" element={<ProtectedRoute element={<DonorDashboard />} allowedRole="Donor" />} />
        <Route path="/donor/history" element={<ProtectedRoute element={<DonationHistory />} allowedRole="Donor" />} />
        <Route path="/donor/new-donation" element={<ProtectedRoute element={<ScheduleDonation />} allowedRole="Donor" />} />
        <Route path="/donor/profile" element={<ProtectedRoute element={<Profile />} allowedRole="Donor" />} />

        {/* Recipient Routes - Only accessible to recipients */}
        <Route path="/recipient/dashboard" element={<ProtectedRoute element={<RecipientDashboard />} allowedRole="Recipient" />} />
        <Route path="/recipient/request" element={<ProtectedRoute element={<RequestFood />} allowedRole="Recipient" />} />
        <Route path="/recipient/profile" element={<ProtectedRoute element={<RecipientProfile />} allowedRole="Recipient" />} />
        
        {/* Volunteer Routes - Only accessible to volunteers */}
        <Route path="/volunteer/dashboard" element={<ProtectedRoute element={<VolunteerDashboard />} allowedRole="Volunteer" />} />
        <Route path="/volunteer/tasks" element={<ProtectedRoute element={<AvailableTasks />} allowedRole="Volunteer" />} />
        <Route path="/volunteer/profile" element={<ProtectedRoute element={<VolunteerProfile />} allowedRole="Volunteer" />} />
      </Routes>
    </Router>
  );
};

export default App;
