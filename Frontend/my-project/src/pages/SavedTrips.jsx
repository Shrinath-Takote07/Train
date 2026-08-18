import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiBell, FiBellOff, FiClock, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

const SavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState([
    {
      id: 1,
      trainName: "Rajdhani Express",
      trainNumber: "12345",
      from: "New Delhi",
      to: "Mumbai Central",
      date: "2024-12-25",
      notifications: true,
    },
    {
      id: 2,
      trainName: "Shatabdi Express",
      trainNumber: "67890",
      from: "Howrah",
      to: "New Delhi",
      date: "2024-12-28",
      notifications: false,
    },
  ]);

  const toggleNotification = (id) => {
    setSavedTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, notifications: !trip.notifications } : trip,
      ),
    );
    toast.success("Notification preference updated");
  };

  const removeTrip = (id) => {
    setSavedTrips((prev) => prev.filter((trip) => trip.id !== id));
    toast.success("Trip removed from saved list");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">📌</span>
          Saved Trips
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your favorite journeys and set notifications
        </p>
      </div>

      <div className="space-y-4">
        {savedTrips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No saved trips yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start tracking trains to save them here
            </p>
          </div>
        ) : (
          savedTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {trip.trainName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      #{trip.trainNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-blue-500" />
                      <span>{trip.from}</span>
                    </div>
                    <span className="text-gray-300">→</span>
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-purple-500" />
                      <span>{trip.to}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <FiClock className="text-gray-400" />
                    <span>
                      {new Date(trip.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleNotification(trip.id)}
                    className={`p-2 rounded-lg transition ${
                      trip.notifications
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {trip.notifications ? <FiBell /> : <FiBellOff />}
                  </button>
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SavedTrips;
