import { io } from "socket.io-client";

export const initSocket = () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    withCredentials: true,
  };

  return io("http://localhost:3000", options);
};
