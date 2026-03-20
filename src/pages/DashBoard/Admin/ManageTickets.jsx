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
    } 
    else if (newStatus === "rejected") {
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
      await refetch();
    }
  } catch (err) {
    console.error(err);
  }
};

  if (isLoading) return <div className="p-4 md:pl-60">Loading tickets...</div>;
  if (isError)
    return (
      <div className="p-4 md:pl-60 text-red-500">Error loading tickets</div>
    );

  return (
    <div className="p-4 md:pl-60">
      <h2 className="text-2xl text-cyan-400 text-center font-semibold mb-4">Manage Tickets</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-slate-700 table-auto">
          <thead className="bg-gray-100 dark:bg-slate-800 align-middle">
            <tr className="align-middle">
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Title
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Vendor
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                From → To
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Transport
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Price
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Qty
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Departure
              </th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Status
              </th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {tickets.map((ticket) => {
              const isPending = ticket.status === "pending";
              const isApproved = ticket.status === "approved";

              return (
                <motion.tr
                  key={ticket._id}
                  whileHover={{ scale: 1.01 }}
                  className="transition hover:bg-gray-50 dark:hover:bg-slate-700 align-middle"
                >
                  <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 align-middle">
                    {ticket.title}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    {ticket.vendorEmail}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    {ticket.from} → {ticket.to}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    {ticket.transportType}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    ৳ {ticket.price}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    {ticket.quantity}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300 align-middle">
                    {new Date(ticket.departureDateTime).toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-3 text-sm font-semibold capitalize align-middle ${
                      isPending
                        ? "text-yellow-600 dark:text-yellow-400"
                        : isApproved
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 text-sm rounded font-medium ${
                          isPending
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          handleStatusChange(ticket._id, "approved")
                        }
                        disabled={!isPending}
                      >
                        Approve
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 text-sm rounded font-medium ${
                          isPending
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          handleStatusChange(ticket._id, "rejected")
                        }
                        disabled={!isPending}
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

      {/* Mobile / Tablet Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {tickets.map((ticket) => {
          const isPending = ticket.status === "pending";
          const isApproved = ticket.status === "approved";

          return (
            <div
              key={ticket._id}
              className="bg-white dark:bg-slate-900 shadow rounded-lg p-4 flex flex-col gap-3"
            >
              {/* Top row: Title and Status */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                  {ticket.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    isPending
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      : isApproved
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* Vendor + From → To */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <p>Vendor: {ticket.vendorEmail}</p>
                <p>
                  {ticket.from} → {ticket.to}
                </p>
              </div>

              {/* Transport + Price + Qty */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <p>Transport: {ticket.transportType}</p>
                <p>Price: ৳ {ticket.price}</p>
                <p>Qty: {ticket.quantity}</p>
              </div>

              {/* Departure */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Departure: {new Date(ticket.departureDateTime).toLocaleString()}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-3 py-1 text-sm rounded font-medium ${
                    isPending
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => handleStatusChange(ticket._id, "approved")}
                  disabled={!isPending}
                >
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-3 py-1 text-sm rounded font-medium ${
                    isPending
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => handleStatusChange(ticket._id, "rejected")}
                  disabled={!isPending}
                >
                  Reject
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageTickets;
