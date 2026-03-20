// src/pages/JoinPartner/JoinPartner.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import useAxios from "../../hooks/Axios/useAxios";
import { useAuth } from "../../hooks/Auth/useAuth";
import Swal from "sweetalert2";

const schema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email"),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Select business type"),
  nidNumber: z.string().min(5, "NID is required"),
  businessLicense: z.string().optional(),
  address: z.string().min(3, "Address is required"),
  reason: z.string().min(10, "Please write a valid reason"),
});

const baseInput =
  "w-full px-4 py-3 text-black dark:text-white rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border focus:outline-none focus:ring-2 transition-all";

const errorStyle = "text-red-500 text-sm mt-1";

const JoinPartner = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const instance = useAxios();
  const { user } = useAuth();
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

  const getInputStyle = (field) => {
    if (!touchedFields[field]) {
      return `${baseInput} border-gray-200 dark:border-slate-700 focus:ring-purple-500`;
    }
    if (errors[field]) {
      return `${baseInput} border-red-500 focus:ring-red-500`;
    }
    return `${baseInput} border-green-500 focus:ring-green-500`;
  };

  const onSubmit = async (data) => {
    try {
      const vendorInfo = {
        ...data,
        email: user?.email || data.email, 
      };

      const res = await instance.post("/vendor-request", vendorInfo);

      Swal.fire({
        icon: "success",
        title: "Application Submitted Successfully",
        text: `Welcome ${data.fullName}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl backdrop-blur-xl p-6 md:p-10 rounded-2xl shadow-xl border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-cyan-400"
        >
          Become a Vendor 🚀
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahim Uddin"
                {...register("fullName")}
                className={getInputStyle("fullName")}
              />
              <p className={errorStyle}>{errors.fullName?.message}</p>
            </div>

            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 01712345678"
                {...register("phone")}
                className={getInputStyle("phone")}
              />
              <p className={errorStyle}>{errors.phone?.message}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-black dark:text-white text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. rahim@gmail.com"
              {...register("email")}
              className={getInputStyle("email")}
            />
            <p className={errorStyle}>{errors.email?.message}</p>
          </div>

          {/* Business Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Green Line Paribahan"
                {...register("businessName")}
                className={getInputStyle("businessName")}
              />
              <p className={errorStyle}>{errors.businessName?.message}</p>
            </div>

            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                Business Type
              </label>
              <select
                {...register("businessType")}
                className={getInputStyle("businessType")}
              >
                <option value="">Select Business Type</option>
                <option value="Bus">🚌 Bus</option>
                <option value="Train">🚆 Train</option>
                <option value="Airplane">✈️ Airplane</option>
              </select>
              <p className={errorStyle}>{errors.businessType?.message}</p>
            </div>
          </div>

          {/* NID + License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                NID Number
              </label>
              <input
                type="text"
                placeholder="e.g. 1234567890123"
                {...register("nidNumber")}
                className={getInputStyle("nidNumber")}
              />
              <p className={errorStyle}>{errors.nidNumber?.message}</p>
            </div>

            <div>
              <label className="block mb-1 text-black dark:text-white text-sm font-medium">
                Business License (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. BL-2024-987654"
                {...register("businessLicense")}
                className={getInputStyle("businessLicense")}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-black dark:text-white text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. Sylhet, Bangladesh"
              {...register("address")}
              className={getInputStyle("address")}
            />
            <p className={errorStyle}>{errors.address?.message}</p>
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 text-black dark:text-white text-sm font-medium">
              Reason
            </label>
            <textarea
              rows={4}
              placeholder="e.g. I want to expand my transport business..."
              {...register("reason")}
              className={getInputStyle("reason")}
            />
            <p className={errorStyle}>{errors.reason?.message}</p>
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className="w-full md:w-auto px-8 py-3 bg-[#ACD487] text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-300 transition-all"
          >
            Apply Now
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default JoinPartner;
