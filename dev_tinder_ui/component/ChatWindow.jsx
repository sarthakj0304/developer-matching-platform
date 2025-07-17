import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(`${serverUrl}`, { withCredentials: true });
import { useSelector, useDispatch } from "react-redux";

export default function ChatWindow({ user, onClose }) {
  const userData = useSelector((store) => store.user);
  const currentUserId = userData._id;
  console.log("current user id", currentUserId);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // Fetch previous messages
    axios
      .get(`${serverUrl}/messages/${currentUserId}/${user._id}`)
      .then((res) => {
        console.log("Messages response:", res.data);
        setMessages(res.data); // Make sure res.data is an array
      })
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
    <div className="fixed right-0 top-0 w-96 h-full bg-black shadow-lg p-4 flex flex-col z-50">
      {/* Header */}
      <div className="relative text-center mb-2">
        <h2 className="text-purple-900 text-lg font-semibold mb-4">
          Chat with {user.firstName} {user.lastName}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-0 top-0 text-gray-600 text-xl hover:cursor-pointer transition"
        >
          &times;
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {Array.isArray(messages) &&
          messages
            .filter((msg) => msg.content && msg.content.trim().length > 0) // 🚫 Skip empty
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
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.senderId === currentUserId
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          className="border rounded px-4 py-2 mt-2 bg-white text-black"
          value={newMsg}
          placeholder="Type a message..."
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
