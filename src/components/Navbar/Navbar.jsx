import React, { useState } from "react";
import { LuSunMoon, LuUser, LuMenu } from "react-icons/lu";
import { Link, NavLink, useNavigate } from "react-router";
import useTheme from "../../hooks/Theme/useTheme";
import { useAuth } from "../../hooks/Auth/useAuth";
import userImage from "../../assets/userImage.png";

const Navbar = () => {
  const { toggleTheme } = useTheme();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Tickets", path: "/alltickets", private: true },
    {name:"Coverage Area", path:"/coveragearea"},
    {name: "About Us", path:'/about'},
    { name: "Dashboard", path: "/dashboard", private: true },
  ];

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/login"))
      .catch((err) => console.log(err));
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-6 md:px-40 py-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow-md z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold">
          <span className="text-cyan-400">Go</span>
          <span className="text-pink-500">Ticket</span>
        </h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link, index) => {
          if (link.private && !user) return null;

          return (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-lg font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-[#ACD487] text-white scale-105 shadow-md"
                    : "text-gray-700 dark:text-gray-200 hover:bg-[#ACD487]/20"
                }`
              }
            >
              {link.name}
            </NavLink>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LuSunMoon className="text-gray-600 dark:text-white" size={22} />
        </button>

        {/* User Section */}
        {user ? (
          <div className="relative">
            {/* Avatar */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden bg-[#ACD487]"
            >
              <img
                src={user?.photoURL || userImage}
                alt="user"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <p className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white border-b">
                  {user?.displayName || "User"}
                </p>

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
            Login
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <LuMenu size={26} className="text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden flex flex-col items-center py-6 gap-4">
          {navLinks.map((link, index) => {
            if (link.private && !user) return null;

            return (
              <NavLink
                key={index}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              >
                {link.name}
              </NavLink>
            );
          })}

          {!user && (
            <Link
              to="/login"
              className="px-5 py-2 bg-[#ACD487] text-white rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
