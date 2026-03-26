import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useRole } from "../../../hooks/Role/useRole";
import { LuSunMoon } from "react-icons/lu";
import { FcAdvertising } from "react-icons/fc";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaHandHoldingDollar } from "react-icons/fa6";
import {
  FaUser,
  FaTicketAlt,
  FaMoneyCheckAlt,
  FaUsers,
  FaStore,
  FaClipboardList,
} from "react-icons/fa";
import useTheme from "../../../hooks/Theme/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { icon } from "leaflet";

const Sidebar = () => {
  const role = useRole();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme } = useTheme();
  //console.log(role);
  

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700";

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
      name: "Add Tickets",
      to: "/dashboard/vendor/add-ticket",
      icon: <FaTicketAlt />,
    },
    {
      name: "My Added Tickets",
      to: "/dashboard/vendor/my-ticket",
      icon: <FaClipboardList />,
    },
    {
      name: "Requested Bookings",
      to: "/dashboard/vendor/requested-bookings",
      icon: <MdOutlinePendingActions />,
    },
    {
      name: "Total Revenue",
      to: "/dashboard/vendor/revenue",
      icon: <FaHandHoldingDollar />,
    },
  ];

  const adminLinks = [
    {
      name: "Admin Profile",
      to: "/dashboard/admin/profile",
      icon: <FaUsers />,
    },
    {
      name: "Manage Users",
      to: "/dashboard/admin/manage-users",
      icon: <FaStore />,
    },
    {
      name: "Manage Tickets",
      to: "/dashboard/admin/manage-tickets",
      icon: <FaTicketAlt />,
    },
    {
      name: "Advertise Tickets",
      to: "/dashboard/admin/advertise-tickets",
      icon: <FcAdvertising />,
    },
  ];

  const getLinks = () => {
    if (role === "user") return userLinks;
    if (role === "vendor") return vendorLinks;
    if (role === "admin") return adminLinks;
    return [];
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{
          x: mobileOpen || window.innerWidth >= 768 ? 0 : -300,
          width: collapsed ? 80 : 256,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 h-full z-50 bg-white dark:bg-slate-900 shadow-lg flex flex-col"
      >
        {/* Header */}
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
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-200 dark:text-white dark:hover:bg-slate-700"
            >
              <LuSunMoon size={22} />
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              {collapsed ? "➡️" : "⬅️"}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              {mobileOpen ? "✖️" : "☰"}
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 px-2 flex-1 overflow-y-auto">
          {getLinks().map((link) => (
            <motion.div
              key={link.to}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""} ${
                    collapsed ? "justify-center" : ""
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{link.icon}</span>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {link.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-xs text-gray-400 text-center border-t dark:border-slate-700"
          >
            © 2026 GoTicket
          </motion.div>
        )}
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 md:hidden bg-purple-500 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </motion.button>
    </>
  );
};

export default Sidebar;
