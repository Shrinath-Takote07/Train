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

// =====================================================
// CORS CONFIGURATION
// =====================================================

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://train-iah8.vercel.app";

// =====================================================
// HTTP SERVER
// =====================================================

const server = createServer(app);

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Train Backend API is running",
    status: "OK",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// SOCKET.IO CONNECTION
// =====================================================

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Subscribe to train
  socket.on("subscribeTrain", (trainId) => {
    socket.join(`train-${trainId}`);

    console.log(
      `📡 Client subscribed to train ${trainId}`
    );
  });

  // Unsubscribe from train
  socket.on("unsubscribeTrain", (trainId) => {
    socket.leave(`train-${trainId}`);

    console.log(
      `📡 Client unsubscribed from train ${trainId}`
    );
  });

  // Subscribe to PNR
  socket.on("subscribePNR", (pnrNumber) => {
    socket.join(`pnr-${pnrNumber}`);

    console.log(
      `📡 Client subscribed to PNR ${pnrNumber}`
    );
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(
      "🔌 Client disconnected:",
      socket.id
    );
  });
});

// =====================================================
// REAL-TIME TRAIN UPDATES
// =====================================================

let updateInterval = null;

const startRealTimeUpdates = () => {
  updateInterval = setInterval(async () => {
    try {
      const trains = getTrainsData();

      if (trains.length > 0) {
        const randomTrain =
          trains[Math.floor(Math.random() * trains.length)];

        await updateTrainStatus(
          randomTrain.trainId,
          io
        );
      }
    } catch (error) {
      console.error(
        "❌ Error in real-time update:",
        error
      );
    }
  }, 3000);
};

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    console.log(
      "✅ Starting JSON-based datastore initialization..."
    );

    // Seed trains
    await seedTrains();

    // Start real-time updates
    startRealTimeUpdates();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );

      console.log(
        `📡 WebSocket server ready for connections`
      );

      console.log(
        `🌐 Frontend allowed: ${FRONTEND_URL}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error
    );

    process.exit(1);
  }
};

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

const shutdown = () => {
  console.log("🛑 Shutting down server...");

  if (updateInterval) {
    clearInterval(updateInterval);
  }

  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// =====================================================
// START
// =====================================================

startServer();
