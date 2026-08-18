import express from "express";
import { getTrains, getTrainById } from "../controllers/trainController.js";

const router = express.Router();

router.get("/trains", getTrains);
router.get("/trains/:id", getTrainById);

export default router;
