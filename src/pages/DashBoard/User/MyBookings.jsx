// src/pages/Dashboard/MyBookings.jsx
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BookingTable from "../../../components/DashBoard/users/BookingTable";
import useAxios from "../../../hooks/Axios/useAxios";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useLocation } from "react-router";

const MyBookings = () => {
  const instance = useAxios();
  const { user } = useAuth();
  const location = useLocation();

  // Fetch bookings using React Query
  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await instance.get(`/userbookticket/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("session_id")) {
      refetch();
    }
  }, [location.search, refetch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg">Loading bookings...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500">Failed to load bookings</p>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">No bookings found</p>
      </div>
    );

  return (
    <div className="p-4 md:pl-60">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-cyan-500">My Booked Tickets</h1>
      <BookingTable bookings={bookings} />
    </div>
  );
};

export default MyBookings;
