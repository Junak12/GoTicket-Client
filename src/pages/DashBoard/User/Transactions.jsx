import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../../hooks/Axios/useAxios";
import { useAuth } from "../../../hooks/Auth/useAuth";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

const Transactions = () => {
  const instance = useAxios();
  const { user } = useAuth();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await instance.get(`/user/transactions/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:pl-60 transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Transaction History
      </h2>
      <div className="hidden lg:block overflow-x-auto rounded-xl shadow">
        <table className="table w-full">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Transaction ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Ticket
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Date
              </th>
            </tr>
          </thead>

          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-gray-900"
          >
            {transactions.map((tx, index) => (
              <motion.tr
                key={index}
                variants={rowVariants}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="text-gray-700 dark:text-gray-300">
                  {index + 1}
                </td>

                <td className="text-xs text-blue-500 break-all">
                  {tx.transactionId}
                </td>

                <td className="font-semibold text-gray-800 dark:text-gray-100">
                  {tx.ticketTitle}
                </td>

                <td className="text-green-500 font-bold">৳ {tx.amount}</td>

                <td className="text-gray-600 dark:text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:hidden"
      >
        {transactions.map((tx, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {tx.ticketTitle}
              </h3>

              <span className="text-green-500 font-bold">৳ {tx.amount}</span>
            </div>

            <p className="text-xs text-blue-500 break-all mb-2">
              {tx.transactionId}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(tx.createdAt).toLocaleString()}
            </p>

            <div className="mt-2">
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">
                Paid
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {transactions.length === 0 && (
        <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default Transactions;
