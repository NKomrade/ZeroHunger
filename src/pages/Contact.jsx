import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle form submission (e.g., send to an API or admin email)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white min-h-screen"> {/* Full page background color */}
      {/* Navbar Component */}
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to="/">ZeroHunger</Link>
        </div>
        <div>
          <Link to="/" className="text-white mx-2 hover:underline transition duration-200">Home</Link>
          <Link to="/about" className="text-white mx-2 hover:underline transition duration-200">About</Link>
          <Link to="/contact" className="text-white mx-2 hover:underline transition duration-200">Contact</Link>
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
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;