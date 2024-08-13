import express from "express";
import {
  getPost,
  getUserCountyPosts,
  getPostsByDate,
  getPostsByCategoryAndDate,
  deletePost,
  updatePost,
  getUsersPosts,
  getAttendingUsers
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// READ
// get a post

router.get("/date", verifyToken, getPostsByDate);
router.get("/:id", verifyToken, getPost);
router.get("/:userId/county", verifyToken, getUserCountyPosts);
router.get("/user/:userId", verifyToken, getUsersPosts);
router.get("/category/:categoryid", verifyToken, getPostsByCategoryAndDate);
router.delete("/:id", verifyToken, deletePost);
router.get("/attending/:postId", verifyToken, getAttendingUsers);

//router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id", verifyToken, updatePost);

export default router;
