import { io } from "socket.io-client";

// Server runs on 3000 (see server config). Default to that, allow override via env.
const URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";

const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
});

export default socket;
