import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "../src/utils/userSlice";

const Profile = () => {
  const userData = useSelector((store) => store.user); // Fetch user data from Redux store
  console.log(userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5001/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data)); // Update Redux store with user data
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login"); // Redirect to login if unauthorized
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData || userData.firstName == undefined) {
      fetchUser();
    }
  }, [userData]);

  const handleEditProfile = () => {
    navigate("/edit-profile"); // Navigate to the edit profile page
  };

  if (!userData) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-6">
      {/* Profile Photo */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-400 shadow-xl">
        <img
          src={userData.photoURL}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold text-purple-300">
          {userData.firstName} {userData.lastName}
        </h1>
        <p className="text-lg text-gray-300">Age: {userData.age}</p>
        <p className="text-lg text-gray-300">Gender: {userData.gender}</p>
        <p className="text-md text-gray-400 mt-4 max-w-xl">{userData.about}</p>

        {/* Skills */}
        {userData.skills && userData.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-purple-200">Skills</h3>
            <ul className="flex flex-wrap justify-center gap-2 mt-2">
              {userData.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-purple-700 text-white px-4 py-1 rounded-full text-sm shadow-md"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={handleEditProfile}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
