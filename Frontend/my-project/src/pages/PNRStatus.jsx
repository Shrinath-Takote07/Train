import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import TrainCard from "../components/TrainCard";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiAlertTriangle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const PNRStatus = () => {
  const { number } = useParams();
  const { subscribeToPNR } = useSocket();
  const [pnrData, setPnrData] = useState(null);

  const { data, isLoading, error } = useQuery(
    ["pnr", number],
    async () => {
      const response = await axios.get(
        `https://train-git-main-shrinath-takote07s-projects.vercel.app/api/pnr/${number}`,
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        setPnrData(data.data);
        toast.success(`PNR ${number} status loaded`);
      },
      onError: () => {
        toast.error("Failed to load PNR status");
      },
    },
  );

  useEffect(() => {
    if (number) {
      subscribeToPNR(number);
    }
  }, [number]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !pnrData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-red-600 text-lg">PNR not found</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const statusColor = {
    Confirmed: "bg-green-100 text-green-700",
    "Waiting List": "bg-yellow-100 text-yellow-700",
    RAC: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const passengerStatusColor = {
    Confirmed: "bg-green-500",
    "Waiting List": "bg-yellow-500",
    RAC: "bg-blue-500",
    Cancelled: "bg-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
      >
        <FiArrowLeft />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">PNR Status</h1>
              <p className="text-blue-100">{pnrData.pnrNumber}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor[pnrData.bookingStatus]}`}
            >
              {pnrData.bookingStatus}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Journey Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiMapPin className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold">{pnrData.from}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiMapPin className="text-purple-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-semibold">{pnrData.to}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiCalendar className="text-green-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Journey Date</p>
                <p className="font-semibold">
                  {new Date(pnrData.journeyDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiClock className="text-yellow-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold">
                  {new Date(pnrData.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Train Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FiAlertTriangle className="text-blue-500" />
              <h3 className="font-semibold text-gray-900">Live Train Tracking</h3>
            </div>
            
            {pnrData.trainDetails ? (
              <div className="mt-4 max-w-md mx-auto md:max-w-full">
                <TrainCard train={pnrData.trainDetails} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Train Name</p>
                  <p className="font-medium">{pnrData.trainName}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Train Number</p>
                  <p className="font-medium">{pnrData.trainNumber}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{pnrData.classType}</p>
                </div>
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FiUser className="text-blue-500" />
              <h3 className="font-semibold text-gray-900">Passengers</h3>
            </div>
            <div className="space-y-2">
              {pnrData.passengers?.map((passenger, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${passengerStatusColor[passenger.status]}`}
                    />
                    <div>
                      <p className="font-medium">{passenger.name}</p>
                      <p className="text-sm text-gray-500">
                        Coach: {passenger.coach} | Seat: {passenger.seatNumber}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${passenger.status === "Confirmed" ? "text-green-600" : passenger.status === "Cancelled" ? "text-red-600" : "text-yellow-600"}`}
                  >
                    {passenger.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chart Prepared */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              {pnrData.chartPrepared ? (
                <FiCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FiXCircle className="text-gray-400 text-xl" />
              )}
              <span className="font-medium text-gray-900">
                Chart Status:{" "}
                {pnrData.chartPrepared ? "✅ Prepared" : "⏳ Not Prepared Yet"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PNRStatus;
