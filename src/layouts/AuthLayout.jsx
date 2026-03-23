import React from 'react'
import { Outlet, useNavigate } from 'react-router';
import { LuSunMoon } from "react-icons/lu";
import useTheme from '../hooks/Theme/useTheme';
import Footer from '../components/Footer/Footer';


const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="px-40 py-5 min-h-screen bg-[#F5E8D8]/20 dark:bg-slate-900">
      <div className="flex items-center justify-between cursor-pointer">
        <div
          onClick={() => navigate('/')}
        >
          <h1 className="text-4xl font-extrabold flex items-center">
            <span className=" text-cyan-400">Go</span>
            <span className="text-pink-500">Ticket</span>
          </h1>
        </div>
        <div>
          <div>
            <button onClick={toggleTheme}>
              <LuSunMoon className="text-gray-600 dark:text-white" size={24} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <Outlet />
      </div>

    </div>
  );
}

export default AuthLayout
