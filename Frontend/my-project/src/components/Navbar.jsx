import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiBookmark, FiBell, FiUser } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FiHome /> },
    { path: "/saved-trips", label: "Saved Trips", icon: <FiBookmark /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              🚆
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Railoo
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}

            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-50">
              <FiBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <button className="p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-50">
              <FiUser className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
