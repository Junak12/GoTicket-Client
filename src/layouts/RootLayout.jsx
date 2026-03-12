import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router'
import Footer from '../components/Footer/Footer'

const RootLayout = () => {
  return (
    <div className="px-40 py-5 min-h-screen bg-[#F5E8D8]/20 dark:bg-slate-900">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default RootLayout
