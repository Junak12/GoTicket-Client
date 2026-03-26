import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/Axios/useAxios";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const RevenueOverview = () => {
  const instance = useAxios();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["revenue-overview"],
    queryFn: async () => {
      const res = await instance.get("/vendor/revenue-overview");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  const chartData = [
    { name: "Revenue", value: data.totalRevenue },
    { name: "Sold", value: data.totalTicketsSold },
    { name: "Added", value: data.totalTicketsAdded },
  ];

  const stats = [
    { title: "Total Revenue", value: data.totalRevenue, prefix: "৳ " },
    { title: "Tickets Sold", value: data.totalTicketsSold },
    { title: "Tickets Added", value: data.totalTicketsAdded },
  ];

  return (
    <div className="p-4 md:p-6 lg:pl-60">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-cyan-500">
        Revenue Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              {item.title}
            </h3>
            <p className="text-3xl font-bold mt-3 text-gray-800 dark:text-gray-100">
              <CountUp
                end={item.value || 0}
                duration={1.5}
                separator=","
                prefix={item.prefix || ""}
              />
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 className="mb-6 font-semibold text-gray-700 dark:text-gray-200 text-lg">
          Overview Analytics
        </h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280" }}
              className="dark:fill-gray-400"
            />
            <YAxis tick={{ fill: "#6b7280" }} className="dark:fill-gray-400" />

            <Tooltip
              contentStyle={{ borderRadius: "10px" }}
              wrapperClassName="
                !bg-white dark:!bg-gray-800 
                !border !border-gray-200 dark:!border-gray-700 
                !text-gray-800 dark:!text-white
              "
              labelClassName="!text-gray-800 dark:!text-white"
              formatter={(value, name) => [`৳ ${value}`, name]}
            />

            {/* GRADIENT BARS */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              {chartData.map((entry, index) => {
                const gradient =
                  index === 0
                    ? "url(#colorRevenue)"
                    : index === 1
                      ? "url(#colorSold)"
                      : "url(#colorAdded)";
                return (
                  <Cell
                    key={index}
                    fill={gradient}
                    className="hover:opacity-90 transition-all duration-300"
                  />
                );
              })}
            </Bar>

            <Line
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              className="dark:stroke-red-400"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default RevenueOverview;
