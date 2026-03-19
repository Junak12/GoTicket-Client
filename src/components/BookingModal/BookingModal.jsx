import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/Axios/useAxios";
import { useAuth } from "../../hooks/Auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

const BookingModal = ({ ticket, closeModal, departurePassed }) => {
  const instance = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const bookedSeats = ticket.bookedSeats || [];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedPerks, setSelectedPerks] = useState([]);

  const getLayout = (type) => {
    switch (type.toLowerCase()) {
      case "plane":
        return { columns: ["A", "B", "C", null, "D", "E", "F"], rows: 10 };
      case "train":
        return { columns: ["A", "B", "C", null, "D", "E"], rows: 8 };
      case "bus":
      default:
        return { columns: ["A", "B", null, "C", "D"], rows: 6 };
    }
  };

  const layout = getLayout(ticket.transportType);
  const seatsLayout = Array.from({ length: layout.rows }, (_, row) =>
    layout.columns.map((col) => (col ? `${row + 1}${col}` : null)),
  );

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat) || departurePassed) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const togglePerk = (perk) => {
    setSelectedPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk],
    );
  };

  const totalPrice =
    selectedSeats.length * ticket.price +
    selectedPerks.reduce((sum, perk) => sum + perk.price, 0);

  const handleSubmit = async () => {
    if (departurePassed) {
      Swal.fire("Oops", "Cannot book. Departure date passed!", "error");
      return;
    }
    if (!selectedSeats.length) {
      Swal.fire("Error", "Please select seats", "error");
      return;
    }

    try {
      const res = await instance.post("/book-ticket", {
        ticketId: ticket._id,
        email: user.email,
        seats: selectedSeats,
        totalPrice,
        selectedPerks,
        vendorEmail: ticket.vendorEmail,
      });

      if (res.data.success) {
        Swal.fire("Success", "Booking created in Pending status", "success");
        queryClient.invalidateQueries(["ticket", ticket._id]);
        closeModal();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 md:p-8 max-w-full w-full md:flex shadow-2xl overflow-hidden flex-col md:flex-row"
      >
        {/* Left panel: Seats & Perks */}
        <div className="flex-1 md:pr-6 overflow-y-auto mb-6 md:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">
            Book Your {ticket.transportType} Ticket
          </h2>

          {/* Seat Legend */}
          <div className="flex flex-wrap gap-3 mb-4 sm:mb-5 text-xs sm:text-sm">
            <Legend color="bg-purple-500" label="Selected" />
            <Legend color="bg-red-400" label="Booked" />
            <Legend color="bg-gray-200" label="Available" />
          </div>

          {/* Seats Layout */}
          <div className="space-y-2 mb-4 sm:mb-6">
            {seatsLayout.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex justify-center gap-1 sm:gap-2"
              >
                {row.map((seat, colIndex) =>
                  seat ? (
                    <motion.button
                      key={seat}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleSeat(seat)}
                      disabled={bookedSeats.includes(seat) || departurePassed}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg text-xs sm:text-sm md:text-sm font-bold transition flex items-center justify-center
                        ${
                          bookedSeats.includes(seat)
                            ? "bg-red-400 cursor-not-allowed"
                            : selectedSeats.includes(seat)
                              ? "bg-purple-600 text-white shadow-lg"
                              : "bg-gray-200 dark:bg-slate-700 dark:text-white"
                        }`}
                    >
                      {seat}
                    </motion.button>
                  ) : (
                    <div key={colIndex} className="w-2 sm:w-4 md:w-6" />
                  ),
                )}
              </div>
            ))}
          </div>

          {/* Perks */}
          {ticket.perks && ticket.perks.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="font-semibold text-sm sm:text-lg mb-2 dark:text-white">
                Optional Perks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {ticket.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    onClick={() => togglePerk(perk)}
                    className={`flex justify-between items-center p-2 sm:p-3 border rounded-lg cursor-pointer transition
                      ${
                        selectedPerks.includes(perk)
                          ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                          : "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 dark:text-white"
                      }`}
                  >
                    <span className="font-medium text-xs sm:text-sm">
                      {perk.name}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm">
                      +৳{perk.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel: Summary & Actions */}
        <div className="w-full md:w-80 bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-inner">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 dark:text-white">
              Summary
            </h3>
            <p className="mb-1 dark:text-gray-300 text-xs sm:text-sm">
              Seats Selected:{" "}
              {selectedSeats.length ? selectedSeats.join(", ") : "None"}
            </p>
            {selectedPerks.length > 0 && (
              <div className="mb-1">
                <p className="text-xs sm:text-sm dark:text-gray-300">Perks:</p>
                <ul className="list-disc list-inside text-xs sm:text-sm dark:text-gray-300">
                  {selectedPerks.map((perk, idx) => (
                    <li key={idx}>
                      {perk.name} (+৳{perk.price})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-base sm:text-lg font-semibold mt-2 dark:text-white">
              Total Price: ৳ {totalPrice}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2 sm:gap-3">
            <button
              onClick={closeModal}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm sm:text-base"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <span className="flex items-center gap-2 dark:text-gray-300 text-xs sm:text-sm">
    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${color}`} />
    {label}
  </span>
);

export default BookingModal;
