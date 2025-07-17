// SocketManager.jsx
import { useEffect } from "react";
import io from "socket.io-client";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import { useDispatch, useSelector } from "react-redux";
const SocketManager = () => {
  const user = useSelector((store) => store.user);
  useEffect(() => {
    if (!user) return;
    const socket = io(`${serverUrl}`, {
      auth: {
        userId: user._id, // 👈 send userId when connecting
      },
    });
    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return null; // This component doesn’t render anything
};

export default SocketManager;
