// src/pages/Dashboard/BookingRow.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

// Countdown Component
const Countdown = ({ departureDateTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(departureDateTime + "Z"); // UTC
      const diff = departure - now;

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

const BookingRow = ({ booking }) => {
  const {
    ticketTitle,
    ticketImage,
    from,
    to,
    seats,
    totalPrice,
    departureDateTime,
    status,
    selectedPerks,
  } = booking;

  const [isExpired, setIsExpired] = useState(false);

  const handlePayment = () => {
    if (status !== "accepted" || isExpired) return;
    console.log("Proceed to payment:", booking);
    // TODO: Stripe integration
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="hover:bg-gray-50 dark:hover:bg-slate-700"
    >
      <td className="px-4 py-2 flex items-center gap-2">
        <img
          src={ticketImage}
          alt={ticketTitle}
          className="w-12 h-12 object-cover rounded"
        />
        <span>{ticketTitle}</span>
      </td>

      <td className="px-4 py-2">
        {from} → {to}
      </td>
      <td className="px-4 py-2">{seats.join(", ")}</td>

      <td className="px-4 py-2">
        {selectedPerks && selectedPerks.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedPerks.map((perk, i) => (
              <span
                key={i}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
              >
                {perk.name} (+৳{perk.price})
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No perks</span>
        )}
      </td>

      <td className="px-4 py-2">৳ {totalPrice}</td>

      {/* Departure countdown */}
      <td className="px-4 py-2">
        <Countdown departureDateTime={departureDateTime} />
      </td>

      {/* Status */}
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 rounded text-xs ${
            status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : status === "accepted"
                ? "bg-blue-200 text-blue-800"
                : status === "paid"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-2">
        <button
          onClick={handlePayment}
          disabled={status !== "accepted" || isExpired}
          className={`px-3 py-1 rounded text-white ${
            status === "accepted" && !isExpired
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Pay Now
        </button>
      </td>
    </motion.tr>
  );
};

export default BookingRow;
