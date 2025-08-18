import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../src/utils/userSlice";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Profile = () => {
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!userData || userData.firstName === undefined) {
      fetchUser();
    }
  }, [userData]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!userData) {
    return <div className="text-center mt-8 text-purple-200">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 text-center max-w-lg w-full"
      >
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-md">
            <img
              src={userData.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-bold text-purple-300 mb-1">
          {userData.firstName} {userData.lastName}
        </h1>
        <p className="text-purple-200">Age: {userData.age}</p>
        <p className="text-purple-200">Gender: {userData.gender}</p>
        <p className="text-purple-100/80 italic mt-4">{userData.about}</p>

        {/* Skills */}
        {userData.skills && userData.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-purple-200">Skills</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Edit Button */}
        <button
          onClick={handleEditProfile}
          className="mt-8 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold shadow-md transition"
        >
          Edit Profile
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
