import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import BookingModal from "../BookingModal/BookingModal";
import { motion } from "framer-motion";

const TicketDetails = () => {
  const { id } = useParams();
  const instance = useAxios();
  const [modalOpen, setModalOpen] = useState(false);
  const [departurePassed, setDeparturePassed] = useState(false);

  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => instance.get(`/tickets/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (ticket)
      setDeparturePassed(new Date(ticket.departureDateTime) < new Date());
  }, [ticket]);

  if (isLoading)
    return (
      <p className="text-center mt-20 text-lg dark:text-white">Loading...</p>
    );
  if (isError)
    return (
      <p className="text-center mt-20 text-lg dark:text-white">
        Error loading ticket
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
      {/* Left/Main Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-2 space-y-8"
      >
        {/* Hero Ticket Image */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-96 object-cover brightness-90"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6"
          >
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {ticket.title}
            </h1>
            <p className="text-gray-200 mt-1">
              {ticket.from} → {ticket.to}
            </p>
            <p className="text-gray-200 mt-1">
              Departure:{" "}
              <Countdown departureDateTime={ticket.departureDateTime} />
            </p>
            <p className="text-gray-200 mt-1">Vendor: {ticket.vendorEmail}</p>
          </motion.div>
        </motion.div>

        {/* Ticket Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border dark:border-slate-700"
        >
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            Ticket Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-medium">Transport Type</p>
              <p>{ticket.transportType}</p>
            </div>
            <div>
              <p className="font-medium">Price per Ticket</p>
              <p>৳ {ticket.price}</p>
            </div>
            <div>
              <p className="font-medium">Available Quantity</p>
              <p>{ticket.quantity}</p>
            </div>
            <div>
              <p className="font-medium">Departure Date</p>
              <p>{new Date(ticket.departureDateTime).toLocaleString()}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            disabled={ticket.quantity === 0 || departurePassed}
            className={`mt-8 w-full py-4 rounded-2xl font-semibold transition-all text-lg ${
              ticket.quantity === 0 || departurePassed
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
            }`}
          >
            {ticket.quantity === 0
              ? "Sold Out"
              : departurePassed
                ? "Booking Closed"
                : "Book Now"}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Summary Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-24 h-fit"
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border dark:border-slate-700 space-y-5">
          <h2 className="text-2xl font-semibold dark:text-white">Summary</h2>
          <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              <span className="font-medium">Route:</span> {ticket.from} →{" "}
              {ticket.to}
            </p>
            <p>
              <span className="font-medium">Price:</span> ৳ {ticket.price}
            </p>
            <p>
              <span className="font-medium">Available:</span> {ticket.quantity}{" "}
              Tickets
            </p>
            <p>
              <span className="font-medium">Departure:</span>{" "}
              <Countdown departureDateTime={ticket.departureDateTime} />
            </p>
            <p>
              <span className="font-medium">Vendor:</span> {ticket.vendorEmail}
            </p>
          </div>
        </div>
      </motion.div>

      {modalOpen && (
        <BookingModal
          ticket={ticket}
          closeModal={() => setModalOpen(false)}
          departurePassed={departurePassed}
        />
      )}
    </div>
  );
};


const Countdown = ({ departureDateTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(departureDateTime);
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

export default TicketDetails;
