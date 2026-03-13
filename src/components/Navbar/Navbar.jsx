import React, { useState } from "react";
import { LuSunMoon, LuUser } from "react-icons/lu";
import useTheme from "../../hooks/Theme/useTheme";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/Auth/useAuth";
import userImage from "../../assets/userImage.png"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Tickets", path: "/alltickets" },
    { name: "About Us", path: "/about" },
  ];

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-40 py-5 flex items-center justify-between bg-white dark:bg-gray-900 shadow-md z-50">
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
                  : "text-gray-700 dark:text-gray-200 hover:bg-[#ACD487]/20"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LuSunMoon className="text-gray-600 dark:text-white" size={24} />
        </button>

        {/* User Section */}
        {user ? (
          <div className="relative">
            {/* Avatar */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-[#ACD487] flex items-center justify-center"
            >
              {user.photoURL ? (
                <img
                  src={user?.photoURL || userImage}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <LuUser className="text-white" size={22} />
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute z-50 right-0 mt-3 w-40 bg-[#fbfcff] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-[#ACD487] text-white font-semibold rounded-lg shadow-md hover:bg-[#9BCB75]"
          >
            Account
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
