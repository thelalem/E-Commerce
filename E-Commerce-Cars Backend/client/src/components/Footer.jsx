import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCar } from 'react-icons/fa';

const Footer = () => {
  const locations = ["Addis Ababa", "Adama", "Dire Dawa"];
  const categories = ["SUV", "Sedan", "Pickup"]; 
  
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-600 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaCar className="text-2xl text-blue-300" />
              <span className="text-xl font-bold">AutoElite Ethiopia</span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Ethiopia's premier destination for luxury and performance vehicles. We offer the finest selection of new cars across major cities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2 mb-4">Our Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                    <span className="mr-2">›</span> {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Locations */}
          <div>
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2 mb-4">Our Locations</h3>
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location} className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-blue-100">{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-300 mr-3" />
                <span className="text-blue-100">+251 123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-300 mr-3" />
                <a href="mailto:info@autoelite-eth.com" className="text-blue-100 hover:text-white transition-colors">
                  info@autoelite-eth.com
                </a>
              </li>
              <li className="text-blue-100 text-sm mt-4">
                Open: Mon-Sat 8:30AM - 6:30PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AutoElite Ethiopia. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Financing Options
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Test Drive Booking
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;