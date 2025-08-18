import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../src/utils/userSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  // only render children if user exists
  if (!userData) return null;

  return (
    <div className="bg-gradient-to-b from-purple-900 via-black to-black min-h-screen pt-16">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
