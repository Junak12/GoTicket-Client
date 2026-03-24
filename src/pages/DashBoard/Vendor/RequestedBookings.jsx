import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../hooks/Axios/useAxios";
import Swal from "sweetalert2";
import { useAuth } from "../../../hooks/Auth/useAuth";

const RequestedBookings = () => {
  const instance = useAxios();
  const { user } = useAuth();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vendorBookings", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await instance.get(`/vendor/req-bookings/${user.email}`);
      return res.data.filter((b) => b.status === "pending");
    },
    enabled: !!user?.email,
  });

  const handleBookingAction = async (id, action) => {
    try {
      const isApprove = action === "approved";

      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${isApprove ? "approve" : "reject"} this booking?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: isApprove ? "#16a34a" : "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, ${isApprove ? "approve" : "reject"} it!`,
      });

      if (!result.isConfirmed) return;

      await instance.patch(`/vendor/req-bookings/${action}/${id}`);

      await Swal.fire({
        icon: "success",
        title: isApprove ? "Approved!" : "Rejected!",
        text: `Booking has been ${action} successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${action} booking.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-800 dark:text-gray-100">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="pl-4 lg:pl-60 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Requested Bookings
      </h2>

      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {[
                "User",
                "Ticket",
                "Seats",
                "Qty",
                "Total",
                "Perks",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900">
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No pending bookings.
                </td>
              </tr>
            )}

            <AnimatePresence>
              {bookings.map((b) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                    {b.email}
                  </td>

                  <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                    {b.ticketTitle}
                  </td>

                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {b.seats?.join(", ") || "N/A"}
                  </td>

                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {b.seats?.length || 1}
                  </td>

                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {b.totalPrice || b.unitPrice * (b.seats?.length || 1)}
                  </td>

                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {b.selectedPerks?.length
                      ? b.selectedPerks.map((p) => (
                          <div key={p.name}>
                            {p.name} (৳{p.price})
                          </div>
                        ))
                      : "None"}
                  </td>

                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => handleBookingAction(b._id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleBookingAction(b._id, "reject")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                    >
                      Reject
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-4">
        {bookings.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No pending bookings.
          </p>
        )}

        <AnimatePresence>
          {bookings.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow"
            >
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                User: <span className="font-normal">{b.email}</span>
              </p>

              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                Ticket: <span className="font-normal">{b.ticketTitle}</span>
              </p>

              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                Seats:{" "}
                <span className="font-normal">
                  {b.seats?.join(", ") || "N/A"}
                </span>
              </p>

              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                Quantity:{" "}
                <span className="font-normal">{b.seats?.length || 1}</span>
              </p>

              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                Total:{" "}
                <span className="font-normal">
                  {b.totalPrice || b.unitPrice * (b.seats?.length || 1)}
                </span>
              </p>

              <div className="text-gray-900 dark:text-gray-100 font-semibold">
                Perks:
                {b.selectedPerks?.length ? (
                  b.selectedPerks.map((p) => (
                    <span key={p.name} className="block ml-2 font-normal">
                      {p.name} (৳{p.price})
                    </span>
                  ))
                ) : (
                  <span className="ml-2 font-normal">None</span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleBookingAction(b._id, "approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded-md"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleBookingAction(b._id, "reject")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded-md"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RequestedBookings;
