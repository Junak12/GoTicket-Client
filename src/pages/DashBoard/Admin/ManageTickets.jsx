import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/Axios/useAxios";

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

      const url =
        newStatus === "approved"
          ? `/admin/ticket/${id}/approved`
          : `/admin/ticket/${id}/rejected`;

      const res = await instance.patch(url);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: `Ticket ${newStatus} successfully`,
          timer: 1500,
          showConfirmButton: false,
        });
        await refetch();
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Something went wrong" });
    }
  };

  if (isError)
    return (
      <div className="p-4 md:pl-60 text-red-500">Error loading tickets</div>
    );

  return (
    <motion.div
      className="p-4 md:pl-60 text-gray-800 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl text-cyan-500 text-center font-semibold mb-6">
        Manage Tickets
      </h2>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <motion.div
                key={idx}
                className="h-16 w-full bg-gray-200 dark:bg-slate-700 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            ))}
        </div>
      )}

      {!isLoading && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-slate-700">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white">
                <tr>
                  <th className="px-3 py-3 text-left">Title</th>
                  <th className="px-3 py-3 text-left">Vendor</th>
                  <th className="px-3 py-3 text-left">Route</th>
                  <th className="px-3 py-3 text-left">Type</th>
                  <th className="px-3 py-3 text-left">Price</th>
                  <th className="px-3 py-3 text-left">Qty</th>
                  <th className="px-3 py-3 text-left">Departure</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-700">
                {tickets.map((ticket, index) => {
                  const isPending = ticket.status === "pending";
                  const isApproved = ticket.status === "approved";
                  const now = Date.now();
                  const departure = new Date(
                    ticket.departureDateTime,
                  ).getTime();
                  const isExpired = departure < now;
                  const isActionDisabled = !isPending || isExpired;

                  return (
                    <motion.tr
                      key={ticket._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                            ? "text-gray-400"
                            : isPending
                              ? "text-yellow-500"
                              : isApproved
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                      >
                        {ticket.status}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            disabled={isActionDisabled}
                            className={`px-3 py-1 rounded transition ${
                              isActionDisabled
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                            onClick={() =>
                              handleStatusChange(ticket._id, "approved")
                            }
                          >
                            Approve
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            disabled={isActionDisabled}
                            className={`px-3 py-1 rounded transition ${
                              isActionDisabled
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                            onClick={() =>
                              handleStatusChange(ticket._id, "rejected")
                            }
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
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-slate-900 text-gray-800 dark:text-white shadow rounded-xl p-4"
                >
                  <h3 className="font-semibold text-lg">{ticket.title}</h3>
                  <p>
                    {ticket.from} → {ticket.to}
                  </p>
                  <p>৳ {ticket.price}</p>

                  <p>
                    {new Date(ticket.departureDateTime).toLocaleString()}
                    {isExpired && (
                      <span className="ml-2 text-red-500 text-xs">
                        (Expired)
                      </span>
                    )}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className={`flex-1 py-1 rounded ${
                        isActionDisabled
                          ? "bg-gray-300 text-gray-600"
                          : "bg-green-500 text-white"
                      }`}
                      disabled={isActionDisabled}
                      onClick={() => handleStatusChange(ticket._id, "approved")}
                    >
                      Approve
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className={`flex-1 py-1 rounded ${
                        isActionDisabled
                          ? "bg-gray-300 text-gray-600"
                          : "bg-red-500 text-white"
                      }`}
                      disabled={isActionDisabled}
                      onClick={() => handleStatusChange(ticket._id, "rejected")}
                    >
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ManageTickets;
