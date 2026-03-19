
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import { motion } from "framer-motion";
import BookingModal from "../BookingModal/BookingModal";

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

  // check if departure passed
  useEffect(() => {
    if (ticket) {
      setDeparturePassed(new Date(ticket.departureDateTime) < new Date());
    }
  }, [ticket]);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (isError) return <p className="text-center mt-20">Error loading ticket</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-3 gap-10">
      {/* Main Ticket Info */}
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
            <p className="text-gray-200 mt-1">
              Departure:{" "}
              <Countdown departureDateTime={ticket.departureDateTime} />
            </p>
            <p className="text-gray-200 mt-1">Vendor: {ticket.vendorEmail}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Ticket Details
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Transport Type:{" "}
            <span className="font-medium">{ticket.transportType}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Price per Ticket:{" "}
            <span className="font-medium">৳ {ticket.price}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Available Quantity:{" "}
            <span className="font-medium">{ticket.quantity}</span>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            disabled={ticket.quantity === 0 || departurePassed}
            className={`w-full py-3 rounded-xl font-semibold transition
              ${
                ticket.quantity === 0 || departurePassed
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
              }
            `}
          >
            {ticket.quantity === 0
              ? "Sold Out"
              : departurePassed
                ? "Booking Closed"
                : "Book Now"}
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="sticky top-24 h-fit">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border dark:border-slate-700 space-y-5">
          <h2 className="text-xl font-semibold dark:text-white">Summary</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {ticket.from} → {ticket.to}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Price: ৳ {ticket.price}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Available: {ticket.quantity} Tickets
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Departure:{" "}
            <Countdown departureDateTime={ticket.departureDateTime} />
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Vendor: {ticket.vendorEmail}
          </p>
        </div>
      </div>

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

// Countdown Component
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

  return <span className="text-red-500 font-semibold">{timeLeft}</span>;
};

export default TicketDetails;
