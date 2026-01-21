import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function SocketTest() {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");

  const addLog = (type, data) => {
    setLogs((prev) => [
      ...prev,
      { type, data, time: new Date().toLocaleTimeString() },
    ]);
  };

  useEffect(() => {
    // Show initial state
    addLog("info", `Socket URL: ${process.env.REACT_APP_SOCKET_URL || "http://localhost:3000"}`);
    addLog("info", `Token: ${localStorage.getItem("token") ? "✓ Found" : "✗ Not found"}`);

    const onConnect = () => {
      setConnected(true);
      setSocketId(socket.id);
      addLog("success", `✓ Connected! ID: ${socket.id}`);
    };

    const onDisconnect = () => {
      setConnected(false);
      addLog("error", "✗ Disconnected");
    };

    const onConnectError = (err) => {
      addLog("error", `✗ Connect Error: ${err?.message || JSON.stringify(err)}`);
    };

    const onReconnect = () => {
      addLog("info", "🔄 Reconnecting...");
    };

    const onMessage = (data) => {
      addLog("message", `📨 Message: ${JSON.stringify(data)}`);
    };

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnecting", onReconnect);
    socket.on("message", onMessage);

    // Try to connect
    if (!socket.connected) {
      addLog("info", "Attempting to connect...");
      socket.connect();
    } else {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnecting", onReconnect);
      socket.off("message", onMessage);
    };
  }, []);

  const sendTestMessage = () => {
    if (!connected) {
      addLog("error", "Not connected!");
      return;
    }
    socket.emit("test", { msg: message || "Hello Socket.IO" }, (ack) => {
      addLog("success", `✓ Ack received: ${JSON.stringify(ack)}`);
    });
    setMessage("");
  };

  const testJoin = () => {
    if (!connected) {
      addLog("error", "Not connected!");
      return;
    }
    socket.emit("join", "test-user-123");
    addLog("info", "Emitted: join(test-user-123)");
  };

  const clearLogs = () => setLogs([]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", maxWidth: "800px" }}>
      <h1>🧪 Socket.IO Test</h1>

      {/* Status */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          backgroundColor: connected ? "#d4edda" : "#f8d7da",
          color: connected ? "#155724" : "#721c24",
          fontWeight: "bold",
        }}
      >
        Status: {connected ? "✓ CONNECTED" : "✗ DISCONNECTED"}
        {socketId && <div>Socket ID: {socketId}</div>}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendTestMessage()}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendTestMessage} style={{ padding: "8px 15px" }}>
          Send Message
        </button>
        <button onClick={testJoin} style={{ padding: "8px 15px" }}>
          Join Room
        </button>
        <button onClick={clearLogs} style={{ padding: "8px 15px" }}>
          Clear Logs
        </button>
      </div>

      {/* Logs */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>📋 Event Logs</h3>
        {logs.length === 0 ? (
          <p style={{ color: "#999" }}>Waiting for events...</p>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              style={{
                padding: "5px",
                marginBottom: "5px",
                backgroundColor:
                  log.type === "success"
                    ? "#d4edda"
                    : log.type === "error"
                    ? "#f8d7da"
                    : "#d1ecf1",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>[{log.time}]</span> {log.data}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
