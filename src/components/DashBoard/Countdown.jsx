import React, { useEffect, useState } from "react";

const Countdown = ({ departureDateTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!departureDateTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(departureDateTime);
      const diff = departure - now;

      if (isNaN(departure)) {
        setTimeLeft("Invalid date");
        clearInterval(interval);
        return;
      }

      if (diff <= 0) {
        setTimeLeft("Departure passed");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [departureDateTime]);

  return (
    <span className="text-red-500 font-semibold bg-red-100 dark:bg-red-900 px-2 py-1 rounded-lg">
      {timeLeft}
    </span>
  );
};

export default Countdown;
