import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import TicketList from "../TicketList/TicketList";

const LatestTicketsSection = () => {
  const instance = useAxios();

  // Fetch latest tickets from API
  const fetchLatestTickets = async () => {
    const res = await instance.get("/latest-tickets");
    return res.data;
  };

  // React Query
  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["latestTickets"],
    queryFn: fetchLatestTickets,
    refetchOnWindowFocus: true, // 🔹 automatically refetch when window gains focus
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load tickets</p>
    );

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-extrabold 
                     bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 
                     bg-clip-text text-transparent"
        >
          Latest Tickets 🎟️
        </h2>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Recently added tickets available for booking
        </p>
      </div>

      {/* Ticket Grid */}
      <div className="max-w-7xl mx-auto">
        <TicketList tickets={tickets} />
      </div>
    </section>
  );
};

export default LatestTicketsSection;
