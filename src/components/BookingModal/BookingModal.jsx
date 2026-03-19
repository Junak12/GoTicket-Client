
import React, { useState, useEffect } from "react";
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

  const getLayout = (type) => {
    switch (type) {
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

  const totalPrice = selectedSeats.length * ticket.price;

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
        vendorEmail: ticket.vendorEmail,
      });

      if (res.data.success) {
        Swal.fire("Success", "Booking created in Pending status", "success");
        queryClient.invalidateQueries(["ticket", ticket._id]);
        closeModal();
      }
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Book Tickets
        </h2>

        <div className="flex flex-wrap gap-2 text-xs mb-3">
          <Legend color="bg-purple-500" label="Selected" />
          <Legend color="bg-red-400" label="Booked" />
          <Legend color="bg-gray-200" label="Available" />
        </div>

        <div className="space-y-2 mb-4">
          {seatsLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((seat, colIndex) =>
                seat ? (
                  <motion.button
                    key={seat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSeat(seat)}
                    disabled={bookedSeats.includes(seat) || departurePassed}
                    className={`w-10 h-10 rounded text-xs font-bold transition
                      ${
                        bookedSeats.includes(seat)
                          ? "bg-red-400 cursor-not-allowed"
                          : selectedSeats.includes(seat)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-slate-700 dark:text-white"
                      }`}
                  >
                    {seat}
                  </motion.button>
                ) : (
                  <div key={colIndex} className="w-4" />
                ),
              )}
            </div>
          ))}
        </div>

        <p className="mb-2 dark:text-gray-300">
          Selected Seats:{" "}
          {selectedSeats.length ? selectedSeats.join(", ") : "None"}
        </p>
        <p className="mb-4 dark:text-gray-300">Total Price: ৳ {totalPrice}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
          >
            Submit
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

export default BookingModal;
