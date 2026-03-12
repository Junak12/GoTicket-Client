import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ACD487] dark:bg-slate-900 text-slate-800 dark:text-slate-50 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">GoTicket</h3>
            <p className="text-sm">
              GoTicket is your one-stop solution for event booking. Discover,
              plan, and enjoy your favorite events with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-600">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-pink-600">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-blue-700">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-300 dark:border-slate-700" />

        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} GoTicket. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
