// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import toast from "react-hot-toast";

// const SocketContext = createContext();

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const newSocket = io("https://train-l0t7egb0j-shrinath-takote07s-projects.vercel.app", {
//       transports: ["websocket"],
//       autoConnect: true,
//     });

//     newSocket.on("connect", () => {
//       setIsConnected(true);
//       console.log("Socket connected");
//       toast.success("Connected to real-time updates");
//     });

//     newSocket.on("disconnect", () => {
//       setIsConnected(false);
//       console.log("Socket disconnected");
//       toast.error("Disconnected from real-time updates");
//     });

//     newSocket.on("trainUpdate", (data) => {
//       console.log("Train update received:", data);
//       toast(
//         `🚆 ${data.trainName}: ${data.newStatus} ${data.delay > 0 ? `(Delayed by ${data.delay} mins)` : ""}`,
//         {
//           icon:
//             data.newStatus === "Running"
//               ? "🚂"
//               : data.newStatus === "Delayed"
//                 ? "⏰"
//                 : "📍",
//           duration: 5000,
//         },
//       );
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   const subscribeToTrain = (trainId) => {
//     if (socket && isConnected) {
//       socket.emit("subscribeTrain", trainId);
//     }
//   };

//   const unsubscribeFromTrain = (trainId) => {
//     if (socket && isConnected) {
//       socket.emit("unsubscribeTrain", trainId);
//     }
//   };

//   const subscribeToPNR = (pnrNumber) => {
//     if (socket && isConnected) {
//       socket.emit("subscribePNR", pnrNumber);
//     }
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         isConnected,
//         subscribeToTrain,
//         unsubscribeFromTrain,
//         subscribeToPNR,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

const BACKEND_URL =
  "https://train-git-main-shrinath-takote07s-projects.vercel.app";

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used within a SocketProvider"
    );
  }

  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);

      toast.success("Connected to real-time updates");
    });

    newSocket.on("connect_error", (error) => {
      console.error(
        "❌ Socket connection error:",
        error.message
      );

      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log(
        "🔌 Socket disconnected:",
        reason
      );

      setIsConnected(false);
    });

    newSocket.on("trainUpdate", (data) => {
      console.log(
        "🚆 Train update received:",
        data
      );

      toast(
        `🚆 ${data.trainName}: ${data.newStatus}${
          data.delay > 0
            ? ` (Delayed by ${data.delay} mins)`
            : ""
        }`,
        {
          icon:
            data.newStatus === "Running"
              ? "🚂"
              : data.newStatus === "Delayed"
              ? "⏰"
              : "📍",

          duration: 5000,
        }
      );
    });

    setSocket(newSocket);

    return () => {
      console.log("🧹 Closing Socket.IO connection");

      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, []);

  const subscribeToTrain = (trainId) => {
    if (!socket || !isConnected) {
      console.warn(
        "⚠️ Cannot subscribe: socket not connected"
      );
      return;
    }

    console.log(
      `📡 Subscribing to train: ${trainId}`
    );

    socket.emit("subscribeTrain", String(trainId));
  };

  const unsubscribeFromTrain = (trainId) => {
    if (!socket || !isConnected) {
      return;
    }

    socket.emit(
      "unsubscribeTrain",
      String(trainId)
    );
  };

  const subscribeToPNR = (pnrNumber) => {
    if (!socket || !isConnected) {
      console.warn(
        "⚠️ Cannot subscribe to PNR: socket not connected"
      );
      return;
    }

    socket.emit(
      "subscribePNR",
      String(pnrNumber)
    );
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        subscribeToTrain,
        unsubscribeFromTrain,
        subscribeToPNR,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
