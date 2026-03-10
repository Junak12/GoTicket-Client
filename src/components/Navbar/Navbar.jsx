import React, { useEffect, useState } from 'react'
import { LuSunMoon } from "react-icons/lu";

const Navbar = () => {
  const [darkMode , setDarkMode] = useState(false);

  //load mode from local storage
  useEffect(() => {
    const saveMode = localStorage.getItem("theme");
    if (saveMode === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [])

  //toggle mode 

  const handleMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <div>
      Navbar
      <button onClick={handleMode}>
        <LuSunMoon />
      </button>
    </div>
  );
}

export default Navbar
