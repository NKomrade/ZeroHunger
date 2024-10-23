import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Donate from './pages/Donate';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/signup'; 
import DonorDashboard from './pages/donor/DonorDashboard';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import DonationHistory from './pages/donor/DonationHistory'; 
import ScheduleDonation from './pages/donor/ScheduleDonation';
import Profile from './pages/donor/Profile';
import RecipientProfile from './pages/recipient/RecipientProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/about" element={<About />} /> {/* Fixed path case to lowercase */}
        <Route path="/contact" element={<Contact />} /> {/* Fixed path case to lowercase */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Donor Dashboard Routes */}
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/history" element={<DonationHistory />} />
        <Route path="/donor/new-donation" element={<ScheduleDonation />} />
        <Route path="/donor/profile" element={<Profile />} />

        {/* Recipient Dashboard Route */}
        <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
        <Route path="/recipient/profile" element={<RecipientProfile />} />
        
        {/* Volunteer Dashboard Route */}
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;