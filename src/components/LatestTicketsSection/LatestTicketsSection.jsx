import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import TicketList from "../TicketList/TicketList";

const LatestTicketsSection = () => {
  const instance = useAxios();

  const fetchLatestTickets = async () => {
    const res = await instance.get("/tickets"); // or your endpoint
    return res.data;
  };

  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["latestTickets"],
    queryFn: fetchLatestTickets,
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load tickets</p>
    );

  // 🔥 Get latest 6–8 tickets
  const latestTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
          Latest Tickets 🎟️
        </h2>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Recently added tickets available for booking
        </p>
      </div>

      {/* Tickets */}
      <div className="max-w-7xl mx-auto">
        <TicketList tickets={latestTickets} />
      </div>
    </section>
  );
};

export default LatestTicketsSection;
