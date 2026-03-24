import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../../hooks/Axios/useAxios";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  from: z.string().min(2, "Select a valid origin"),
  to: z.string().min(2, "Select a valid destination"),
  transportType: z.enum(["Bus", "Train", "Flight"], {
    errorMap: () => ({ message: "Select transport type" }),
  }),
  price: z.number().min(1, "Price must be greater than 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  departureDateTime: z.string().min(1, "Select date & time"),
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

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const UpdateTicket = () => {
  const { id } = useParams();
  const instance = useAxios();
  const navigate = useNavigate();

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
    resolver: zodResolver(schema),
    defaultValues: {
      perks: PERKS_LIST.map((name) => ({
        name,
        price: 0,
        enabled: false,
      })),
    },
  });

  const perksWatch = watch("perks");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await instance.get(`/tickets/${id}`);
        const data = res.data;

        Object.keys(data).forEach((key) => setValue(key, data[key]));
        setImageURL(data.image);

        const updatedPerks = PERKS_LIST.map((perk) => {
          const found = data.perks?.find((p) => p.name === perk);
          return {
            name: perk,
            price: found?.price || 0,
            enabled: !!found,
          };
        });

        setValue("perks", updatedPerks);
        setLoading(false);
      } catch {
        Swal.fire("Error", "Failed to load ticket", "error");
      }
    };

    fetchTicket();
  }, [id, setValue, instance]);

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
      Swal.fire("Uploaded!", "Image updated", "success");
    } catch {
      Swal.fire("Error", "Upload failed", "error");
    }

    setUploading(false);
  };

  const onSubmit = async (data) => {
    if (!imageURL) return Swal.fire("Wait", "Upload image first", "info");

    const perks = data.perks
      .filter((p) => p.enabled)
      .map((p) => ({ name: p.name, price: p.price }));

    try {
      await instance.patch(`/tickets/${id}`, {
        ...data,
        image: imageURL,
        perks,
      });
      Swal.fire("Success", "Ticket Updated!", "success");
      navigate("/dashboard/my-added-tickets");
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  const Input = ({ label, error, children }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );

  const inputClasses =
    "w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none transition " +
    "text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 " +
    "placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-sm " +
    "focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto rounded-3xl shadow-xl bg-white dark:bg-gray-900 p-5 md:p-10 space-y-6"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
          Update Ticket
        </h2>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Title" error={errors.title}>
            <input {...register("title")} className={inputClasses} />
          </Input>

          <Input label="Transport" error={errors.transportType}>
            <select {...register("transportType")} className={inputClasses}>
              <option value="">Select transport</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
            </select>
          </Input>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input label="From" error={errors.from}>
            <select {...register("from")} className={inputClasses}>
              <option value="">Select origin</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Input>

          <Input label="To" error={errors.to}>
            <select {...register("to")} className={inputClasses}>
              <option value="">Select destination</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Input>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Price" error={errors.price}>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className={inputClasses}
              placeholder="Enter price"
            />
          </Input>

          <Input label="Quantity" error={errors.quantity}>
            <input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              className={inputClasses}
              placeholder="Enter quantity"
            />
          </Input>

          <Input label="Departure Time" error={errors.departureDateTime}>
            <input
              type="datetime-local"
              {...register("departureDateTime")}
              className={inputClasses}
            />
          </Input>
        </div>

        {/* Perks */}
        <div>
          <h3 className="font-semibold mb-3 text-lg text-gray-800 dark:text-gray-200">
            Perks
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS_LIST.map((perk, index) => {
              const enabled = perksWatch[index]?.enabled;
              return (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  key={perk}
                  className={`flex items-center justify-between p-3 rounded-xl border transition
                    ${
                      enabled
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                    }`}
                >
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => togglePerk(index, e.target.checked)}
                      className="accent-blue-500"
                    />
                    <span>{perk}</span>
                  </div>

                  <input
                    type="number"
                    {...register(`perks.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    disabled={!enabled}
                    className="w-20 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Upload Image
          </label>

          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className={inputClasses}
          />

          {uploading && (
            <p className="text-blue-500 mt-2 animate-pulse">Uploading...</p>
          )}

          {imageURL && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={imageURL}
              className="h-48 w-full object-cover rounded-xl mt-3"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            type="submit"
          >
            Update Ticket
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gray-600 dark:bg-gray-700 text-white py-3 rounded-xl font-semibold shadow-lg"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default UpdateTicket;
