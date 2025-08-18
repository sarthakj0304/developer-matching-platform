import io from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(`${serverUrl}`, { withCredentials: true });

export default function ChatWindow({ user, onClose }) {
  const userData = useSelector((store) => store.user);
  const currentUserId = userData._id;
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${serverUrl}/messages/${currentUserId}/${user._id}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);

    socket.on(`chat:${currentUserId}`, (msg) => {
      if (msg.senderId === user._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off(`chat:${currentUserId}`);
    };
  }, [user]);

  const sendMessage = () => {
    if (newMsg.trim()) {
      const msg = {
        senderId: currentUserId,
        receiverId: user._id,
        content: newMsg,
      };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setNewMsg("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 w-96 h-full bg-white/10 backdrop-blur-md border-l border-white/20 shadow-xl p-4 flex flex-col z-50 rounded-l-2xl"
    >
      {/* Header */}
      <div className="relative text-center mb-4">
        <h2 className="text-purple-300 text-lg font-semibold">
          Chat with {user.firstName} {user.lastName}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-0 top-0 text-purple-300 text-xl hover:text-purple-100 transition"
        >
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {Array.isArray(messages) &&
          messages
            .filter((msg) => msg.content?.trim())
            .map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs shadow-md ${
                    msg.senderId === currentUserId
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                      : "bg-white/20 text-purple-100 rounded-bl-none border border-white/10"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-white/20 rounded-lg px-4 py-2 bg-white/10 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={newMsg}
          placeholder="Type a message..."
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 px-4 py-2 rounded-lg text-white font-semibold shadow-md transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
