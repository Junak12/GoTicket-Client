import React, { useEffect, useState, Suspense } from "react";
import useAxios from "../../hooks/Axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { LuRefreshCcw } from "react-icons/lu";
import { motion } from "framer-motion";

const TicketList = React.lazy(
  () => import("../../components/TicketList/TicketList"),
);

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AllTickets = () => {
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
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
    staleTime: 1000 * 60 * 5,
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

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    page + 2,
  );

  return (
    <section className="py-20 px-4 md:px-12 lg:px-0">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4"
      >
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-500">
            Explore All Tickets
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">
            Find your perfect journey and book instantly
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refetch}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#ACD487] text-black font-medium shadow-md"
        >
          <LuRefreshCcw size={18} />
          Refresh
        </motion.button>
      </motion.div>


      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-cyan-500"></span>
          </div>
        }
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <TicketList tickets={tickets} itemVariants={itemVariants} />
        </motion.div>
      </Suspense>

 
      <div className="flex flex-wrap justify-center gap-2 mt-12">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-1 rounded bg-[#ACD487] disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPage(num)}
            className={`px-4 py-1 rounded ${
              page === num ? "bg-cyan-500 text-white" : "bg-[#ACD487]"
            }`}
          >
            {num}
          </motion.button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-1 rounded bg-[#ACD487] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AllTickets;
