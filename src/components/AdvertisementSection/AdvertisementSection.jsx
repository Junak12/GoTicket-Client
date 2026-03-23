import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";
import TicketList from "../TicketList/TicketList";

const AdvertisementSection = () => {
  const instance = useAxios();

  const fetchAds = async () => {
    const res = await instance.get("/home/tickets");
    return res.data;
  };

  const {
    data: ads = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["advertisedTickets"],
    queryFn: fetchAds,
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load tickets</p>
    );

  return (
    <section className="py-16 px-4 md:py-8 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
          Hot Travel Deals 🔥
        </h2>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Discover trending routes with exciting prices. Book before seats run
          out!
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <TicketList tickets={ads.slice(0, 6)} />
      </div>
    </section>
  );
};

export default AdvertisementSection;
