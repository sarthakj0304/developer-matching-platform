// SocketManager.jsx
import { useEffect } from "react";
import io from "socket.io-client";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const SocketManager = () => {
  useEffect(() => {
    const socket = io(`${serverUrl}`);
    console.log("Socket connected", socket.id);

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return null; // This component doesn’t render anything
};

export default SocketManager;
