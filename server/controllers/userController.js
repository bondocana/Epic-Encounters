import User from "../models/User.js";
import County from "../models/County.js";
import Locality from "../models/Locality.js";

/* GET A USER */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Găsește utilizatorul după ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Găsește județul după atributul countyid din user
    const county = await County.findOne({ idCounty: user.county });

    // Găsește localitatea după atributul localityid din user
    const locality = await Locality.findOne({ idLocality: user.locality });

    // Creează un obiect cu datele utilizatorului, incluzând numele județului și localității
    const userResponse = {
      ...user._doc,
      county: county ? county.name : null, // returnează numele sau null dacă nu este găsit
      locality: locality ? locality.name : null, // returnează numele sau null dacă nu este găsit
    };

    // Trimite răspunsul
    res.status(200).json(userResponse);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find both users by their IDs
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    // If either user is not found, return a 404 error
    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if userId1 is already in user2's friends or friendRequests
    const isUserId1InUser2Friends = user2.friends.includes(userId1);
    const isUserId1InUser2FriendRequests =
      user2.friendRequests.includes(userId1);

    // Check if userId2 is already in user1's friends or friendRequests
    const isUserId2InUser1Friends = user1.friends.includes(userId2);
    const isUserId2InUser1FriendRequests =
      user1.friendRequests.includes(userId2);

    // If either user is already friends with the other or a friend request has already been sent, return a 400 error
    if (
      isUserId1InUser2Friends ||
      isUserId1InUser2FriendRequests ||
      isUserId2InUser1Friends ||
      isUserId2InUser1FriendRequests
    ) {
      return res.status(400).json({
        message: "Friend request already sent or users are already friends",
      });
    }

    // Add userId1 to user2's friendRequests array
    user2.friendRequests.push(userId1);

    // Save the updated user2 document
    await user2.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// DECLINE FRIEND REQUEST
export const declineFriendRequest = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find both users by their IDs
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    // If either user is not found, return a 404 error
    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if userId1 is in user2's friendRequests array
    const isUserId1InUser2FriendRequests =
      user2.friendRequests.includes(userId1);

    if (!isUserId1InUser2FriendRequests) {
      return res
        .status(400)
        .json({ message: "No friend request found from this user" });
    }

    // Remove userId1 from user2's friendRequests array
    user2.friendRequests = user2.friendRequests.filter(
      (id) => id.toString() !== userId1.toString()
    );

    // Save the updated user2 document
    await user2.save();

    return res
      .status(200)
      .json({ message: "Friend request declined successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find both users by their IDs
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    // If either user is not found, return a 404 error
    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if userId1 is in user2's friendRequests
    const index = user2.friendRequests.indexOf(userId1);
    if (index === -1) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    // Remove userId1 from user2's friendRequests array
    user2.friendRequests.splice(index, 1);

    // Add userId1 to user2's friends array
    user2.friends.push(userId1);

    // Add userId2 to user1's friends array
    user1.friends.push(userId2);

    // Save the updated user documents
    await user1.save();
    await user2.save();

    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// CHECK IF TWO USERS ARE FRIENDS
export const areUsersFriends = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find both users by their IDs
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    // If either user is not found, return a 404 error
    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if userId1 is in user2's friends array and if userId2 is in user1's friends array
    const isUser1InUser2Friends = user2.friends.includes(userId1);
    const isUser2InUser1Friends = user1.friends.includes(userId2);

    // If both are true, the users are friends
    if (isUser1InUser2Friends && isUser2InUser1Friends) {
      return res.status(200).json({ areFriends: true });
    } else {
      return res.status(200).json({ areFriends: false });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET USERS FRIENDS
export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all users whose IDs are in the user's friends array
    const friends = await User.find({ _id: { $in: user.friends } });

    const friendsWithDetails = await Promise.all(
      friends.map(async (friend) => {
        const county = await County.findOne({ idCounty: friend.county });
        const locality = await Locality.findOne({
          idLocality: friend.locality,
        });

        return {
          ...friend._doc, // Spread the friend object properties
          county: county ? county.name : null, // Get county name or null if not found
          locality: locality ? locality.name : null, // Get locality name or null if not found
        };
      })
    );

    return res.status(200).json(friendsWithDetails);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UNFOLLOW USER (REMOVE FRIENDSHIP)
export const unfollowUser = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find both users by their IDs
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    // If either user is not found, return a 404 error
    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if they are friends
    const areFriends =
      user1.friends.includes(userId2) && user2.friends.includes(userId1);

    if (!areFriends) {
      return res.status(400).json({ message: "Users are not friends" });
    }

    // Remove userId2 from user1's friends array
    user1.friends = user1.friends.filter(
      (friendId) => friendId.toString() !== userId2
    );

    // Remove userId1 from user2's friends array
    user2.friends = user2.friends.filter(
      (friendId) => friendId.toString() !== userId1
    );

    // Save the updated user documents
    await user1.save();
    await user2.save();

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// CHECK IF FRIEND REQUEST WAS ALREADY SENT
export const checkFriendRequest = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Find the second user by their ID
    const user2 = await User.findById(userId2);

    // If the user is not found, return a 404 error
    if (!user2) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if userId1 is already in user2's friendRequests array
    const hasSentRequest = user2.friendRequests.includes(userId1);

    if (hasSentRequest) {
      return res.status(200).json({ hasSentRequest: true });
    } else {
      return res.status(200).json({ hasSentRequest: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "error", error: err.message });
  }
};

// GET USERS FRIENDS REQUESTS
export const getUserFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all users whose IDs are in the user's friends array
    const friends = await User.find({ _id: { $in: user.friendRequests } });

    // Create an array to hold friends with their county and locality names
    const friendsWithDetails = await Promise.all(
      friends.map(async (friend) => {
        const county = await County.findOne({ idCounty: friend.county });
        const locality = await Locality.findOne({
          idLocality: friend.locality,
        });

        return {
          ...friend._doc, // Spread the friend object properties
          county: county ? county.name : null, // Get county name or null if not found
          locality: locality ? locality.name : null, // Get locality name or null if not found
        };
      })
    );

    return res.status(200).json(friendsWithDetails);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// get all non admins users
export const getNonAdminUsers = async (req, res) => {
  try {
    // Find all users where isAdmin is false
    const nonAdminUsers = await User.find({ isAdmin: false });

    if (!nonAdminUsers.length) {
      return res.status(404).json({ message: "No non-admin users found." });
    }

    res.status(200).json(nonAdminUsers);
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    res.status(500).json({
      message: "Error fetching non-admin users",
      error: error.message,
    });
  }
};

// make user admin
export const makeUserAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and update isAdmin to true
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isAdmin: true } },
      { new: true } // This option returns the document after update was applied
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User has been made an admin.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error making user an admin:", error);
    res.status(500).json({
      message: "Error updating user to admin",
      error: error.message,
    });
  }
};

export const checkUserRelationships = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Check if they are friends
    const areFriends =
      user1.friends.includes(userId2) && user2.friends.includes(userId1);

    // Check if a friend request has been sent by user1 to user2
    const sentFriendRequest = user2.friendRequests.includes(userId1);

    // Check if a friend request has been received by user1 from user2
    const receivedFriendRequest = user1.friendRequests.includes(userId2);

    return res.status(200).json({
      areFriends: areFriends,
      sentFriendRequest: sentFriendRequest,
      receivedFriendRequest: receivedFriendRequest,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
