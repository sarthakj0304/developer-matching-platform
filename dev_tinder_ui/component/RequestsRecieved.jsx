import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const getDefaultPhoto = (gender) => {
  if (gender?.toLowerCase() === "male") {
    return "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg";
  } else if (gender?.toLowerCase() === "female") {
    return "https://t4.ftcdn.net/jpg/02/70/22/85/360_F_270228529_iDayZ2Dl4ZeDClKl7ZnLgzN5HRIvlGlK.jpg";
  }
  return "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
};

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${serverUrl}/requests/received`, {
        withCredentials: true,
      });
      setRequests(response.data.connectionRequests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (status, fromUserId) => {
    setRequests((prev) =>
      prev.filter((req) => req.fromUserId._id !== fromUserId)
    );
    try {
      await axios.post(
        `${serverUrl}/request/recieve/${status}/${fromUserId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating request:", error);
      fetchRequests();
    }
  };

  if (loading) {
    return <p className="text-purple-300 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">
          Requests Received
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-300 text-center">No connection requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const user = request.fromUserId;
              const profilePic = user.photoUrl || getDefaultPhoto(user.gender);

              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-white/5 border border-white/20 p-4 rounded-lg backdrop-blur-sm shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={profilePic}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-purple-300 text-sm">
                        {user.about || "No bio available."}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 transition"
                      onClick={() =>
                        handleRequest("accept", request.fromUserId._id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
                      onClick={() =>
                        handleRequest("ignore", request.fromUserId._id)
                      }
                    >
                      Ignore
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestsReceived;
