import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-green-600 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg">ZeroHunger</div>
      <div>
        <Link to="/" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Home</Link>
        <Link to="/donate" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Donate</Link>
        <Link to="/about" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">About</Link>
        <Link to="/contact" className="text-white mx-2 hover:underline hover:text-green-300 transition duration-200">Contact</Link>
        <Link to="/login" className="text-white mx-2 hover:bg-green-500 transition duration-200 rounded-full px-4 py-2">Log in</Link>
        <Link to="/signup" className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-green-200 transition duration-200">Sign up</Link>
      </div>
    </nav>
  );
};
const Hero = () => {
  const navigate = useNavigate();

  const images = [
    '/food.jpg',
    '/hunger.jpg',
    '/connect.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (nextImageIndex !== currentImageIndex) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
      }, 300); // Wait for fade-out before changing current image to match new transition duration

      return () => clearTimeout(timer);
    }
  }, [nextImageIndex, currentImageIndex]);

  const handleGetInvolved = () => {
    navigate('/donate');
  };

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Hero ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`} // Changed duration from 500 to 300
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white">Welcome to ZeroHunger</h1>
        <p className="mt-2 text-white">Tackling food wastage and feeding those in need with our decentralized initiative</p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-500"
          onClick={handleGetInvolved}
        >
          Get Involved
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setNextImageIndex(index)}
            className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Donation Component
const Donation = () => {
  return (
      <div className="border p-4 rounded-lg text-center overflow-hidden w-96 h-112">
        <Link to="/donor/dashboard" className="w-full">
        <img 
          src="/image-1.jpg" 
          alt="Donation" 
          className="w-full h-48 object-cover rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105" 
        />
        <h2 className="text-2xl font-bold">Donate</h2>
        <p>Easily donate surplus food from your business, restaurant, or home.</p>
        </Link>
      </div>
  );
};

// Recipient Component
const Recipient = () => {
  return (
    <div className="border p-4 rounded-lg text-center overflow-hidden w-96 h-112">
      <Link to="/recipient/dashboard" className="w-full">
      <img 
        src="/image-2.jpg" 
        alt="Recipient" 
        className="w-full h-48 object-cover rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105" 
      />
      <h2 className="text-2xl font-bold">Recipient</h2>
      <p>Request food and receive timely donations for shelters, orphanages, and individuals in need.</p>
      </Link>
    </div>
  );
};

// Volunteer Component
const Volunteer = () => {
  return (
    <div className="border p-4 rounded-lg text-center overflow-hidden w-96 h-112">
      <Link to="/volunteer/dashboard" className="w-full">
      <img 
        src="/image-3.jpg" 
        alt="Volunteer" 
        className="w-full h-48 object-cover rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105" 
      />
      <h2 className="text-2xl font-bold">Volunteer</h2>
      <p>Join our team of delivery partners and help deliver food to those in need.</p>
      </Link>
    </div>
  );
};

// Overview Component
const Overview = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg mt-8 shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-neutral-950">Overview of ZeroHunger</h2>
      <div className="flex justify-center items-center w-full">
        <img 
          src="/image-4.jpg" 
          alt="Overview" 
          className="w-1/2 h-auto rounded-lg object-cover mb-4"
        />
        <div className="w-1/2 p-4">
          <p className="mb-4 text-lg leading-relaxed">
            ZeroHunger is a decentralized initiative aimed at reducing food wastage and feeding those in need. 
            By connecting donors and recipients through a user-friendly platform, we make it easy for businesses, restaurants, 
            and individuals to donate surplus food. 
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Our mission extends beyond just food donation. We work tirelessly to educate the community about the impacts of food waste 
            and the importance of sharing resources. Recipients, including shelters, orphanages, and individuals in need, can easily 
            request timely donations, ensuring that no food goes to waste.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            At ZeroHunger, we believe that everyone deserves access to nutritious food. Join us in our mission to create a sustainable 
            and compassionate community where food is shared, and hunger is diminished. Together, we can make a difference in the lives 
            of those who are struggling and promote a culture of giving and sharing.
          </p>
          <Link to="/about">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-200 mt-4">
              Join Us Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  console.log("HomePage rendered"); 
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="flex justify-around p-4">
        <Donation />
        <Recipient />
        <Volunteer />
      </div>
      <Overview /> {/* Added Overview Component */}
    </div>
  );
};

export default HomePage;