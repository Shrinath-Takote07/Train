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
import { seedTrains, updateTrainStatus } from "./controllers/trainController.js";
import { getTrainsData } from "./dataStore.js";

dotenv.config();

const app = express();
const server = createServer(app);

// =====================================================
// CORS CONFIGURATION
// =====================================================
const FRONTEND_URL = process.env.FRONTEND_URL || "https://train-lilac-three.vercel.app";

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =====================================================
// SOCKET.IO CONFIGURATION
// =====================================================
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================
app.use("/api", trainRoutes);
app.use("/api", pnrRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// =====================================================
// SOCKET.IO CONNECTION
// =====================================================
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

// =====================================================
// REAL-TIME UPDATES
// =====================================================
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
      console.error("❌ Error in real-time update:", error);
    }
  }, 3000);
};

// =====================================================
// START SERVER
// =====================================================
const startServer = async () => {
  try {
    await seedTrains();
    startRealTimeUpdates();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend allowed: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
process.on("SIGINT", () => {
  clearInterval(updateInterval);
  console.log("🛑 Shutting down gracefully...");
  process.exit(0);
});
