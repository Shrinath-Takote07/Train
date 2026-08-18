import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import toast from "react-hot-toast";

const PNRSearch = () => {
  const [pnrNumber, setPnrNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedPNR = pnrNumber.trim();
    if (!cleanedPNR) {
      toast.error("Please enter a PNR number");
      return;
    }

    if (!/^PNR\d{6}$/.test(cleanedPNR) && !/^\d{10}$/.test(cleanedPNR)) {
      toast.error("Invalid PNR format. Use PNR123456 or 10-digit number");
      return;
    }

    navigate(`/pnr/${cleanedPNR}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-md p-4"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineTicket className="text-blue-500 text-xl" />
          <h3 className="font-semibold text-gray-900">PNR Status Check</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
            placeholder="Enter PNR number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FiSearch />
            <span>Check</span>
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter 10-digit PNR number (e.g., 1234567890)
        </p>
      </form>
    </motion.div>
  );
};

export default PNRSearch;
