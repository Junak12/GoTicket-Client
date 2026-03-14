import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
  return (
    <div
      className="min-h-screen bg-[#F5E8D8]/20 dark:bg-slate-900
                    px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40
                    py-5"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="mt-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
