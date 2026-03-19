import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useRole } from "../../hooks/Role/useRole";
import { LuSunMoon } from "react-icons/lu";
import {
  FaUser,
  FaTicketAlt,
  FaMoneyCheckAlt,
  FaUsers,
  FaStore,
  FaClipboardList,
} from "react-icons/fa";
import useTheme from "../../hooks/Theme/useTheme";


const Sidebar = () => {
  const role = useRole();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200";

  const activeLink = "bg-purple-500 text-white shadow-md";

  const userLinks = [
    { name: "User Profile", to: "/dashboard/user/profile", icon: <FaUser /> },
    {
      name: "My Booked Tickets",
      to: "/dashboard/user/my-bookings",
      icon: <FaTicketAlt />,
    },
    {
      name: "Transaction History",
      to: "/dashboard/user/my-transactions",
      icon: <FaMoneyCheckAlt />,
    },
  ];

  const vendorLinks = [
    {
      name: "Vendor Profile",
      to: "/dashboard/vendor/profile",
      icon: <FaUser />,
    },
    {
      name: "Manage Tickets",
      to: "/dashboard/vendor/tickets",
      icon: <FaTicketAlt />,
    },
    {
      name: "Booking Requests",
      to: "/dashboard/vendor/bookings",
      icon: <FaClipboardList />,
    },
  ];

  const adminLinks = [
    { name: "Manage Users", to: "/dashboard/admin/users", icon: <FaUsers /> },
    {
      name: "Manage Vendors",
      to: "/dashboard/admin/vendors",
      icon: <FaStore />,
    },
    {
      name: "All Tickets",
      to: "/dashboard/admin/tickets",
      icon: <FaTicketAlt />,
    },
  ];

  const getLinks = () => {
    switch (role) {
      case "user":
        return userLinks;
      case "vendor":
        return vendorLinks;
      case "admin":
        return adminLinks;
      default:
        return [];
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-white dark:bg-slate-900
          shadow-lg flex flex-col
          transition-all duration-300
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"} 
          ${collapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Logo + Buttons */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div
            onClick={() => navigate("/")}
            className={`cursor-pointer flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}
          >
            {!collapsed && (
              <h1 className="text-2xl font-extrabold">
                <span className="text-cyan-500">Go</span>
                <span className="text-pink-500">Ticket</span>
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              <LuSunMoon className="text-gray-600 dark:text-white" size={22} />
            </button>

            {/* Collapse Button for desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              {collapsed ? "➡️" : "⬅️"}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              {mobileOpen ? "✖️" : "☰"}
            </button>
          </div>
        </div>

        {/* Role Label */}
        {!collapsed && (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wide">
            Role: <span className="capitalize">{role}</span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 px-2 flex-1 overflow-y-auto">
          {getLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : ""} ${collapsed ? "justify-center" : ""}`
              }
              onClick={() => setMobileOpen(false)}
              data-tooltip-id={collapsed ? `tooltip-${link.name}` : undefined}
              data-tooltip-content={collapsed ? link.name : undefined}
            >
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 text-xs text-gray-400 dark:text-gray-500 text-center border-t border-gray-200 dark:border-slate-700">
            © 2026 GoTicket
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="fixed bottom-4 right-4 md:hidden bg-purple-500 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </button>
    </>
  );
};

export default Sidebar;
