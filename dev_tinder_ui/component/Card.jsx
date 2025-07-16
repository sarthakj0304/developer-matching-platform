import axios from "axios";
import React from "react";
import { useState } from "react";
const Card = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!user.photoURL) {
    if (user.gender && user.gender.toLowerCase() === "male") {
      user.photoURL =
        "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg";
    } else if (user.gender && user.gender.toLowerCase() === "female") {
      user.photoURL =
        "https://t4.ftcdn.net/jpg/02/70/22/85/360_F_270228529_iDayZ2Dl4ZeDClKl7ZnLgzN5HRIvlGlK.jpg";
    } else {
      user.photoURL =
        "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
    }
  }

  const handleClick = async (st) => {
    try {
      setIsVisible(false);
      setTimeout(() => {
        // Here you can update the state in the parent component
        //console.log(`User ${user.firstName} removed from UI`);
      }, 300);
      const res = await axios.post(
        "http://localhost:5001/request/send/" + st + "/" + user._id,

        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
  if (!isVisible) return null;
  return (
    <div className="bg-black bg-opacity-70 border border-purple-800 rounded-2xl w-96 shadow-xl p-4 transition-transform hover:scale-105 text-white">
      {/* User Photo */}
      <div className="flex justify-center mb-4">
        <img
          src={user.photoURL}
          alt="User"
          className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover shadow-md"
        />
      </div>

      {/* User Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-300">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-300">
          {user.age} | {user.gender}
        </p>
        <p className="text-gray-400 italic mt-2">{user.about}</p>

        {/* Skills (optional, if you want to include them) */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-purple-700 text-white px-3 py-1 rounded-full text-xs shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition"
            onClick={() => handleClick("accept")}
          >
            Request
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition"
            onClick={() => handleClick("ignore")}
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
