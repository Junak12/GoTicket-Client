import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../../hooks/Axios/useAxios";
import Swal from "sweetalert2";

const VendorRequests = () => {
  const instance = useAxios();

  const fetchVendors = async () => {
    const res = await instance.get("/admin/vendor-application");
    return res.data;
  };

  const {
    data: vendors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  const handleStatus = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${type} this application?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    const res = await instance.patch(`/admin/vendor-application/${id}`, {
      status: type,
    });

    if (res.data.success) {
      Swal.fire(
        `${type.charAt(0).toUpperCase() + type.slice(1)}!`,
        "",
        "success",
      );
      refetch();
    }
  };

  const tableVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-4 md:py-15 py-10 text-gray-800 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl text-center font-semibold mb-6 text-cyan-500">
        Vendor Applications
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
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border dark:border-slate-700">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-3 text-left">Full Name</th>
                  <th className="px-3 py-3 text-left">Business Name</th>
                  <th className="px-3 py-3 text-left">Business Type</th>
                  <th className="px-3 py-3 text-left">Email</th>
                  <th className="px-3 py-3 text-left">Phone</th>
                  <th className="px-3 py-3 text-left">NID Number</th>
                  <th className="px-3 py-3 text-left">Business License</th>
                  <th className="px-3 py-3 text-left">Address</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <motion.tbody
                variants={tableVariants}
                initial="hidden"
                animate="show"
                className="bg-white dark:bg-slate-900 divide-y dark:divide-slate-700"
              >
                {vendors.map((v) => (
                  <motion.tr
                    key={v._id}
                    variants={rowVariants}
                    whileHover={{ scale: 1.01 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-3 py-3">{v.fullName}</td>
                    <td className="px-3 py-3">{v.businessName}</td>
                    <td className="px-3 py-3">{v.businessType}</td>
                    <td className="px-3 py-3">{v.email}</td>
                    <td className="px-3 py-3">{v.phone}</td>
                    <td className="px-3 py-3">{v.nidNumber}</td>
                    <td className="px-3 py-3">{v.businessLicense}</td>
                    <td className="px-3 py-3">{v.address}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleStatus(v._id, "approved")}
                          className="px-2 py-1 bg-green-500 text-white rounded cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(v._id, "rejected")}
                          className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {vendors.map((v, index) => (
              <motion.div
                key={v._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow flex flex-col gap-3"
              >
                <p>
                  <span className="font-semibold">Full Name:</span> {v.fullName}
                </p>
                <p>
                  <span className="font-semibold">Business:</span>{" "}
                  {v.businessName} ({v.businessType})
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {v.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {v.phone}
                </p>
                <p>
                  <span className="font-semibold">NID Number:</span>{" "}
                  {v.nidNumber}
                </p>
                <p>
                  <span className="font-semibold">Business License:</span>{" "}
                  {v.businessLicense}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {v.address}
                </p>

                <div className="flex gap-2 flex-wrap mt-2">
                  <button
                    onClick={() => handleStatus(v._id, "approved")}
                    className="flex-1 bg-green-500 text-white py-1 rounded cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(v._id, "rejected")}
                    className="flex-1 bg-red-500 text-white py-1 rounded cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default VendorRequests;
