import React from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const RealTimeStats = ({ trains }) => {
  const total = trains.length;
  const running = trains.filter((t) => t.status === "Running").length;
  const delayed = trains.filter((t) => t.status === "Delayed").length;
  const onTime = trains.filter((t) => t.status === "On Time").length;
  const stopped = trains.filter((t) => t.status === "Stopped").length;
  const cancelled = trains.filter((t) => t.status === "Cancelled").length;

  const stats = [
    {
      label: "Total Trains",
      value: total,
      icon: <FiClock className="text-blue-500" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "On Time",
      value: onTime,
      icon: <FiCheckCircle className="text-green-500" />,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Delayed",
      value: delayed,
      icon: <FiAlertTriangle className="text-yellow-500" />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Running",
      value: running,
      icon: <FiClock className="text-indigo-500" />,
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-gradient-to-br opacity-10 rounded-full" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <div
            className={`mt-2 h-1 bg-gradient-to-r ${stat.color} rounded-full`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RealTimeStats;
