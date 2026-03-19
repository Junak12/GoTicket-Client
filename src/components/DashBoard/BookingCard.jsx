// src/pages/Dashboard/BookingCard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BookingCard = ({ booking }) => {
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

  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // ⏳ Countdown logic
  useEffect(() => {
    if (status === "rejected" || status === "paid") return;

    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(departureDateTime + "Z");
      const diff = departure - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [departureDateTime, status]);

  // 💳 Payment handler
  const handlePayment = async () => {
    if (status !== "accepted" || isExpired) return;

    console.log("Proceed to payment:", booking);
    // 👉 TODO: Stripe integration here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex flex-col gap-2"
    >
      {/* Image */}
      <img
        src={ticketImage}
        alt={ticketTitle}
        className="w-full h-36 object-cover rounded-lg"
      />

      {/* Title */}
      <h2 className="text-lg font-semibold">{ticketTitle}</h2>

      {/* Route */}
      <p className="text-sm text-gray-500">
        {from} → {to}
      </p>

      {/* Seats */}
      <p className="text-sm">Seats: {seats}</p>

      {/* Price */}
      <p className="text-sm font-medium">৳ {totalPrice}</p>

      {/* ✅ Perks (ONLY if exists) */}
      {selectedPerks && selectedPerks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedPerks.map((perk, i) => (
            <span
              key={i}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
            >
              {perk.name} (+৳{perk.price})
            </span>
          ))}
        </div>
      )}

      {/* Departure */}
      <p className="text-xs text-gray-400">
        Departure: {new Date(departureDateTime + "Z").toLocaleString()}
      </p>

      {/* Status + Countdown */}
      <div className="flex items-center gap-2 flex-wrap">
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

        {/* Countdown */}
        {status === "accepted" && !isExpired && (
          <span className="text-xs text-gray-500">⏳ {timeLeft}</span>
        )}

        {status === "accepted" && isExpired && (
          <span className="text-xs text-red-500">Payment expired</span>
        )}

        {status === "rejected" && (
          <span className="text-xs text-red-500">Booking rejected</span>
        )}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={status !== "accepted" || isExpired}
        className={`mt-2 px-4 py-2 rounded-lg text-white transition-all ${
          status === "accepted" && !isExpired
            ? "bg-purple-500 hover:bg-purple-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Pay Now
      </button>
    </motion.div>
  );
};

export default BookingCard;
