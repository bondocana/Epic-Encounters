import express from "express";
import { getLocalitiesByCounty, getCoordinates } from "../controllers/localityController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/localities", getLocalitiesByCounty);
router.post("/get-coordinates", verifyToken, getCoordinates);


export default router;
