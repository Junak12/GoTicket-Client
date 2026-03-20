import React from "react";
import useAxios from "../../../hooks/Axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ManageTickets = () => {
  const instance = useAxios();

  const fetchTickets = async () => {
    const res = await instance.get("/admin/get-tickets");
    return res.data;
  };

  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["adminTickets"],
    queryFn: fetchTickets,
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${newStatus} this ticket?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, do it!",
      });

      if (!confirm.isConfirmed) return;

      let url = "";

      if (newStatus === "approved") {
        url = `/admin/ticket/${id}/approved`;
      } else if (newStatus === "rejected") {
        url = `/admin/ticket/${id}/rejected`;
      }

      const res = await instance.patch(url);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: `Ticket ${newStatus} successfully`,
          timer: 1500,
          showConfirmButton: false,
        });

        await refetch(); // 🔥 refresh UI
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    }
  };

  if (isLoading) return <div className="p-4 md:pl-60">Loading tickets...</div>;
  if (isError)
    return (
      <div className="p-4 md:pl-60 text-red-500">Error loading tickets</div>
    );

  return (
    <div className="p-4 md:pl-60">
      <h2 className="text-2xl text-cyan-400 text-center font-semibold mb-4">
        Manage Tickets
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-slate-700 table-auto">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-3 text-left">Title</th>
              <th className="px-3 py-3 text-left">Vendor</th>
              <th className="px-3 py-3 text-left">From → To</th>
              <th className="px-3 py-3 text-left">Transport</th>
              <th className="px-3 py-3 text-left">Price</th>
              <th className="px-3 py-3 text-left">Qty</th>
              <th className="px-3 py-3 text-left">Departure</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => {
              const isPending = ticket.status === "pending";
              const isApproved = ticket.status === "approved";

              const now = Date.now();
              const departure = new Date(ticket.departureDateTime).getTime();
              const isExpired = departure < now;

              const isActionDisabled = !isPending || isExpired;

              return (
                <motion.tr
                  key={ticket._id}
                  whileHover={{ scale: 1.01 }}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-3 py-3">{ticket.title}</td>
                  <td className="px-3 py-3">{ticket.vendorEmail}</td>
                  <td className="px-3 py-3">
                    {ticket.from} → {ticket.to}
                  </td>
                  <td className="px-3 py-3">{ticket.transportType}</td>
                  <td className="px-3 py-3">৳ {ticket.price}</td>
                  <td className="px-3 py-3">{ticket.quantity}</td>
                  <td className="px-3 py-3">
                    {new Date(ticket.departureDateTime).toLocaleString()}
                    {isExpired && (
                      <span className="ml-2 text-red-500 text-xs">
                        (Expired)
                      </span>
                    )}
                  </td>

                  <td
                    className={`px-3 py-3 font-semibold ${
                      isExpired
                        ? "text-gray-500"
                        : isPending
                          ? "text-yellow-600"
                          : isApproved
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                  >
                    {ticket.status}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded ${
                          isActionDisabled
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        onClick={() =>
                          handleStatusChange(ticket._id, "approved")
                        }
                        disabled={isActionDisabled}
                      >
                        Approve
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded ${
                          isActionDisabled
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        onClick={() =>
                          handleStatusChange(ticket._id, "rejected")
                        }
                        disabled={isActionDisabled}
                      >
                        Reject
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {tickets.map((ticket) => {
          const isPending = ticket.status === "pending";
          const now = Date.now();
          const departure = new Date(ticket.departureDateTime).getTime();
          const isExpired = departure < now;

          const isActionDisabled = !isPending || isExpired;

          return (
            <div
              key={ticket._id}
              className="bg-white dark:bg-slate-900 shadow rounded-lg p-4"
            >
              <h3 className="font-semibold">{ticket.title}</h3>
              <p>
                {ticket.from} → {ticket.to}
              </p>
              <p>৳ {ticket.price}</p>

              <p>
                {new Date(ticket.departureDateTime).toLocaleString()}
                {isExpired && (
                  <span className="ml-2 text-red-500 text-xs">(Expired)</span>
                )}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  className={`flex-1 ${
                    isActionDisabled ? "bg-gray-300" : "bg-green-500 text-white"
                  }`}
                  disabled={isActionDisabled}
                  onClick={() => handleStatusChange(ticket._id, "approved")}
                >
                  Approve
                </button>

                <button
                  className={`flex-1 ${
                    isActionDisabled ? "bg-gray-300" : "bg-red-500 text-white"
                  }`}
                  disabled={isActionDisabled}
                  onClick={() => handleStatusChange(ticket._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageTickets;
