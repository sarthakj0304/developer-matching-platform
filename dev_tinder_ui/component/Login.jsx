import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../src/utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
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
        {
          emailId: email,
          password: password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (err) {
      if (err.response?.status === 404) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-black">
      <div className="card bg-neutral text-neutral-content w-96 shadow-2xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl mb-6">Login</h2>

          {/* Email Fieldset */}
          <fieldset className="w-full mb-4">
            <legend className="text-lg font-semibold mb-1">Email</legend>
            <input
              type="text"
              value={email}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>

          {/* Password Fieldset */}
          <fieldset className="w-full mb-4">
            <legend className="text-lg font-semibold mb-1">Password</legend>
            <input
              type="password"
              value={password}
              className="input input-bordered w-full"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {/* Login Button */}
          <button className="btn btn-primary w-full mb-2" onClick={handleLogin}>
            Login
          </button>

          {/* Sign-up Link */}
          <p className="text-sm">
            Not a user?{" "}
            <Link to="/sign-up" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
