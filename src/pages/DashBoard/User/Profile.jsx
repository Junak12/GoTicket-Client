import React from "react";
import useAxios from "../../../hooks/Axios/useAxios";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const Profile = () => {
  const instance = useAxios();
  const { user } = useAuth();

  const fetchUser = async ({ queryKey }) => {
    const [, email] = queryKey;
    const res = await instance.get(`/userProfile/${email}`);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: fetchUser,
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-lg font-medium">
          Loading profile...
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load profile
      </div>
    );

  if (!data)
    return <div className="text-center mt-10 text-gray-500">No user found</div>;

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-6 md:p-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <motion.img
            src={data?.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 shadow-md"
            whileHover={{ scale: 1.05 }}
          />

          <h2 className="mt-4 text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            {data?.name || "No Name"}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?.email}
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-3 text-sm md:text-base">
          <div className="flex justify-between bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl">
            <span className="text-gray-600 dark:text-gray-300">Role</span>
            <span className="font-medium text-gray-800 dark:text-white capitalize">
              {data?.role}
            </span>
          </div>

          <div className="flex justify-between bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl">
            <span className="text-gray-600 dark:text-gray-300">Joined</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {new Date(data?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-medium transition"
        >
          Edit Profile
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
