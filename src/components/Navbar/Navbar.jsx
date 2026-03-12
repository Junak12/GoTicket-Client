import React from "react";
import { LuSunMoon } from "react-icons/lu";
import useTheme from "../../hooks/Theme/useTheme";
import { Link, NavLink, useNavigate } from "react-router";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Tickets", path: "/alltickets" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav className="w-full px-6  py-4 flex items-center justify-between  transition-colors duration-300 ">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center gap-1"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center">
          <span className="text-cyan-400">Go</span>
          <span className="text-pink-500">Ticket</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300
               ${
                 isActive
                   ? "bg-[#ACD487] text-white scale-105 shadow-md"
                   : "text-gray-700 dark:text-gray-200 hover:bg-[#ACD487]/20 hover:text-gray-900 dark:hover:text-white"
               }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <LuSunMoon className="text-gray-600 dark:text-white" size={24} />
        </button>

        {/* Account/Login */}
        <Link
          to="/login"
          className="px-4 py-2 bg-[#ACD487] text-white font-semibold rounded-lg shadow-md hover:bg-[#7b5ee3] transition-all duration-300"
        >
          Account
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
