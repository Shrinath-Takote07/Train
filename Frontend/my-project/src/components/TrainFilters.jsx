import React from "react";
import { motion } from "framer-motion";

const TrainFilters = ({ filterStatus, setFilterStatus }) => {
  const filters = [
    {
      value: "all",
      label: "All Trains",
      color: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    },
    {
      value: "Running",
      label: "🚂 Running",
      color: "bg-green-200 text-green-700 hover:bg-green-300",
    },
    {
      value: "Delayed",
      label: "⏰ Delayed",
      color: "bg-yellow-200 text-yellow-700 hover:bg-yellow-300",
    },
    {
      value: "On Time",
      label: "✅ On Time",
      color: "bg-blue-200 text-blue-700 hover:bg-blue-300",
    },
    {
      value: "Stopped",
      label: "⏹️ Stopped",
      color: "bg-red-200 text-red-700 hover:bg-red-300",
    },
    {
      value: "Cancelled",
      label: "❌ Cancelled",
      color: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterStatus === filter.value
                ? "bg-blue-600 text-white shadow-md"
                : filter.color
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TrainFilters;
