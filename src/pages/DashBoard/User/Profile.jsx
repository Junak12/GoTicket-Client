import React, { useState } from "react";
import useAxios from "../../../hooks/Axios/useAxios";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Profile = () => {
  const instance = useAxios();
  const { user, updateUserProfile } = useAuth();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: async () => {
      const res = await instance.get(`/userProfile/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });


  const handleUpdate = async () => {
    try {
      await updateUserProfile(name || data.name, file);

      queryClient.invalidateQueries(["userProfile", user.email]);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpenModal(false);
      setFile(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#ACD487] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">Failed to load profile</p>
    );

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <img
            src={data?.photo}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-400"
          />

          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            {data?.name}
          </h2>

          <p className="text-gray-500">{data?.email}</p>

          <div className="mt-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full
              ${
                data?.role === "admin"
                  ? "bg-red-100 text-red-600"
                  : data?.role === "vendor"
                    ? "bg-blue-100 text-blue-600"
                    : data?.role === "fraud"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-green-100 text-green-600"
              }`}
            >
              {data?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setPreview(data?.photo);
            setName(data?.name);
            setOpenModal(true);
          }}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl"
        >
          Edit Profile
        </motion.button>
      </div>

      {/* 🔹 Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit Profile
            </h2>

            {/* Preview */}
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            {/* Name Input */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 
              text-gray-800 dark:text-white 
              placeholder-gray-400 dark:placeholder-white"
              placeholder="Enter your name"
            />

            {/* File Upload */}
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border cursor-pointer bg-gray-50 hover:bg-gray-100 mb-3"
            >
              📷 Choose Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected) {
                    setFile(selected);
                    setPreview(URL.createObjectURL(selected));
                  }
                }}
              />
            </motion.label>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="w-full py-2 rounded-lg bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="w-full py-2 rounded-lg bg-[#ACD487]"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
