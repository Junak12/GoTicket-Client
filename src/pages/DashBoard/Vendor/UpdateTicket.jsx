import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../../hooks/Axios/useAxios";
import { motion } from "framer-motion";

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
  image: z.string().optional(),
});

const UpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instance = useAxios();
  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
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

  // Fetch ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await instance.get(`/tickets/${id}`);
        const data = res.data;

        setValue("title", data.title);
        setValue("from", data.from);
        setValue("to", data.to);
        setValue("transportType", data.transportType);
        setValue("price", data.price);
        setValue("quantity", data.quantity);
        setValue(
          "departureDateTime",
          data.departureDateTime
            ? new Date(data.departureDateTime).toISOString().slice(0, 16)
            : "",
        );
        setImageURL(data.image);

        // Map perks
        const updatedPerks = PERKS_LIST.map((perk) => {
          const found = data.perks?.find((p) => p.name === perk);
          return { name: perk, price: found?.price || 0, enabled: !!found };
        });
        setValue("perks", updatedPerks);

        setLoading(false);
      } catch {
        Swal.fire("Error", "Failed to load ticket", "error");
      }
    };
    fetchTicket();
  }, [id, instance, setValue]);

  const togglePerk = (index, checked) => {
    setValue(`perks.${index}.enabled`, checked);
    if (!checked) setValue(`perks.${index}.price`, 0);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`,
        formData,
      );
      setImageURL(res.data.data.url);
      Swal.fire("Success", "Image uploaded", "success");
    } catch {
      Swal.fire("Error", "Upload failed", "error");
    }
    setUploading(false);
  };

  const onSubmit = async (data) => {
    if (!imageURL) return Swal.fire("Wait", "Upload image first", "info");
    const filteredPerks = (data.perks || [])
      .filter((p) => p.enabled)
      .map((p) => ({ name: p.name, price: Number(p.price) }));
    try {
      await instance.patch(`/vendor/my-tickets/update-ticket/${id}`, {
        ...data,
        image: imageURL,
        perks: filteredPerks,
      });
      Swal.fire("Success", "Ticket Updated!", "success");
      navigate("/dashboard/vendor/my-ticket");
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-cyan-500">
        Update Ticket
      </h2>

      {/* Title */}
      <div className="flex flex-col">
        <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
          Title
        </label>
        <input
          {...register("title")}
          placeholder="Ticket Title"
          className={inputClass}
        />
        {errors.title && (
          <p className="text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Transport */}
      <div className="flex flex-col">
        <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
          Transport Type
        </label>
        <select {...register("transportType")} className={inputClass}>
          <option value="">Select Transport</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Flight">Flight</option>
        </select>
        {errors.transportType && (
          <p className="text-red-500 mt-1">{errors.transportType.message}</p>
        )}
      </div>

      {/* From & To */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
            From
          </label>
          <select {...register("from")} className={inputClass}>
            <option value="">Select Origin</option>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {errors.from && (
            <p className="text-red-500 mt-1">{errors.from.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
            To
          </label>
          <select {...register("to")} className={inputClass}>
            <option value="">Select Destination</option>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {errors.to && (
            <p className="text-red-500 mt-1">{errors.to.message}</p>
          )}
        </div>
      </div>

      {/* Price, Quantity, Departure */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
            Price
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
            Quantity
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            placeholder="Quantity"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
            Departure Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("departureDateTime")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Perks Section */}
      <div>
        <label className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Perks
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERKS_LIST.map((perk, index) => {
            const enabled = perksWatch[index]?.enabled || false;
            return (
              <motion.div
                key={perk}
                layout
                whileHover={{ scale: 1.03 }}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  enabled
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => togglePerk(index, e.target.checked)}
                    className="accent-blue-500 w-5 h-5"
                  />
                  <span className="text-gray-900 dark:text-gray-100">
                    {perk}
                  </span>
                </div>
                <input
                  type="number"
                  {...register(`perks.${index}.price`, { valueAsNumber: true })}
                  disabled={!enabled}
                  placeholder="0"
                  className={`w-20 border rounded px-2 py-1 text-gray-900 dark:text-gray-100 ${!enabled ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed" : "bg-white dark:bg-gray-800"}`}
                />
                <input
                  type="hidden"
                  value={perk}
                  {...register(`perks.${index}.name`)}
                />
                <input
                  type="hidden"
                  value={enabled}
                  {...register(`perks.${index}.enabled`)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Image Upload */}
      <div className="flex flex-col">
        <label className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
          Ticket Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="w-full"
        />
        {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
        {imageURL && (
          <img
            src={imageURL}
            alt="Ticket"
            className="mt-2 h-40 w-full object-cover rounded-lg"
          />
        )}
      </div>

      <button type="submit" disabled={uploading} className="w-full bg-[#ff6900] py-2 text-white rounded-2xl font-bold">
        Update Ticket
      </button>
    </motion.form>
  );
};

export default UpdateTicket;
