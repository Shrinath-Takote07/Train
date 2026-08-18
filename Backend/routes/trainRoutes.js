// import express from "express";
// import { getTrains, getTrainById } from "../controllers/trainController.js";

// const router = express.Router();

// router.get("/trains", getTrains);
// router.get("/trains/:id", getTrainById);

// export default router;



import express from "express";

import {
  getTrains,
  getTrainById,
} from "../controllers/trainController.js";

const router = express.Router();

// GET /api/trains
router.get("/trains", getTrains);

// GET /api/trains/:id
router.get("/trains/:id", getTrainById);

export default router;
