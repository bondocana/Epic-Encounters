import express from "express";
import { login, updatePassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// the register route is in the index.js file
// because it requires image upload
router.post("/login", login);
router.patch("/update-password", verifyToken, updatePassword);

export default router;
