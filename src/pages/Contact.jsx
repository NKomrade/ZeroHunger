import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must only contain letters and spaces.';
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid Gmail address (e.g., user@gmail.com).';
    }
    if (formData.message.trim().length === 0) {
      newErrors.message = 'Message cannot be empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    // Simulate sending email
    console.log('Sending email to: dear.nk.comrade@gmail.com');
    console.log('Form submitted:', formData);
    alert('Your message has been sent successfully!');
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar Component */}
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-lg"><Link to="/">ZeroHunger</Link></div>
        <div>
          <Link to="/" className="text-white mx-2 hover:underline hover: transition duration-200">Home</Link>
          <Link to="/about" className="text-white mx-2 hover:underline hover: transition duration-200">About</Link>
          <Link to="/contact" className="text-white mx-2 hover:underline hover: transition duration-200">Contact</Link>
          <Link to="/login" className="text-white mx-2 hover:bg-blue-400 transition duration-200 rounded-full px-4 py-2">Log in</Link>
        </div>
      </nav>

      {/* Contact Section */}
      <div className="flex flex-col items-center p-6 rounded-lg mt-8 w-full">
        <h1 className="text-4xl font-bold mb-6 text-neutral-900">Contact Us</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="5"
              placeholder="Your Message"
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Team Contact Cards */}
      <div className="mt-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-neutral-900">Contact our team</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: 'Adarsh Sharma', contact: '+91 87954 27984' },
            { name: 'Harsh Mishra', contact: '+91 99587 37531' },
            { name: 'Kapish Goel', contact: '+91 97176 88067' },
            { name: 'Swarnim Sharma', contact: '+91 85956 00798' },
            { name: 'Swastik Guha Roy', contact: '+91 70294 93046' },
          ].map((person, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg shadow-lg p-4 w-64 text-center flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-blue-500">{person.name}</h3>
              <p className="text-gray-700 mt-2">{person.contact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;