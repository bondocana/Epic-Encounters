import express from "express";
import { getAllCounties } from "../controllers/countyController.js";

const router = express.Router();

router.get("/counties", getAllCounties);

export default router;
