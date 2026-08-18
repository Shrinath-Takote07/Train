import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiArrowRight,
} from "react-icons/fi";

const TrainCard = ({ train }) => {
  const statusColors = {
    Running: "bg-green-100 text-green-700 border-green-200",
    Stopped: "bg-red-100 text-red-700 border-red-200",
    Delayed: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "On Time": "bg-blue-100 text-blue-700 border-blue-200",
    Cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusIcons = {
    Running: <FiActivity className="animate-pulse" />,
    Stopped: <FiXCircle />,
    Delayed: <FiAlertCircle className="animate-bounce" />,
    "On Time": <FiCheckCircle />,
    Cancelled: <FiXCircle />,
  };

  const progressColor =
    train.progress >= 80
      ? "bg-green-500"
      : train.progress >= 50
        ? "bg-yellow-500"
        : "bg-blue-500";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {train.trainName}
            </h3>
            <p className="text-sm text-gray-500">#{train.number}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[train.status]}`}
          >
            {statusIcons[train.status]}
            <span>{train.status}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiMapPin className="text-blue-500" />
            <span className="font-medium">{train.currentStation}</span>
            <FiArrowRight className="mx-1 text-gray-400" />
            <span className="font-medium">{train.nextStation}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiClock className="text-blue-500" />
            {train.delay > 0 ? (
              <span className="text-red-600 font-medium">
                Delayed by {train.delay} mins
              </span>
            ) : (
              <span className="text-green-600 font-medium">On Schedule</span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{train.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${progressColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${train.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Platform:</span>
              <span className="font-semibold text-gray-700">
                {train.platform}
              </span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-500">{train.speed} km/h</span>
            </div>
            <Link
              to={`/train/${train.trainId}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition"
            >
              Details
              <FiArrowRight className="inline" />
            </Link>
          </div>
        </div>
      </div>

      {/* Progress bar animation - subtle moving gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]" />
    </motion.div>
  );
};

export default TrainCard;
