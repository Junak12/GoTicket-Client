import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/Axios/useAxios";
import { useAuth } from "../../../hooks/Auth/useAuth";

const UserManagement = () => {
  const instance = useAxios();
  const { user } = useAuth();
  const [actionDisabled, setActionDisabled] = React.useState(false);

  const tableVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 },
  };

  const fetchUsers = async () => {
    const res = await instance.get(`/admin/users?email=${user?.email}`);
    return res.data;
  };

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleRoleChange = async (id, type) => {
    setActionDisabled(true);

    let url = "";
    if (type === "admin") url = `/admin/users/${id}/make-admin`;
    else if (type === "vendor") url = `/admin/users/${id}/make-vendor`;
    else if (type === "fraud") url = `/admin/users/${id}/make-fraud`;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to make this user ${type}?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) {
      setActionDisabled(false);
      return;
    }

    try {
      const res = await instance.patch(url);
      if (res.data.success) {
        Swal.fire("Updated!", "", "success");
        refetch();
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }

    setActionDisabled(false);
  };

  const defaultAvatar = "https://i.ibb.co/q3kx0fGL/ava.png";

  return (
    <motion.div
      className="p-4 md:py-15 py-10 text-gray-800 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl text-center font-semibold mb-6 text-cyan-500">
        Manage Users
      </h2>

      {isLoading && (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
              />
            ))}
        </div>
      )}

      {!isLoading && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border dark:border-slate-700">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-3 text-left">Photo</th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Role</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <motion.tbody
                variants={tableVariants}
                initial="hidden"
                animate="show"
                className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-700"
              >
                {users.map((u) => {
                  const isAdmin = u.role === "admin";
                  const isVendor = u.role === "vendor";
                  const isFraud = u.isFraud === true;

                  return (
                    <motion.tr
                      key={u._id}
                      variants={rowVariants}
                      whileHover={{ scale: 1.01 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-3 py-3">
                        <img
                          src={u.photo || defaultAvatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>

                      <td className="px-3 py-3">{u.name}</td>

                      <td className="px-3 py-3">
                        <span
                          className={`font-semibold ${
                            isFraud
                              ? "text-red-500"
                              : isAdmin
                                ? "text-green-500"
                                : isVendor
                                  ? "text-blue-500"
                                  : "text-gray-500"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            disabled={actionDisabled || isAdmin}
                            onClick={() => handleRoleChange(u._id, "admin")}
                            className="px-2 py-1 bg-green-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                          >
                            Admin
                          </button>

                          <button
                            disabled={actionDisabled || isVendor || isAdmin}
                            onClick={() => handleRoleChange(u._id, "vendor")}
                            className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                          >
                            Vendor
                          </button>

                          <button
                            disabled={actionDisabled || isFraud}
                            onClick={() => handleRoleChange(u._id, "fraud")}
                            className="px-2 py-1 bg-red-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                          >
                            Fraud
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {users.map((u, index) => {
              const isAdmin = u.role === "admin";
              const isVendor = u.role === "vendor";
              const isFraud = u.isFraud === true;

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white dark:bg-slate-900 shadow rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.photo || defaultAvatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{u.name}</h3>
                      <p className="text-sm mt-1">
                        Role: <span className="font-semibold">{u.role}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      disabled={actionDisabled || isAdmin || isFraud}
                      onClick={() => handleRoleChange(u._id, "admin")}
                      className="px-2 py-1 bg-green-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                    >
                      Admin
                    </button>

                    <button
                      disabled={
                        actionDisabled || isVendor || isAdmin || isFraud
                      }
                      onClick={() => handleRoleChange(u._id, "vendor")}
                      className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                    >
                      Vendor
                    </button>

                    <button
                      disabled={actionDisabled || isFraud}
                      onClick={() => handleRoleChange(u._id, "fraud")}
                      className="px-2 py-1 bg-red-500 text-white rounded disabled:bg-gray-300 cursor-pointer"
                    >
                      Fraud
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default UserManagement;
