import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// the register route is in the index.js file
// because it requires image upload
router.post("/login", login);

export default router;
