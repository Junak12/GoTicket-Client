import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "../../../hooks/Auth/useAuth";
import useAxios from "../../../hooks/Axios/useAxios";
import useAxiosSecure from "../../../hooks/AxiosSecure/useAxiosSecure";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const MyAddedTickets = () => {
  const { user } = useAuth();
  const instance = useAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["vendorTickets", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/vendor/get-ticket/${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async (id, status) => {
    if (status === "rejected") return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ticket will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(
        `/vendor/my-tickets/delete-ticket/${id}`,
      );
      if (res.data.success) {
        Swal.fire("Deleted!", "Ticket removed successfully", "success");
        queryClient.invalidateQueries(["vendorTickets"]);
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Delete failed",
        "error",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="pl-4 sm:pl-6 md:pl-70 pr-4 sm:pr-6 md:pr-12 py-8  min-h-screen">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-cyan-500  bg-clip-text">
        My Added Tickets
      </h1>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No tickets found</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tickets.map((ticket) => {
            const isRejected = ticket.status === "rejected";

            return (
              <motion.div
                key={ticket._id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className="group relative rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {ticket.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-1">
                    {ticket.from} → {ticket.to}
                  </p>

                  <p className="text-sm mb-3 text-black dark:text-white">
                    Price:{" "}
                    <span className="font-semibold text-blue-600">
                      ৳{ticket.price}
                    </span>
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full w-fit mb-4
                    ${
                      ticket.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : ticket.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>

                  {/* Buttons */}
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/vendor/my-ticket/update-ticket/${ticket._id}`,
                        )
                      }
                      disabled={isRejected}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${
                        isRejected
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#00c950] text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(ticket._id, ticket.status)}
                      disabled={isRejected}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${
                        isRejected
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#fb2c36] text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default MyAddedTickets;
