import { getTrainsData, saveTrainsData } from "../dataStore.js";
import { generateMockTrains, generateLiveUpdate } from "../utils/mockData.js";

// Seed initial train data
export const seedTrains = async () => {
  try {
    const trains = getTrainsData();
    if (trains.length === 0) {
      const mockTrains = generateMockTrains();
      saveTrainsData(mockTrains);
      console.log("✅ Seeded mock train data");
    }
  } catch (error) {
    console.error("Error seeding trains:", error);
  }
};

// Get all trains with filtering and pagination
export const getTrains = async (req, res) => {
  try {
    const { status, source, destination, page = 1, limit = 50 } = req.query;
    let trains = getTrainsData();

    if (status && status !== "all") {
      trains = trains.filter(t => t.status === status);
    }
    if (source || destination) {
      trains = trains.filter(t => {
        const route = [
          t.source.toLowerCase(),
          ...(t.stops || []).map(s => s.stationName.toLowerCase()),
          t.destination.toLowerCase()
        ];
        
        let match = true;
        let sourceIndex = -1;
        let destIndex = -1;

        if (source) {
          sourceIndex = route.indexOf(source.toLowerCase());
          if (sourceIndex === -1) match = false;
        }

        if (destination) {
          destIndex = route.indexOf(destination.toLowerCase());
          if (destIndex === -1) match = false;
        }

        // If both provided, ensure source comes before destination
        if (source && destination && sourceIndex > -1 && destIndex > -1) {
          if (sourceIndex >= destIndex) match = false;
        }

        return match;
      });
    }
    
    // Sort by lastUpdated (descending)
    trains.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    const total = trains.length;
    const startIndex = (page - 1) * limit;
    const paginatedTrains = trains.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: paginatedTrains,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get train by ID
export const getTrainById = async (req, res) => {
  try {
    const trains = getTrainsData();
    const train = trains.find(t => t.trainId === req.params.id);
    
    if (!train) {
      return res
        .status(404)
        .json({ success: false, message: "Train not found" });
    }
    res.json({ success: true, data: train });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update train status (for real-time updates)
export const updateTrainStatus = async (trainId, io) => {
  try {
    const trains = getTrainsData();
    const trainIndex = trains.findIndex(t => t.trainId === trainId);
    
    if (trainIndex === -1) return;

    const train = trains[trainIndex];
    const update = generateLiveUpdate(train);
    
    train.status = update.newStatus;
    train.delay = update.delay;
    train.currentStation = update.currentStation;
    train.nextStation = update.nextStation;
    train.progress = update.progress;
    train.speed = update.speed;
    train.platform = update.platform;
    train.lastUpdated = new Date().toISOString();

    trains[trainIndex] = train;
    saveTrainsData(trains);

    // Emit real-time update via WebSocket
    io.emit("trainUpdate", {
      trainId: train.trainId,
      ...update,
      train: train,
    });

    return update;
  } catch (error) {
    console.error("Error updating train status:", error);
  }
};
