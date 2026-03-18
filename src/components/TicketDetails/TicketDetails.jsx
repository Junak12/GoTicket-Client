import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/Auth/useAuth";

const TicketDetails = () => {
  const { id } = useParams();
  const instance = useAxios();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const {user} = useAuth();

  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => instance.get(`/tickets/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (isError) return <p className="text-center mt-20">Error loading</p>;

  const bookedSeats = ticket.bookedSeats || [];


  const getLayout = (type) => {
    switch (type) {
      case "plane":
        return {
          columns: ["A", "B", "C", null, "D", "E", "F"],
          rows: 10,
          classMap: (row) => (row <= 2 ? "business" : "economy"),
        };
      case "train":
        return {
          columns: ["A", "B", "C", null, "D", "E"],
          rows: 8,
          classMap: () => "sleeper",
        };
      case "bus":
      default:
        return {
          columns: ["A", "B", null, "C", "D"],
          rows: 6,
          classMap: () => "standard",
        };
    }
  };

  const layout = getLayout(ticket.transportType);


  const generateSeats = () => {
    const seats = [];
    for (let row = 1; row <= layout.rows; row++) {
      const currentRow = [];
      layout.columns.forEach((col) => {
        currentRow.push(col ? `${row}${col}` : null);
      });
      seats.push(currentRow);
    }
    return seats;
  };

  const seatsLayout = generateSeats();

  const getSeatStyle = (seat, row) => {
    if (bookedSeats.includes(seat)) return "bg-red-400 cursor-not-allowed";

    if (selectedSeats.includes(seat))
      return "bg-purple-600 text-white shadow-lg scale-105";

    const seatClass = layout.classMap(row);
    switch (seatClass) {
      case "business":
        return "bg-yellow-200 dark:bg-yellow-500/30";
      case "economy":
        return "bg-blue-200 dark:bg-blue-500/30";
      case "sleeper":
        return "bg-green-200 dark:bg-green-500/30";
      default:
        return "bg-gray-200 dark:bg-slate-700 dark:text-white";
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const totalPrice = selectedSeats.length * ticket.price;

const handlePayment = async () => {
  if (!selectedSeats.length) {
    alert("Select seats first");
    return;
  }

  try {
    const res = await instance.post("/create-checkout-session", {
      totalPrice,
      email: user?.email,
      vendorName:ticket.title,
    });

    window.location.href = res.data.url;
  } catch (err) {
    console.log(err);
    alert("Payment failed");
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 py-18 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-80 object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white">{ticket.title}</h1>
            <p className="text-gray-200">
              {ticket.from} → {ticket.to}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Select Your Seat
          </h2>

          <div className="flex flex-wrap gap-3 text-xs mb-6">
            <Legend color="bg-purple-500" label="Selected" />
            <Legend color="bg-red-400" label="Booked" />
          </div>

          <div className="space-y-3">
            {seatsLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-3">
                {row.map((seat, colIndex) =>
                  seat ? (
                    <motion.button
                      key={seat}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      title={`Seat ${seat}`}
                      onClick={() => toggleSeat(seat)}
                      disabled={bookedSeats.includes(seat)}
                      className={`w-11 h-11 rounded-lg text-xs font-bold transition
                        ${getSeatStyle(seat, rowIndex + 1)}
                      `}
                    >
                      {seat}
                    </motion.button>
                  ) : (
                    <div key={colIndex} className="w-6" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-24 h-fit">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border dark:border-slate-700 space-y-5">
          <h2 className="text-xl font-semibold dark:text-white">
            Booking Summary
          </h2>

          <p className="text-sm dark:text-gray-300">
            {ticket.from} → {ticket.to}
          </p>

          <p className="text-sm dark:text-gray-300">Price: ৳ {ticket.price}</p>

          <div>
            <p className="text-sm font-medium mb-2 dark:text-white">Seats</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.length ? (
                selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 rounded-full text-xs"
                  >
                    {seat}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No seats selected</p>
              )}
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold dark:text-white">
            <span>Total</span>
            <span>৳ {totalPrice}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={ticket.quantity === 0}
            className={`w-full py-3 rounded-xl font-semibold transition
              ${
                ticket.quantity === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
              }
            `}
          >
            {ticket.quantity === 0 ? "Sold Out" : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <span className="flex items-center gap-2 dark:text-gray-300">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </span>
);

export default TicketDetails;
