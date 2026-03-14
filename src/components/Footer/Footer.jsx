import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ACD487] dark:bg-slate-900 text-slate-800 dark:text-slate-50 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-white">
              GoTicket
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              GoTicket is your one-stop solution for event booking. Discover,
              plan, and enjoy your favorite events with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {["Home", "Events", "Pricing", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:underline hover:text-gray-900 dark:hover:text-[#ACD487] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-[#ACD487] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="hover:text-blue-400 dark:hover:text-[#ACD487] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-pink-600 dark:hover:text-[#ACD487] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-blue-700 dark:hover:text-[#ACD487] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300 dark:border-gray-700" />

        {/* Copyright */}
        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
          &copy; {new Date().getFullYear()} GoTicket. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
