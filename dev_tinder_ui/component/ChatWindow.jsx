import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(`${serverUrl}`, { withCredentials: true });

export default function ChatWindow({ user, onClose, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // Fetch previous messages
    axios
      .get(`/api/messages/${currentUserId}/${user._id}`)
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
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-4 flex flex-col">
      {/* Header, message list, input as before */}
    </div>
  );
}
