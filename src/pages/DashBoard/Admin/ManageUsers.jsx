import React, { useState } from "react";
import { motion } from "framer-motion";
import UserManagement from "../../../components/DashBoard/Admin/UserManagement";
import VendorRequests from "../../../components/DashBoard/Admin/VendorRequests";

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState("users");

  const baseStyle =
    "px-3 py-2 rounded-lg text-lg font-semibold transition-all duration-300 cursor-pointer";

  return (
    <div className="md:pl-60 py-5">
      <div className="flex items-center justify-evenly">
        {/* Users Button */}
        <div>
          <motion.button
            onClick={() => setActiveTab("users")}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: activeTab === "users" ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className={`${baseStyle}
              ${
                activeTab === "users"
                  ? "bg-[#ACD487] text-white border-2 border-[#ACD487]"
                  : "bg-transparent text-black dark:text-white border-2 border-transparent hover:bg-[#ACD487]/20"
              }`}
          >
            User Management
          </motion.button>
        </div>

        {/* Vendors Button */}
        <div>
          <motion.button
            onClick={() => setActiveTab("vendors")}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: activeTab === "vendors" ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className={`${baseStyle}
              ${
                activeTab === "vendors"
                  ? "bg-[#ACD487] text-white border-2 border-[#ACD487]"
                  : "bg-transparent text-black dark:text-white border-2 border-transparent hover:bg-[#ACD487]/20"
              }`}
          >
            Vendor Application
          </motion.button>
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "users" && <UserManagement />}
        {activeTab === "vendors" && <VendorRequests />}
      </motion.div>
    </div>
  );
};

export default ManageUsers;
