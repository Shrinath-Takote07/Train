// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { Train, Clock, MapPin } from "lucide-react";

// const socket = io("https://train-l0t7egb0j-shrinath-takote07s-projects.vercel.app/");

// export default function Dashboard() {
//   const [trainId, setTrainId] = useState("12626");
//   const [liveData, setLiveData] = useState({
//     currentStation: "Origin Station",
//     nextStation: "Calculating...",
//     progress: 0,
//     delay: 0,
//     platform: 1,
//   });

//   useEffect(() => {
//     socket.emit("track-train", trainId);

//     socket.on("live-update", (data) => {
//       if (data.trainId === trainId) {
//         setLiveData(data);
//       }
//     });

//     return () => {
//       socket.off("live-update");
//     };
//   }, [trainId]);

//   return (
//     <div
//       style={{
//         padding: "24px",
//         fontFamily: "sans-serif",
//         backgroundColor: "#f3f4f6",
//         minHeight: "100vh",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "600px",
//           margin: "0 auto",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           padding: "24px",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         }}
//       >
//         {/* Header Setup */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             marginBottom: "20px",
//           }}
//         >
//           <Train size={32} color="#2563eb" />
//           <div>
//             <h2 style={{ margin: 0 }}>Railoo Live System</h2>
//             <p style={{ margin: 0, color: "#6b7280" }}>
//               Tracking Train ID: <strong>{trainId}</strong>
//             </p>
//           </div>
//         </div>

//         {/* Dynamic Metric Grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "24px",
//           }}
//         >
//           <div
//             style={{
//               padding: "12px",
//               backgroundColor: "#eff6ff",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 color: "#1e40af",
//               }}
//             >
//               <MapPin size={18} /> <span>Current Stop</span>
//             </div>
//             <p style={{ margin: "8px 0 0 0", fontWeight: "bold" }}>
//               {liveData.currentStation}
//             </p>
//           </div>

//           <div
//             style={{
//               padding: "12px",
//               backgroundColor: liveData.delay > 0 ? "#fef2f2" : "#f0fdf4",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 color: liveData.delay > 0 ? "#991b1b" : "#166534",
//               }}
//             >
//               <Clock size={18} /> <span>Delay Status</span>
//             </div>
//             <p style={{ margin: "8px 0 0 0", fontWeight: "bold" }}>
//               {liveData.delay === 0 ? "On Time" : `${liveData.delay} Mins Late`}
//             </p>
//           </div>
//         </div>

//         {/* Live Tracking Progress Bar Component */}
//         <div style={{ marginBottom: "20px" }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "8px",
//               fontSize: "14px",
//               color: "#4b5563",
//             }}
//           >
//             <span>Progress Indicator</span>
//             <span>
//               Platform: <strong>{liveData.platform}</strong>
//             </span>
//           </div>
//           <div
//             style={{
//               width: "100%",
//               height: "12px",
//               backgroundColor: "#e5e7eb",
//               borderRadius: "6px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 width: `${liveData.progress}%`,
//                 height: "100%",
//                 backgroundColor: "#2563eb",
//                 transition: "width 1s ease-in-out",
//               }}
//             />
//           </div>
//           <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
//             Approaching: {liveData.nextStation}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Train, Clock, MapPin } from "lucide-react";

// =====================================================
// YOUR DEPLOYED BACKEND URL
// =====================================================
const BACKEND_URL =
  "https://train-l0t7egb0j-shrinath-takote07s-projects.vercel.app";

// =====================================================
// SOCKET.IO CONNECTION
// =====================================================
const socket = io(BACKEND_URL, {
  transports: ["polling", "websocket"],
  autoConnect: true,
});

export default function Dashboard() {
  const [trainId, setTrainId] = useState("12626");

  const [connected, setConnected] = useState(false);

  const [liveData, setLiveData] = useState({
    currentStation: "Origin Station",
    nextStation: "Calculating...",
    progress: 0,
    delay: 0,
    platform: 1,
  });

  useEffect(() => {
    // ================================================
    // SOCKET CONNECT
    // ================================================
    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      setConnected(true);

      socket.emit("subscribeTrain", trainId);
    };

    // ================================================
    // SOCKET DISCONNECT
    // ================================================
    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    };

    // ================================================
    // LIVE TRAIN UPDATE
    // ================================================
    const handleLiveUpdate = (data) => {
      console.log("🚆 Live update received:", data);

      if (String(data.trainId) === String(trainId)) {
        setLiveData((previousData) => ({
          ...previousData,
          ...data,
        }));
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("live-update", handleLiveUpdate);

    // If socket is already connected
    if (socket.connected) {
      socket.emit("subscribeTrain", trainId);
      setConnected(true);
    }

    // ================================================
    // CLEANUP
    // ================================================
    return () => {
      socket.emit("unsubscribeTrain", trainId);

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("live-update", handleLiveUpdate);
    };
  }, [trainId]);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {/* ==========================================
            HEADER
        =========================================== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <Train size={32} color="#2563eb" />

          <div>
            <h2 style={{ margin: 0 }}>
              Railoo Live System
            </h2>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              Tracking Train ID:{" "}
              <strong>{trainId}</strong>
            </p>
          </div>
        </div>

        {/* ==========================================
            CONNECTION STATUS
        =========================================== */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: connected
              ? "#f0fdf4"
              : "#fef2f2",
            color: connected
              ? "#166534"
              : "#991b1b",
            fontWeight: "bold",
          }}
        >
          {connected
            ? "🟢 Live connection connected"
            : "🔴 Live connection disconnected"}
        </div>

        {/* ==========================================
            TRAIN ID
        =========================================== */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Train ID
          </label>

          <input
            type="text"
            value={trainId}
            onChange={(e) =>
              setTrainId(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ==========================================
            METRICS
        =========================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* CURRENT STATION */}
          <div
            style={{
              padding: "12px",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#1e40af",
              }}
            >
              <MapPin size={18} />

              <span>Current Stop</span>
            </div>

            <p
              style={{
                margin: "8px 0 0 0",
                fontWeight: "bold",
              }}
            >
              {liveData.currentStation}
            </p>
          </div>

          {/* DELAY */}
          <div
            style={{
              padding: "12px",
              backgroundColor:
                Number(liveData.delay) > 0
                  ? "#fef2f2"
                  : "#f0fdf4",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color:
                  Number(liveData.delay) > 0
                    ? "#991b1b"
                    : "#166534",
              }}
            >
              <Clock size={18} />

              <span>Delay Status</span>
            </div>

            <p
              style={{
                margin: "8px 0 0 0",
                fontWeight: "bold",
              }}
            >
              {Number(liveData.delay) === 0
                ? "On Time"
                : `${liveData.delay} Mins Late`}
            </p>
          </div>
        </div>

        {/* ==========================================
            PROGRESS
        =========================================== */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            <span>Progress Indicator</span>

            <span>
              Platform:{" "}
              <strong>{liveData.platform}</strong>
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "12px",
              backgroundColor: "#e5e7eb",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    Number(liveData.progress) || 0
                  )
                )}%`,
                height: "100%",
                backgroundColor: "#2563eb",
                transition: "width 1s ease-in-out",
              }}
            />
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginTop: "6px",
            }}
          >
            Approaching:{" "}
            {liveData.nextStation}
          </p>
        </div>
      </div>
    </div>
  );
}
