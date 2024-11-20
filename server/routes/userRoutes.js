import express from "express";
import {
  getUser,
  sendFriendRequest,
  getUserFriends,
  getUserFriendRequests,
  declineFriendRequest,
  acceptFriendRequest,
  areUsersFriends,
  unfollowUser,
  checkFriendRequest,
  getNonAdminUsers,
  makeUserAdmin,
  checkUserRelationships,
} from "../controllers/userController.js";

//getUserFriends,
//addRemoveFriend,

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* READ */
router.post("/send-friend-request", verifyToken, sendFriendRequest);
router.post("/decline-friend-request", verifyToken, declineFriendRequest);
router.post("/accept-friend-request", verifyToken, acceptFriendRequest);
router.post("/are-users-friends", verifyToken, areUsersFriends);
router.post("/unfollow-user", verifyToken, unfollowUser);
router.post("/check-friend-request", verifyToken, checkFriendRequest);
router.get("/non-admins", verifyToken, getNonAdminUsers);
router.post("/user-relationships", verifyToken, checkUserRelationships);

router.get("/:id", verifyToken, getUser);
router.get("/:userId/friends", verifyToken, getUserFriends);
router.get("/:userId/friend-requests", verifyToken, getUserFriendRequests);
router.patch("/:userId/make-admin", verifyToken, makeUserAdmin);


/* UPDATE */
//router.patch("/:id/:friendsId", verifyToken, addRemoveFriend);

export default router;
