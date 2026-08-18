import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRAINS_FILE = path.join(__dirname, "data", "trains.json");
const PNRS_FILE = path.join(__dirname, "data", "pnrs.json");

// Utility to read JSON file
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Utility to write JSON file
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

export const getTrainsData = () => readJSON(TRAINS_FILE);
export const saveTrainsData = (data) => writeJSON(TRAINS_FILE, data);

export const getPnrsData = () => readJSON(PNRS_FILE);
export const savePnrsData = (data) => writeJSON(PNRS_FILE, data);
