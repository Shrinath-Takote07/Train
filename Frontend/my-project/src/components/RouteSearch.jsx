import React, { useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const RouteSearch = ({ setRouteFilters }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source && !destination) {
      setRouteFilters({ source: "", destination: "" });
      return;
    }
    setRouteFilters({ source, destination });
  };

  const handleClear = () => {
    setSource("");
    setDestination("");
    setRouteFilters({ source: "", destination: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 mb-6"
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Junction
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. New Delhi"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Junction
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="e.g. Mumbai Central"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
          <button
            type="submit"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
          >
            <FiSearch />
            Search Trains
          </button>
          
          {(source || destination) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default RouteSearch;
