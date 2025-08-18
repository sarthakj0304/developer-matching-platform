import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../src/utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/login`,
        { emailId: email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold text-white"
        >
          Login
        </button>

        <p className="text-sm text-gray-300 text-center mt-4">
          Not a user?{" "}
          <Link to="/sign-up" className="text-purple-300 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
