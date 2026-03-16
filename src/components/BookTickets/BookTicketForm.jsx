import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/Axios/useAxios";
import TicketList from "../TicketList/TicketList";

const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Mymensingh",
];

const BookTicketForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [searchParams, setSearchParams] = useState(null);
  const instance = useAxios();
  const fromValue = watch("from");

  const fetchTickets = async ({ queryKey }) => {
    const [, from, to, transport] = queryKey;
    const query = new URLSearchParams({ from, to, transport }).toString();
    const res = await instance.get(`/getTicket/search?${query}`);
    return res.data;
  };

  const {
    data: tickets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "ticket-search",
      searchParams?.from,
      searchParams?.to,
      searchParams?.transport,
    ],
    queryFn: fetchTickets,
    enabled: !!searchParams,
  });

  const onSubmit = (data) => {
    setSearchParams(data);
    refetch();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-10 px-4 md:px-8 max-w-6xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-50 text-center mb-10"
      >
        Book Your Ticket
      </motion.h2>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end"
      >
        {/* From */}
        <div className="flex flex-col">
          <label
            htmlFor="from"
            className="mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            From
          </label>
          <select
            id="from"
            {...register("from", { required: "From division is required" })}
            className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ACD487] dark:bg-slate-800 dark:text-gray-50 transition ${
              errors.from
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <option value="">Select Division</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
          {errors.from && (
            <span className="text-red-500 text-sm mt-1">
              {errors.from.message}
            </span>
          )}
        </div>

        {/* To */}
        <div className="flex flex-col">
          <label
            htmlFor="to"
            className="mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            To
          </label>
          <select
            id="to"
            {...register("to", { required: "To division is required" })}
            className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ACD487] dark:bg-slate-800 dark:text-gray-50 transition ${
              errors.to
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <option value="">Select Division</option>
            {divisions
              .filter((div) => div !== fromValue)
              .map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
          </select>
          {errors.to && (
            <span className="text-red-500 text-sm mt-1">
              {errors.to.message}
            </span>
          )}
        </div>

        {/* Transport */}
        <div className="flex flex-col">
          <label
            htmlFor="transport"
            className="mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            Transport
          </label>
          <select
            id="transport"
            {...register("transport", {
              required: "Transport type is required",
            })}
            className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ACD487] dark:bg-slate-800 dark:text-gray-50 transition ${
              errors.transport
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <option value="">Select Transport</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Plane">Plane</option>
          </select>
          {errors.transport && (
            <span className="text-red-500 text-sm mt-1">
              {errors.transport.message}
            </span>
          )}
        </div>

        {/* Submit button */}
        <div className="md:col-span-3 flex justify-center mt-4 md:mt-0">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-1/2 bg-[#ACD487] hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition duration-200 ease-in-out"
          >
            Search Tickets
          </motion.button>
        </div>
      </motion.form>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        {isLoading && (
          <p className="text-center text-gray-500">Searching tickets...</p>
        )}
        {!isLoading && tickets.length === 0 && searchParams && (
          <p className="text-center text-gray-600 text-lg">
            No tickets found 😢
          </p>
        )}
        {!isLoading && tickets.length > 0 && <TicketList tickets={tickets} />}
      </motion.div>
    </motion.section>
  );
};

export default BookTicketForm;
