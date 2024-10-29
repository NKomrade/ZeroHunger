import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function VolunteerSignup() {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const [formData, setFormData] = useState({
    role: 'Volunteer',
    name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
  });

  const [pincodes, setPincodes] = useState(['']); // Array to store preferred pincodes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePincodeChange = (index, value) => {
    const newPincodes = [...pincodes];
    newPincodes[index] = value;
    setPincodes(newPincodes);
  };

  const addPincodeField = () => {
    setPincodes([...pincodes, '']); // Add a new empty pincode field
  };

  const removePincodeField = (index) => {
    if (pincodes.length > 1) {
      const newPincodes = [...pincodes];
      newPincodes.splice(index, 1); // Remove the pincode field at the given index
      setPincodes(newPincodes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', { ...formData, pincodes });

    // Add logic to send data to the backend if required.

    // Redirect to Volunteer Dashboard after successful submission
    navigate('/volunteer/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-neutral-900 text-center">
          Volunteer Signup
        </h2>
        <form onSubmit={handleSubmit}>
          {['name', 'mobile', 'email', 'password', 'address'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-neutral-900 mb-1" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className="w-full border rounded p-2 placeholder-gray-400"
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-neutral-900 mb-1">
              Preferred Pincode(s)
            </label>
            {pincodes.map((pincode, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(index, e.target.value)}
                  placeholder={`Enter preferred pincode ${index + 1}`}
                  className="w-full border rounded p-2 mr-2 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => addPincodeField()}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  +1
                </button>
                {pincodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePincodeField(index)}
                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}