import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/UserDashboard/Sidebar";


const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Outlet renders nested routes like Profile, MyBookings, Transactions */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
