import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Our Platform Component
const OurPlatform = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/team.jpg')", backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-neutral-900 opacity-70"></div>
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full text-white px-4 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">About Our Platform</h2>
        <p className="max-w-2xl text-lg">ZeroHunger connects food donors with those in need, creating a seamless and efficient process that benefits both parties.</p>
      </div>
    </section>
  );
};

// Our Services Component
const OurServices = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/services.jpg')", backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-neutral-900 opacity-70"></div>
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full text-white px-4 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
        <p className="max-w-2xl text-lg">We provide a platform for businesses, restaurants, and individuals to donate surplus food, ensuring that it reaches those in need while reducing waste.</p>
      </div>
    </section>
  );
};

// Our Work Component
const OurWork = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/work.jpg')", backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-neutral-900 opacity-70"></div>
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full text-white px-4 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h2>
        <p className="max-w-2xl text-lg">Our initiatives focus on reducing food wastage through community engagement, volunteer support, and partnerships with local organizations.</p>
      </div>
    </section>
  );
};

// Our Team Component
const OurTeam = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/overview.jpg')", backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-neutral-900 opacity-70"></div>
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full text-white px-4 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h2>
        <p className="max-w-2xl text-lg">Our dedicated team comprises passionate individuals committed to making a difference in our community.</p>
      </div>
    </section>
  );
};

// About Component
const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const homeRef = useRef(null);

  return (
    <div>
      {/* Navbar */}
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

      {/* Sections */}
      <div> {/* Offset for fixed Navbar */}
        <OurPlatform />
        <OurServices />
        <OurWork />
        <OurTeam />
      </div>

      {/* Footer Section */}
      <footer className="bg-blue-500 p-4 text-center text-white">
        <p>© 2024 ZeroHunger. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default About;