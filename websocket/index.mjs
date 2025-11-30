// ~/Desktop/blyz-server/websocket/index.mjs
import { WebSocketServer } from "ws";

/*
=========================================================
   🛰️ BLYZ REAL-TIME WEBSOCKET ENGINE — FINAL 2025 BUILD
=========================================================
Handles:
  ✔ Live operator GPS tracking
  ✔ Breadcrumb trail history
  ✔ Status updates (online / busy / offline)
  ✔ Admin dashboard live map updates
  ✔ Heading + accuracy + timestamp
=========================================================
*/

let wss = null;

// Store connected clients (admins + operators)
const clients = new Set();

// In-memory live operator registry
// operatorId → { name, lat, lng, status, trail: [ {lat, lng} ], updatedAt }
const liveOperators = new Map();

/**
 * Initializes the WebSocket server
 */
export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  console.log("🛰️ WebSocket Server Initialized (Live GPS Enabled)");

  wss.on("connection", (ws) => {
    console.log("🔌 Client connected to Blyz WebSocket");

    clients.add(ws);

    // ==============================================
    // Incoming Messages From Clients
    // ==============================================
    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw);

        // ========================================================
        // 1️⃣ OPERATOR → GPS Location Update
        // ========================================================
        if (data.type === "operator_location_update") {
          const {
            operatorId,
            name,
            lat,
            lng,
            status = "online",
            heading = 0,
            accuracy = 10,
          } = data;

          if (!operatorId || typeof lat !== "number" || typeof lng !== "number") {
            console.warn("⚠️ Invalid operator location payload:", data);
            return;
          }

          // -----------------------------
          // Update internal store
          // -----------------------------
          if (!liveOperators.has(operatorId)) {
            liveOperators.set(operatorId, {
              operatorId,
              name,
              status,
              trail: [],
              updatedAt: Date.now(),
            });
          }

          const entry = liveOperators.get(operatorId);

          entry.lat = lat;
          entry.lng = lng;
          entry.status = status;
          entry.heading = heading;
          entry.accuracy = accuracy;
          entry.updatedAt = Date.now();

          // Add breadcrumb point
          entry.trail.push({ lat, lng });
          if (entry.trail.length > 30) {
            entry.trail.shift(); // keep last 30 points
          }

          // -----------------------------
          // Broadcast update to all clients
          // -----------------------------
          broadcast({
            type: "operator_location_update",
            operatorId,
            name,
            lat,
            lng,
            status,
            heading,
            accuracy,
            trail: entry.trail,
            timestamp: Date.now(),
          });
        }

        // ========================================================
        // 2️⃣ Operator status update
        // ========================================================
        if (data.type === "operator_status_update") {
          const { operatorId, status = "online" } = data;

          if (liveOperators.has(operatorId)) {
            const entry = liveOperators.get(operatorId);
            entry.status = status;
          }

          broadcast({
            type: "operator_status_update",
            operatorId,
            status,
            timestamp: Date.now(),
          });
        }

      } catch (err) {
        console.error("❌ WebSocket Message Error:", err);
      }
    });

    // ==============================================
    // DISCONNECT
    // ==============================================
    ws.on("close", () => {
      clients.delete(ws);
      console.log("🔌 Client disconnected from WebSocket");
    });
  });

  // Cleanup stale operators every minute
  setInterval(cleanupStaleOperators, 60_000);
}

/**
 * Broadcast JSON payload to all clients
 */
function broadcast(payload) {
  const msg = JSON.stringify(payload);

  for (const socket of clients) {
    try {
      socket.send(msg);
    } catch (err) {
      console.error("❌ WS Broadcast Error:", err);
    }
  }
}

/**
 * Remove operators who haven’t updated recently
 */
function cleanupStaleOperators() {
  const now = Date.now();

  for (const [id, entry] of liveOperators.entries()) {
    if (now - entry.updatedAt > 1000 * 60 * 5) {
      // More than 5 minutes old → stale
      console.log(`⚠️ Removing stale operator from live map: ${id}`);
      liveOperators.delete(id);

      // Notify dashboards
      broadcast({
        type: "operator_offline",
        operatorId: id,
      });
    }
  }
}

/**
 * Get last known state for operator
 */
export function getLastKnownOperator(operatorId) {
  return liveOperators.get(operatorId) || null;
}
