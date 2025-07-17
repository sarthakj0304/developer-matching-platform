import React, { useState } from "react";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert skills string to array
    const dataToSend = {
      ...formData,
      age: Number(formData.age),
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      const response = await axios.post(`${serverUrl}/sign-up`, dataToSend, {
        withCredentials: true,
      });

      if (response.status == 201) {
        alert("Sign-up successful!");
      } else {
        alert("Sign-up failed.");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-black">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Sign-up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.firstName}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.lastName}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <input
            type="email"
            name="emailId"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.emailId}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            value={formData.age}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white"
            required
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="about"
            placeholder="About you"
            onChange={handleChange}
            value={formData.about}
            rows="3"
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
          ></textarea>
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            value={formData.skills}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 transition rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
