import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../src/utils/requestSlice";
import ChatWindow from "./ChatWindow";
import { motion } from "framer-motion";

const Connections = () => {
  const [activeChatUser, setActiveChatUser] = useState(null);
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

  const handleOpenChat = (connection) => {
    setActiveChatUser(connection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black p-6 pt-20">
      <h2 className="text-3xl font-bold text-purple-300 mb-8 text-center">
        Your Connections
      </h2>

      {connections.length === 0 ? (
        <p className="text-purple-200 text-center">No connections found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {connections.map((connection, index) => (
            <motion.div
              key={connection._id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-[1.02] transition-transform"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500 shadow-md mb-4">
                <img
                  src={connection.photoURL || "/default-avatar.png"}
                  alt={connection.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-purple-300 text-center">
                {connection.firstName} {connection.lastName}
              </h3>

              {/* Chat Button */}
              <button
                className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold shadow-md transition"
                onClick={() => handleOpenChat(connection)}
              >
                Chat
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chat Window */}
      {activeChatUser && (
        <ChatWindow
          user={activeChatUser}
          onClose={() => setActiveChatUser(null)}
        />
      )}
    </div>
  );
};

export default Connections;
