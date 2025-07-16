import axios from "axios";
import React, { useEffect, useState } from "react";

const getDefaultPhoto = (gender) => {
  if (gender && gender.toLowerCase() === "male") {
    return "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg";
  } else if (gender && gender.toLowerCase() === "female") {
    return "https://t4.ftcdn.net/jpg/02/70/22/85/360_F_270228529_iDayZ2Dl4ZeDClKl7ZnLgzN5HRIvlGlK.jpg";
  } else {
    return "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";
  }
};

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/requests/received",
        { withCredentials: true }
      );
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
        `http://localhost:5001/request/recieve/${status}/${fromUserId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating request:", error);
      fetchRequests();
    }
  };

  if (loading) return <p className="text-purple-300 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-xl mx-auto mt-10 bg-black bg-opacity-80 rounded-2xl shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
          Requests Received
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-400 text-center">No connection requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const user = request.fromUserId;
              const profilePic = user.photoUrl || getDefaultPhoto(user.gender);

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-purple-900 bg-opacity-20 p-4 rounded-lg backdrop-blur-sm shadow-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={profilePic}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">
                        {request.fromUserId.firstName}{" "}
                        {request.fromUserId.lastName}
                      </p>

                      <p className="text-purple-300 text-sm">
                        {user.about || "No bio available."}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      onClick={() =>
                        handleRequest("accept", request.fromUserId._id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() =>
                        handleRequest("ignore", request.fromUserId._id)
                      }
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsReceived;
