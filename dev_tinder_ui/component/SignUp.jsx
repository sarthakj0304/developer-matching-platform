import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: emailFromParams,
    password: "",
    age: "",
    gender: "",
    about: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      age: Number(formData.age),
      skills: formData.skills.split(",").map((s) => s.trim()),
    };
    try {
      const res = await axios.post(`${serverUrl}/sign-up`, dataToSend, {
        withCredentials: true,
      });
      if (res.status === 201) {
        alert("Sign-up successful!");
        navigate("/");
      }
    } catch (err) {
      alert("Sign-up failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">
          Sign Up
        </h2>

        {[
          { name: "firstName", placeholder: "First Name" },
          { name: "lastName", placeholder: "Last Name" },
          { name: "emailId", placeholder: "Email Address", type: "email" },
          { name: "password", placeholder: "Password", type: "password" },
          { name: "age", placeholder: "Age", type: "number" },
        ].map((f) => (
          <input
            key={f.name}
            name={f.name}
            type={f.type || "text"}
            placeholder={f.placeholder}
            value={formData[f.name]}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
            required
          />
        ))}

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
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
          value={formData.about}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
        />

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold text-white"
        >
          Sign Up
        </button>
      </motion.form>
    </div>
  );
};

export default SignUp;
