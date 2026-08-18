import express from "express";
import {
  getPNRStatus,
  getMultiplePNRStatus,
  updatePNRStatus,
} from "../controllers/pnrController.js";

const router = express.Router();

router.get("/pnr/:pnrNumber", getPNRStatus);
router.post("/pnr/bulk", getMultiplePNRStatus);
router.put("/pnr/:pnrNumber", updatePNRStatus);

export default router;
