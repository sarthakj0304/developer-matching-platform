import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../src/utils/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/logout",
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="navbar bg-purple-900 bg-opacity-80 backdrop-blur-md shadow-md text-white fixed top-0 z-50 px-6">
      {/* Left Section: Nav Links */}
      <div className="navbar-start space-x-4 font-semibold text-sm">
        <Link to="/" className="hover:text-purple-300 transition">
          Home
        </Link>
        <Link to="/profile" className="hover:text-purple-300 transition">
          Profile
        </Link>
        <Link to="/connections" className="hover:text-purple-300 transition">
          Connections
        </Link>
        <Link
          to="/Requests-Recieved"
          className="hover:text-purple-300 transition"
        >
          Requests
        </Link>
      </div>

      {/* Center Section: Dev Tinder (not clickable) */}
      <div className="navbar-center">
        <span className="text-xl font-bold text-purple-100">Dev Tinder</span>
      </div>

      {/* Right Section: Logout Button */}
      <div className="navbar-end">
        <button
          className="btn btn-sm btn-outline border-purple-300 text-purple-100 hover:bg-purple-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
