import express from "express";
import {
  getAllCategories,
  addCategory,
} from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAllCategories);
router.post("/new", verifyToken, addCategory);

export default router;
