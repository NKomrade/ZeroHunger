import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Volunteer Tasks
const mockVolunteerTasks = [
  {
    id: 1,
    pickupLocation: 'Restaurant ABC',
    deliveryLocation: 'Shelter XYZ',
    status: 'Pending',
  },
  {
    id: 2,
    pickupLocation: 'Home 123',
    deliveryLocation: 'Orphanage ABC',
    status: 'Completed',
  },
  {
    id: 3,
    pickupLocation: 'Grocery Store',
    deliveryLocation: 'Community Center',
    status: 'In Progress',
  },
];

// Sidebar for Volunteer Dashboard
const VolunteerSidebar = () => {
  return (
    <div className="w-64 bg-green-600 text-white h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Volunteer Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/volunteer/dashboard" className="hover:bg-green-700 p-2 rounded">Dashboard Overview</Link>
        <Link to="/volunteer/tasks" className="hover:bg-green-700 p-2 rounded">My Tasks</Link>
        <Link to="/profile" className="hover:bg-green-700 p-2 rounded">Profile</Link>
      </nav>
    </div>
  );
};

// VolunteerDashboard Component
const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState(mockVolunteerTasks);

  return (
    <div>
      <div className="flex">
        <VolunteerSidebar /> {/* Sidebar on the left */}
        <div className="flex-grow p-6">
          <h1 className="text-4xl font-bold mb-6 text-green-600">Volunteer Dashboard Overview</h1>

          {/* Task Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Available Tasks</h2>
            <div className="bg-gray-50 shadow rounded-lg p-4">
              {tasks.length === 0 ? (
                <p>No tasks available yet.</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-left">
                      <th className="border-b py-2 px-4">Pickup Location</th>
                      <th className="border-b py-2 px-4">Delivery Location</th>
                      <th className="border-b py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-t">
                        <td className="py-2 px-4">{task.pickupLocation}</td>
                        <td className="py-2 px-4">{task.deliveryLocation}</td>
                        <td className="py-2 px-4">{task.status}</td>
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

export default VolunteerDashboard;