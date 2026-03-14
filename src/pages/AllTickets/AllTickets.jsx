import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/Axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import TicketList from "../../components/TicketList/TicketList";
import { LuRefreshCcw } from "react-icons/lu";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const AllTickets = () => {
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const fetchTickets = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const res = await axiosInstance.get(
      `/getTicket?page=${page}&limit=${limit}`,
    );
    return res.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tickets", page],
    queryFn: fetchTickets,
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-500"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error.message}
      </div>
    );
  }

  const { tickets, totalPages } = data;

  return (
    <section className="py-20 px-4 md:px-12 lg:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4"
      >
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-500">
            Explore All Tickets
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">
            Find your perfect journey and book instantly
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={refetch}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#ACD487] text-black font-medium shadow-md"
        >
          <LuRefreshCcw size={18} />
          Refresh
        </motion.button>
      </motion.div>

      <motion.div
        key={page}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <TicketList tickets={tickets} itemVariants={itemVariants} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mt-12"
      >
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-1 rounded bg-[#ACD487] disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPage(idx + 1)}
            className={`px-4 py-1 rounded ${
              page === idx + 1 ? "bg-cyan-500 text-white" : "bg-[#ACD487]"
            }`}
          >
            {idx + 1}
          </motion.button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-1 rounded bg-[#ACD487] disabled:opacity-50"
        >
          Next
        </button>
      </motion.div>
    </section>
  );
};

export default AllTickets;
