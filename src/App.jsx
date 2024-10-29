import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donor/signup" element={<DonorSignup />} />
        <Route path="/volunteer/signup" element={<VolunteerSignup />} />
        <Route path="/recipient/signup" element={<RecipientSignup />} />

        {/* Donor Dashboard Routes */}
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/history" element={<DonationHistory />} />
        <Route path="/donor/new-donation" element={<ScheduleDonation />} />
        <Route path="/donor/profile" element={<Profile />} />

        {/* Recipient Dashboard Route */}
        <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
        <Route path="/recipient/request" element={<RequestFood />} />
        <Route path="/recipient/profile" element={<RecipientProfile />} />
        
        {/* Volunteer Dashboard Route */}
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/tasks" element={<AvailableTasks />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
      </Routes>
    </Router>
  );
};

export default App;