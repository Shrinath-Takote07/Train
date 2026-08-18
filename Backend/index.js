import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";

import trainRoutes from "./routes/trainRoutes.js";
import pnrRoutes from "./routes/pnrRoutes.js";
import {
  seedTrains,
  updateTrainStatus,
} from "./controllers/trainController.js";
import { getTrainsData } from "./dataStore.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // default vite port
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", trainRoutes);
app.use("/api", pnrRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("subscribeTrain", (trainId) => {
    socket.join(`train-${trainId}`);
    console.log(`📡 Client subscribed to train ${trainId}`);
  });

  socket.on("unsubscribeTrain", (trainId) => {
    socket.leave(`train-${trainId}`);
    console.log(`📡 Client unsubscribed from train ${trainId}`);
  });

  socket.on("subscribePNR", (pnrNumber) => {
    socket.join(`pnr-${pnrNumber}`);
    console.log(`📡 Client subscribed to PNR ${pnrNumber}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Real-time update interval (every 3 seconds)
let updateInterval;

const startRealTimeUpdates = () => {
  updateInterval = setInterval(async () => {
    try {
      const trains = getTrainsData();
      if (trains.length > 0) {
        const randomTrain = trains[Math.floor(Math.random() * trains.length)];
        await updateTrainStatus(randomTrain.trainId, io);
      }
    } catch (error) {
      console.error("Error in real-time update:", error);
    }
  }, 3000);
};

// Initialize server
const startServer = async () => {
  try {
    console.log("✅ Starting JSON-based datastore initialization...");

    // Seed initial data if necessary
    await seedTrains();

    // Start real-time updates
    startRealTimeUpdates();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready for connections`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", () => {
  clearInterval(updateInterval);
  console.log("Shutting down gracefully...");
  process.exit(0);
});
