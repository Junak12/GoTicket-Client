import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/Auth/useAuth";
import axios from "axios";
import useAxios from "../../../hooks/Axios/useAxios";
import Swal from "sweetalert2";

const ticketSchema = z.object({
  title: z.string().min(3),
  from: z.string().min(2),
  to: z.string().min(2),
  transportType: z.enum(["Bus", "Train", "Flight"]),
  price: z.number().min(1),
  quantity: z.number().min(1),
  departureDateTime: z.string().min(1),
  perks: z
    .array(
      z.object({
        name: z.string(),
        price: z.number().min(0),
        enabled: z.boolean(),
      }),
    )
    .optional(),
  image: z.any().refine((files) => files?.length > 0),
});

const PERKS_LIST = [
  "AC",
  "Breakfast",
  "WiFi",
  "Extra Legroom",
  "Meal",
  "Snack",
  "Drink",
];
const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Sylhet",
  "Mymensingh",
];

const AddTicket = () => {
  const { user } = useAuth();
  const instance = useAxios();
  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      perks: PERKS_LIST.map((name) => ({ name, price: 0, enabled: false })),
    },
  });

  const perksWatch = watch("perks");

  const togglePerk = (index, checked) => {
    setValue(`perks.${index}.enabled`, checked);
    if (!checked) setValue(`perks.${index}.price`, 0);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const imgbbAPIKey = import.meta.env.VITE_IMGBB_API;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setImageURL(res.data.data.url);
      setUploading(false);
    } catch (err) {
      setUploading(false);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Please try again.",
      });
    }
  };

  const onSubmit = async (data) => {
    if (!imageURL) {
      Swal.fire({
        icon: "info",
        title: "Please wait",
        text: "Image is still uploading...",
      });
      return;
    }

    const filteredPerks = data.perks
      .filter((perk) => perk.enabled)
      .map((perk) => ({ name: perk.name, price: perk.price }));

    const ticketData = {
      title: data.title,
      from: data.from,
      to: data.to,
      transportType: data.transportType,
      price: data.price,
      quantity: data.quantity,
      departureDateTime: data.departureDateTime,
      image: imageURL,
      perks: filteredPerks,
      status: "pending",
      isAdvertised: false,
      bookingCount: 0,
      vendorEmail: user?.email || "",
      vendorName: user?.displayName || "",
    };

    try {
      await instance.post("/tickets", ticketData);
      Swal.fire({
        icon: "success",
        title: "Ticket Added!",
        text: "Your ticket has been submitted successfully and is pending approval.",
        timer: 2500,
        showConfirmButton: false,
      });
      reset();
      setImageURL("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-5 dark:bg-gray-900 min-h-screen"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-extrabold text-cyan-500 text-center mb-2">
          Add Ticket
        </h2>

        <div className="flex flex-col items-center mb-6">
          <p className="text-lg font-semibold text-blue-500 dark:text-blue-400">
            Vendor: {user?.displayName || "N/A"}
          </p>
          <p className="text-md font-medium text-purple-500 dark:text-purple-400">
            Email: {user?.email || "N/A"}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Ticket Title
          </label>
          <input
            type="text"
            placeholder="Green Line Bus"
            {...register("title")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              From
            </label>
            <select
              {...register("from")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.from && (
              <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              To
            </label>
            <select
              {...register("to")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.to && (
              <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Transport Type
          </label>
          <select
            {...register("transportType")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Transport Type</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Plane</option>
          </select>
          {errors.transportType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.transportType.message}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Price per unit
            </label>
            <input
              type="number"
              placeholder="1200"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
              Ticket Quantity
            </label>
            <input
              type="number"
              placeholder="22"
              {...register("quantity", { valueAsNumber: true })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Departure Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("departureDateTime")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {errors.departureDateTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.departureDateTime.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Perks
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {PERKS_LIST.map((perk, index) => {
              const isEnabled = perksWatch[index]?.enabled || false;
              return (
                <div
                  key={perk}
                  className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    onChange={(e) => togglePerk(index, e.target.checked)}
                    checked={isEnabled}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="flex-1 font-medium text-gray-700 dark:text-gray-200">
                    {perk}
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    {...register(`perks.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    disabled={!isEnabled}
                    className={`w-20 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      !isEnabled
                        ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700"
                    } text-gray-900 dark:text-gray-100`}
                  />
                  <input
                    type="hidden"
                    value={perk}
                    {...register(`perks.${index}.name`)}
                  />
                  <input
                    type="hidden"
                    {...register(`perks.${index}.enabled`)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Ticket Image
          </label>
          <input
            type="file"
            {...register("image")}
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {uploading && (
            <p className="text-blue-500 mt-1">Uploading image...</p>
          )}
          {imageURL && (
            <p className="text-green-500 mt-1">Image uploaded successfully!</p>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#ff6900] text-white py-3 rounded-xl font-bold shadow hover:shadow-lg transition"
        >
          Add Ticket
        </button>
      </form>
    </motion.div>
  );
};

export default AddTicket;
