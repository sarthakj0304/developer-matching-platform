import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../src/utils/requestSlice";

const Connections = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.request.connections);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${serverUrl}/connections`, {
          withCredentials: true,
        });
        dispatch(addConnection(response.data.connections));
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
    fetchConnections();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-black p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Your Connections
      </h2>
      {connections.length === 0 ? (
        <p className="text-gray-300">No connections found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center"
            >
              <img
                src={connection.photoURL || "/default-avatar.png"}
                alt={connection.name}
                className="w-20 h-20 rounded-full mb-3 object-cover"
              />
              <h3 className="text-lg font-medium text-black">
                {connection.firstName} {connection.lastName}
              </h3>
              <button
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
                onClick={() => handleOpenChat(connection)}
              ></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
