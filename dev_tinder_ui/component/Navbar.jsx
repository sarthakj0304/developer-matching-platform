import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../src/utils/userSlice";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Profile" },
    { to: "/connections", label: "Connections" },
    { to: "/Requests-Recieved", label: "Requests" },
  ];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg px-6 py-3 flex items-center justify-between"
    >
      {/* Left: Nav Links */}
      <div className="flex gap-6 text-sm font-semibold text-purple-200">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={link.to}
              className="hover:text-purple-100 transition-colors"
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Center: Logo */}
      <span className="text-lg font-bold text-purple-100">Dev Tinder</span>

      {/* Right: Logout */}
      <button
        className="px-4 py-1 rounded-lg border border-purple-300 text-purple-200 hover:bg-purple-500/20 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </motion.div>
  );
};

export default Navbar;
