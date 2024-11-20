import express from "express";
import {
  getAllCategories,
  addCategory,
  getCategoriesWithoutEvents,
  deleteCategory,
} from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAllCategories);
router.post("/new", verifyToken, addCategory);
router.get(
  "/categories-without-events",
  verifyToken,
  getCategoriesWithoutEvents
);
router.delete("/category/:categoryId", verifyToken, deleteCategory);

export default router;
