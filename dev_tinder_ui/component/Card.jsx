import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Card = ({ user }) => {
  //console.log(user);
  const [isVisible, setIsVisible] = useState(true);

  //Fallback avatar based on gender
  const getPhotoURL = (user) => {
    if (user?.photoURL) return user.photoURL;

    if (user?.gender?.toLowerCase() === "male") {
      return "https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png";
    }
    if (user?.gender?.toLowerCase() === "female") {
      return "https://t4.ftcdn.net/jpg/02/70/22/85/360_F_270228529_iDayZ2Dl4ZeDClKl7ZnLgzN5HRIvlGlK.jpg";
    }
    return "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
  };

  const handleClick = async (st) => {
    try {
      setIsVisible(false);
      setTimeout(() => {}, 300); // Optional delay for animation before removal
      await axios.post(
        `${serverUrl}/request/send/${st}/${user._id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-80 shadow-lg p-5 text-white hover:scale-[1.02] transition-transform"
    >
      {/* User Photo */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-md">
          <img
            src={getPhotoURL(user)}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-300">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-purple-200">
          {user.age} | {user.gender}
        </p>
        {user.about && (
          <p className="text-purple-100/80 italic mt-2">{user.about}</p>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="glass-morphism bg-purple-700/60 px-3 py-1 rounded-full text-xs shadow-sm border border-purple-400/30"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold shadow-md transition"
            onClick={() => handleClick("accept")}
          >
            Request
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold shadow-md transition"
            onClick={() => handleClick("ignore")}
          >
            Ignore
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
