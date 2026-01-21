import { useEffect, useState } from "react";
import socket from "../services/socket";
import { useSocket } from "../hooks/useSocket";

export default function SocketDebug() {
  const { connected, notifications, clearNotifications } = useSocket();
  const [lastEvent, setLastEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onConnect = () => {
      setLastEvent({ type: "✓ connect", at: new Date().toISOString() });
    };
    const onDisconnect = () => {
      setLastEvent({ type: "✗ disconnect", at: new Date().toISOString() });
    };
    const onConnectError = (err) => {
      const errMsg = err?.message || JSON.stringify(err);
      setError(errMsg);
      setLastEvent({ type: "✗ connect_error", msg: errMsg, at: new Date().toISOString() });
    };
    const onNotification = (payload) => {
      setLastEvent({ type: "📨 notification", payload, at: new Date().toISOString() });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("notification", onNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("notification", onNotification);
    };
  }, []);

  return (
    <div className="mt-6 p-4 rounded-lg bg-secondary shadow">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-dark">🔌 Socket Connection</p>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            connected ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {connected ? "✓ CONNECTED" : "✗ DISCONNECTED"}
        </span>
      </div>

      {/* Error Display */}
      {error && <p className="mb-3 text-red-600 text-sm font-semibold">⚠️ Error: {error}</p>}

      {/* Last Event */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-dark mb-1">Last Event:</p>
        <pre className="bg-primary text-dark p-2 rounded text-xs overflow-auto max-h-20">
          {lastEvent ? JSON.stringify(lastEvent, null, 2) : "Waiting..."}
        </pre>
      </div>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-dark">
            🔔 Notifications ({notifications.length})
          </p>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
          )}
        </div>
        <div className="bg-primary text-dark p-2 rounded text-xs max-h-32 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications yet</p>
          ) : (
            notifications.map((notif, idx) => (
              <div key={idx} className="mb-2 p-2 bg-blue-100 rounded border-l-2 border-blue-500">
                <pre className="text-xs">{JSON.stringify(notif, null, 1)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
