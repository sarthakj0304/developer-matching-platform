import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../src/utils/userSlice";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const EditProfile = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user); // Fetch user data from Redux store
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

  // Populate form data with user data when component mounts
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
  }, []);

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = { ...formData };
      console.log(updatedData);

      // Send updated data to the backend
      const response = await axios.post(
        `${serverUrl}/profile/edit`,
        updatedData,
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(updatedData));
      setShowPopup(true);

      // ✅ Hide popup after 2 seconds
      setTimeout(async () => setShowPopup(false), 2000);

      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      {showPopup && (
        <div
          role="alert"
          className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Profile updated successfully!
        </div>
      )}

      <h1 className="text-3xl font-bold text-purple-300 mb-6">Edit Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-lg"
      >
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* About */}
        <div className="mb-4">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            About
          </label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-purple-200 text-sm font-semibold mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
