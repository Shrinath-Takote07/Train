import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiBarChart2,
  FiInfo,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrainDetails = () => {
  const { id } = useParams();
  const { subscribeToTrain, unsubscribeFromTrain } = useSocket();
  const [realTimeData, setRealTimeData] = useState(null);

  const { data, isLoading, error } = useQuery(["train", id], async () => {
    const response = await api.get(`/api/trains/${id}`);
    return response.data;
  });

  useEffect(() => {
    if (id) {
      subscribeToTrain(id);
      return () => unsubscribeFromTrain(id);
    }
  }, [id]);

  useEffect(() => {
    if (data?.data) {
      setRealTimeData(data.data);
    }
  }, [data]);

  const statusColors = {
    Running: "bg-green-100 text-green-700",
    Stopped: "bg-red-100 text-red-700",
    Delayed: "bg-yellow-100 text-yellow-700",
    "On Time": "bg-blue-100 text-blue-700",
    Cancelled: "bg-gray-100 text-gray-700",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !realTimeData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Train not found</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 5} mins`,
    speed: Math.floor(Math.random() * 60) + 20,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
      >
        <FiArrowLeft />
        Back to Dashboard
      </Link>

      {/* Train Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {realTimeData.trainName}
            </h1>
            <p className="text-gray-500">Train #{realTimeData.number}</p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[realTimeData.status]}`}
          >
            {realTimeData.status}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: <FiMapPin />,
            label: "Current Station",
            value: realTimeData.currentStation,
          },
          {
            icon: <FiMapPin />,
            label: "Next Station",
            value: realTimeData.nextStation,
          },
          {
            icon: <FiClock />,
            label: "Delay",
            value:
              realTimeData.delay > 0 ? `${realTimeData.delay} mins` : "On Time",
          },
          {
            icon: <FiActivity />,
            label: "Speed",
            value: `${realTimeData.speed} km/h`,
          },
          { icon: <FiInfo />, label: "Platform", value: realTimeData.platform },
          {
            icon: <FiCalendar />,
            label: "Last Updated",
            value: new Date(realTimeData.lastUpdated).toLocaleTimeString(),
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-md p-4"
          >
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              {stat.icon}
              <span className="text-sm">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Journey Progress</h3>
          <span className="text-sm text-gray-500">
            {realTimeData.progress}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${realTimeData.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{realTimeData.source}</span>
          <span>{realTimeData.destination}</span>
        </div>
      </div>

      {/* Route Timeline */}
      {realTimeData.stops && realTimeData.stops.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Route Schedule</h3>
          <div className="relative border-l-2 border-blue-200 ml-3 md:ml-0 space-y-6 pl-6 md:pl-8">
            {/* Source */}
            <div className="relative">
              <div className="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow"></div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {realTimeData.source} (Start)
                </h4>
                <p className="text-sm text-gray-500">
                  Departure:{" "}
                  {new Date(realTimeData.departureTime).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Intermediate Stops */}
            {realTimeData.stops.map((stop, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {stop.stationName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Arr: {new Date(stop.arrivalTime).toLocaleTimeString()} |
                    Dep: {new Date(stop.departureTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Destination */}
            <div className="relative">
              <div className="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow"></div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {realTimeData.destination} (End)
                </h4>
                <p className="text-sm text-gray-500">
                  Arrival:{" "}
                  {new Date(realTimeData.arrivalTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart2 className="text-blue-500" />
          <h3 className="font-semibold text-gray-900">
            Speed Trend (Last Hour)
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                color: "#F3F4F6",
                border: "none",
              }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TrainDetails;
