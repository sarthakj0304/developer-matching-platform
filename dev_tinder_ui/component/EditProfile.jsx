import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../src/utils/userSlice";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const EditProfile = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        age: userData.age || "",
        gender: userData.gender || "",
        about: userData.about || "",
        skills: userData.skills ? userData.skills.join(", ") : "",
      });
    }
  }, [userData]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      await axios.post(`${serverUrl}/profile/edit`, updatedData, {
        withCredentials: true,
      });
      dispatch(addUser(updatedData));
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Profile updated successfully!
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-purple-300 mb-6"
      >
        Edit Profile
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg space-y-4"
      >
        {[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "age", label: "Age", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-purple-200 text-sm font-semibold mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="male" className="bg-black text-white">
              Male
            </option>
            <option value="female" className="bg-black text-white">
              Female
            </option>
            <option value="others" className="bg-black text-white">
              Others
            </option>
          </select>
        </div>

        {/* About */}
        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            About
          </label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition"
        >
          Save Changes
        </button>
      </motion.form>
    </div>
  );
};

export default EditProfile;
