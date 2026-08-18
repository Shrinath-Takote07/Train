import { getPnrsData, savePnrsData, getTrainsData } from "../dataStore.js";
import { generateMockPNR } from "../utils/mockData.js";

// Get PNR status
export const getPNRStatus = async (req, res) => {
  try {
    const { pnrNumber } = req.params;
    const pnrs = getPnrsData();

    // Check JSON store first
    let pnr = pnrs.find(p => p.pnrNumber === pnrNumber);

    if (!pnr) {
      // Generate mock PNR data
      const trains = getTrainsData();
      const randomTrain = trains[Math.floor(Math.random() * trains.length)] || {};
      
      pnr = generateMockPNR(pnrNumber);
      pnr.trainNumber = randomTrain.number || pnr.trainNumber;
      pnr.trainName = randomTrain.trainName || pnr.trainName;
      pnr.trainId = randomTrain.trainId;
      
      pnrs.push(pnr);
      savePnrsData(pnrs);
    }

    const trains = getTrainsData();
    const liveTrain = trains.find(t => t.trainId === pnr.trainId || t.number === pnr.trainNumber);

    res.json({ success: true, data: { ...pnr, trainDetails: liveTrain } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Bulk PNR status check
export const getMultiplePNRStatus = async (req, res) => {
  try {
    const { pnrNumbers } = req.body;

    if (!Array.isArray(pnrNumbers) || pnrNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of PNR numbers",
      });
    }

    const pnrs = getPnrsData();
    let hasChanges = false;

    const pnrStatuses = await Promise.all(
      pnrNumbers.map(async (pnrNumber) => {
        let pnr = pnrs.find(p => p.pnrNumber === pnrNumber);
        if (!pnr) {
          pnr = generateMockPNR(pnrNumber);
          pnrs.push(pnr);
          hasChanges = true;
        }
        return pnr;
      }),
    );

    if (hasChanges) {
      savePnrsData(pnrs);
    }

    res.json({ success: true, data: pnrStatuses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update PNR status
export const updatePNRStatus = async (req, res) => {
  try {
    const { pnrNumber } = req.params;
    const updateData = req.body;
    const pnrs = getPnrsData();

    const pnrIndex = pnrs.findIndex(p => p.pnrNumber === pnrNumber);

    if (pnrIndex === -1) {
      return res.status(404).json({ success: false, message: "PNR not found" });
    }

    const pnr = {
      ...pnrs[pnrIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    pnrs[pnrIndex] = pnr;
    savePnrsData(pnrs);

    res.json({ success: true, data: pnr });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
