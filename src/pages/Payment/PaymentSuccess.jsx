import React from "react";
import { useLocation } from "react-router";
import useAxios from "../../hooks/Axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/AxiosSecure/useAxiosSecure";

const PaymentSuccess = () => {
  const location = useLocation();
  const instance = useAxios();
  const axiosSecure = useAxiosSecure();

  const sessionId = new URLSearchParams(location.search).get("session_id");

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["verifyPayment", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("No session ID found");

      const res = await axiosSecure.post("/verify-payment", { sessionId });
      if (!res.data.success)
        throw new Error(res.data.message || "Payment failed");

      Swal.fire({
        title: "Payment Successful 🎉",
        text: "Your ticket has been booked successfully!",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
      });

      return res.data.booking;
    },
    enabled: !!sessionId,
  });

  if (isLoading)
    return (
      <p className="mt-20 text-center text-gray-500">Processing payment...</p>
    );
  if (isError)
    return (
      <p className="mt-20 text-center text-red-500">
        {error?.message || "Something went wrong"}
      </p>
    );

  if (!booking)
    return (
      <p className="mt-20 text-center text-gray-500">No booking data found</p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border dark:border-slate-700">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Payment Successful!
      </h1>

      <div className="space-y-4 text-gray-700 dark:text-gray-200">
        <div className="flex justify-between">
          <span className="font-semibold">Vendor:</span>
          <span>{booking.vendorName || "Unknown"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Seats:</span>
          <span>
            {booking.seats?.length ? booking.seats.join(", ") : "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Total Tickets:</span>
          <span>{booking.totalTickets || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Amount Paid:</span>
          <span>৳ {booking.totalPrice || 0}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.replace("/")}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
