
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-umblue text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-10 bg-white rounded-lg" />
              <span className="font-heading font-semibold text-lg">
                UM Surabaya
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Universitas Muhammadiyah Surabaya<br />
              Classroom Booking System
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Book a Room
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-sm text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">
                Email: info@um-surabaya.ac.id
              </li>
              <li className="text-sm text-gray-300">
                Phone: +62 31 5999424
              </li>
              <li className="text-sm text-gray-300">
                Address: Jl. Sutorejo No.59, Surabaya
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>© {currentYear} Universitas Muhammadiyah Surabaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
