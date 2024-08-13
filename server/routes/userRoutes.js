import express from "express";
import { getUser } from "../controllers/userController.js";

//getUserFriends,
//addRemoveFriend,

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
//router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
//router.patch("/:id/:friendsId", verifyToken, addRemoveFriend);

export default router;
