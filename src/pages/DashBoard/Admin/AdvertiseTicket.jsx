import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/Axios/useAxios";

const AdvertiseTicket = () => {
  const instance = useAxios();

  const fetchTickets = async () => {
    const res = await instance.get("/admin/all-tickets");
    return res.data;
  };

  const {
    data: tickets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminTickets"],
    queryFn: fetchTickets,
  });

  const handleAdvertise = async (id, isAdvertised) => {
    const confirm = await Swal.fire({
      title: isAdvertised ? "Unadvertise?" : "Advertise?",
      text: "Do you want to change advertisement status?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await instance.patch(`/admin/tickets/advertise/${id}`);
      Swal.fire("Success!", res.data.message, "success");
      refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Failed",
      });
    }
  };

  const tableVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="pl-0 md:pl-60 p-4 text-gray-800 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-semibold text-center text-cyan-500 mb-6">
        Advertise Tickets
      </h2>

      {isLoading && (
        <div className="space-y-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
              />
            ))}
        </div>
      )}

      {!isLoading && (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border dark:border-slate-700">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-3 text-left">Title</th>
                  <th className="px-3 py-3 text-left">From</th>
                  <th className="px-3 py-3 text-left">To</th>
                  <th className="px-3 py-3 text-left">Transport</th>
                  <th className="px-3 py-3 text-left">Price</th>
                  <th className="px-3 py-3 text-left">Quantity</th>
                  <th className="px-3 py-3 text-center">Advertise</th>
                </tr>
              </thead>

              <motion.tbody
                variants={tableVariants}
                initial="hidden"
                animate="show"
                className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-700"
              >
                {tickets.map((t) => (
                  <motion.tr
                    key={t._id}
                    variants={rowVariants}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-3 py-3">{t.title}</td>
                    <td className="px-3 py-3">{t.from}</td>
                    <td className="px-3 py-3">{t.to}</td>
                    <td className="px-3 py-3">{t.transportType}</td>
                    <td className="px-3 py-3">৳{t.price}</td>
                    <td className="px-3 py-3">{t.quantity}</td>

                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleAdvertise(t._id, t.isAdvertised)}
                        className={`px-3 py-1 rounded text-white ${
                          t.isAdvertised ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {t.isAdvertised ? "Unadvertise" : "Advertise"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden flex flex-col gap-4">
            {tickets.map((t, index) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow"
              >
                <p>
                  <span className="font-semibold">Title:</span> {t.title}
                </p>
                <p>
                  <span className="font-semibold">From:</span> {t.from}
                </p>
                <p>
                  <span className="font-semibold">To:</span> {t.to}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ৳{t.price}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span> {t.quantity}
                </p>

                <button
                  onClick={() => handleAdvertise(t._id, t.isAdvertised)}
                  className={`w-full mt-3 py-2 rounded text-white ${
                    t.isAdvertised ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {t.isAdvertised ? "Unadvertise" : "Advertise"}
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdvertiseTicket;
