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

// Dynamic CORS configuration allowing credentials and headers
const allowedOrigins = [
  "https://train-iah8.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, origin);
    }
    // Fallback: reflect origin to satisfy credentials requirement
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-access-token"
  ],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
