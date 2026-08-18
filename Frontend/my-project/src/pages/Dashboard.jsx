import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import TrainCard from "../components/TrainCard";
import PNRSearch from "../components/PNRSearch";
import TrainFilters from "../components/TrainFilters";
import RealTimeStats from "../components/RealTimeStats";
import RouteSearch from "../components/RouteSearch";
import { FiRefreshCw, FiActivity } from "react-icons/fi";

const Dashboard = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [routeFilters, setRouteFilters] = useState({ source: "", destination: "" });
  const { isConnected } = useSocket();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isLoading, error, refetch } = useQuery(
    ["trains", filterStatus, routeFilters],
    async () => {
      let url = `/api/trains?status=${filterStatus}`;
      if (routeFilters.source) url += `&source=${encodeURIComponent(routeFilters.source)}`;
      if (routeFilters.destination) url += `&destination=${encodeURIComponent(routeFilters.destination)}`;

      const response = await api.get(url); // ✅ sends credentials + token
      return response.data;
    },
    { refetchInterval: autoRefresh ? 5000 : false }
  );

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refetch, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚆 Live Train Status Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time tracking of trains with WebSocket updates</p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-full ${
              isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <FiActivity className={isConnected ? "animate-pulse" : ""} />
            <span className="text-sm font-medium">{isConnected ? "Live" : "Disconnected"}</span>
          </div>
          <button
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              if (!autoRefresh) refetch();
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              autoRefresh ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiRefreshCw className={autoRefresh ? "animate-spin-slow" : ""} />
            {autoRefresh ? "Auto Refresh" : "Refresh"}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <RealTimeStats trains={data?.data || []} />

      {/* Search and Filters */}
      <RouteSearch setRouteFilters={setRouteFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrainFilters filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
        </div>
        <div>
          <PNRSearch />
        </div>
      </div>

      {/* Train Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-600">Error loading trains</p>
            <button
              onClick={refetch}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {data?.data?.map((train, index) => (
              <motion.div
                key={train.trainId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <TrainCard train={train} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {data?.data?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No trains found matching the criteria</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
