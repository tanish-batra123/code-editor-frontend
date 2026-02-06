import { io } from "socket.io-client";

export const initSocket = () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    withCredentials: true,
  };

  return io("https://code-editor-backend-2-weqd.onrender.com", options);
};
