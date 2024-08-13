// routes/localityRoutes.js

import express from "express";
import { getLocalitiesByCounty } from "../controllers/localityController.js";

const router = express.Router();

router.post("/localities", getLocalitiesByCounty);

export default router;
