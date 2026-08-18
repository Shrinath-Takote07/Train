import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
      toast.success("Connected to real-time updates");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
      toast.error("Disconnected from real-time updates");
    });

    newSocket.on("trainUpdate", (data) => {
      console.log("Train update received:", data);
      toast(
        `🚆 ${data.trainName}: ${data.newStatus} ${data.delay > 0 ? `(Delayed by ${data.delay} mins)` : ""}`,
        {
          icon:
            data.newStatus === "Running"
              ? "🚂"
              : data.newStatus === "Delayed"
                ? "⏰"
                : "📍",
          duration: 5000,
        },
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const subscribeToTrain = (trainId) => {
    if (socket && isConnected) {
      socket.emit("subscribeTrain", trainId);
    }
  };

  const unsubscribeFromTrain = (trainId) => {
    if (socket && isConnected) {
      socket.emit("unsubscribeTrain", trainId);
    }
  };

  const subscribeToPNR = (pnrNumber) => {
    if (socket && isConnected) {
      socket.emit("subscribePNR", pnrNumber);
    }
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
