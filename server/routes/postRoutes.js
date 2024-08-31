import express from "express";
import {
  getPost,
  getUserCountyPosts,
  getPostsByDate,
  getPostsByCategoryAndDate,
  deletePost,
  updatePost,
  getUsersPosts,
  getAttendingUsers,
  checkUserAttendance,
  addUserToAttending,
  removeUserFromAttending,
  getUnapprovedPosts,
  getPostsUserAttending,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// READ
// get a post

router.get("/date", verifyToken, getPostsByDate);
router.post("/check-user-attendance", verifyToken, checkUserAttendance);
router.post("/add-to-attending", verifyToken, addUserToAttending);
router.post("/remove-from-attending", verifyToken, removeUserFromAttending);
router.get("/unapproved", verifyToken, getUnapprovedPosts);

router.get("/:id", verifyToken, getPost);
router.get("/:userId/county", verifyToken, getUserCountyPosts);
router.get("/:userId/user-attending", getPostsUserAttending);
router.get("/user/:userId", verifyToken, getUsersPosts);
router.get("/category/:categoryid", verifyToken, getPostsByCategoryAndDate);
router.delete("/:id", verifyToken, deletePost);
router.get("/attending/:postId", verifyToken, getAttendingUsers);

//router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id", verifyToken, updatePost);

export default router;
