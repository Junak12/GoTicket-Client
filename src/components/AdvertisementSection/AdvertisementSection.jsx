import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/Axios/useAxios";

const AdvertisementSection = () => {
  const instance = useAxios();

  const fetchAds = async () => {
    const res = await instance.get("/tickets/advertised");
    return res.data;
  };

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["advertisedTickets"],
    queryFn: fetchAds,
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-cyan-500">
        Advertisement
      </h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {ads.map((t) => (
          <div
            key={t._id}
            className="bg-white dark:bg-slate-900 shadow rounded-lg overflow-hidden"
          >
            <img
              src={t.image}
              alt={t.title}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{t.title}</h3>

              <p className="text-sm mt-1">
                {t.from} → {t.to}
              </p>

              <p className="text-sm mt-1">Transport: {t.transportType}</p>

              <p className="font-bold mt-2 text-cyan-500">৳{t.price}</p>

              <p className="text-xs mt-1 text-gray-500">Seats: {t.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvertisementSection;
