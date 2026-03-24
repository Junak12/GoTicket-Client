import React, { useState, useEffect } from "react";
import useAxios from "../../../hooks/Axios/useAxios";
import Swal from "sweetalert2";
import { useAuth } from "../../../hooks/Auth/useAuth";

// Countdown Component
const Countdown = ({ departureDateTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!departureDateTime) {
      setTimeLeft("N/A");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(departureDateTime + "Z");

      if (isNaN(departure.getTime())) {
        setTimeLeft("Invalid date");
        clearInterval(interval);
        return;
      }

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
    _id: bookingId,
    ticketTitle,
    ticketImage,
    from,
    to,
    seats,
    totalPrice,
    departureDateTime,
    status,
    selectedPerks,
    ticketId,
  } = booking;

  const instance = useAxios();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const handlePayment = async () => {
    if (status !== "approved") return;
    if (!user?.email) return Swal.fire("Error", "User not logged in", "error");

    setPaying(true);

    try {
      // Send bookingId to backend
      const res = await instance.post("/create-checkout-session", {
        totalPrice,
        email: user.email,
        vendorName: ticketTitle,
        ticketId,
        seats,
        bookingId, 
      });

      if (res.data?.url) {
        Swal.fire({
          title: "Redirecting...",
          text: "Taking you to secure payment gateway",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect to Stripe checkout
        setTimeout(() => {
          window.location.href = res.data.url;
        }, 1500);
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      Swal.fire({
        title: "Payment Failed",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }

    setPaying(false);
  };

  const isPaid = status === "paid";
  const canPay = status === "approved" && !isPaid;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
      {/* Ticket */}
      <td className="px-4 py-2 flex items-center gap-2">
        <img
          src={ticketImage}
          alt={ticketTitle}
          className="w-12 h-12 object-cover rounded"
        />
        <span>{ticketTitle}</span>
      </td>

      {/* Route */}
      <td className="px-4 py-2">
        {from} → {to}
      </td>

      {/* Seats */}
      <td className="px-4 py-2">{seats?.join(", ")}</td>

      {/* Perks */}
      <td className="px-4 py-2">
        {selectedPerks?.length > 0 ? (
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

      {/* Price */}
      <td className="px-4 py-2">৳ {totalPrice}</td>

      {/* Countdown */}
      <td className="px-4 py-2">
        <Countdown departureDateTime={departureDateTime} />
      </td>

      {/* Status */}
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : status === "approved"
                ? "bg-blue-200 text-blue-800"
                : status === "paid"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </span>
      </td>

      {/* Payment Button / Badge */}
      <td className="px-4 py-2">
        {isPaid ? (
          <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold">
            ✅ Paid
          </span>
        ) : (
          <button
            onClick={handlePayment}
            disabled={!canPay || paying}
            className={`px-3 py-1 rounded text-white transition ${
              canPay
                ? "bg-[#00c950] hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        )}
      </td>
    </tr>
  );
};

export default BookingRow;
