// websocket/operatorTracking.mjs
// ===========================================================
// Live Operator GPS Tracking (WebSockets)
// ===========================================================

let wsServerInstance = null;

// { operatorId: { name, lat, lng, status, trail: [] } }
const operatorLiveState = {};

export function initOperatorTracking(wss) {
  wsServerInstance = wss;

  wss.on("connection", (socket) => {
    console.log("🛰️ WS Connected");

    socket.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);

        // Only handle GPS updates
        if (data.type === "operator_location_update") {
          const {
            operatorId,
            name,
            lat,
            lng,
            status = "online",
          } = data;

          if (!operatorId) return;

          // Add/update operator state
          if (!operatorLiveState[operatorId]) {
            operatorLiveState[operatorId] = {
              name,
              status,
              trail: [],
            };
          }

          // Push new coordinates
          operatorLiveState[operatorId].lat = lat;
          operatorLiveState[operatorId].lng = lng;
          operatorLiveState[operatorId].status = status;

          // Add breadcrumb trail point
          operatorLiveState[operatorId].trail.push({ lat, lng });
          if (operatorLiveState[operatorId].trail.length > 20) {
            operatorLiveState[operatorId].trail.shift(); // keep last 20 positions
          }

          // Broadcast to ALL ADMIN dashboards
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: "operator_location_update",
                operatorId,
                ...operatorLiveState[operatorId],
              })
            );
          });
        }
      } catch (err) {
        console.error("❌ WS Parse Error", err);
      }
    });
  });
}
