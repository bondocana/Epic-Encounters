import React, { useState, useEffect, useCallback } from "react";
import "./styles/firendsList.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

export default function FriendsList() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  const getUsersFriends = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [token, userId]);

  useEffect(() => {
    getUsersFriends();
  }, [getUsersFriends]);

  // UNFOLLOW USER
  const unfollowUser = async (userIdToUnfollow) => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/unfollow-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your JWT token here if necessary
          },
          body: JSON.stringify({
            userId1: userId,
            userId2: userIdToUnfollow,
          }),
        }
      );

      const data = await response.json();
      getUsersFriends();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="friends-container">
      {friends.length > 0 ? (
        friends.map((item) => (
          <div className="friend-container">
            <div
              className="picture3"
              style={{
                backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
              }}
              onClick={() => navigate(`/profile/${item._id}`)}
            ></div>
            <div
              className="bottom-section"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              <span> {item.firstName + " " + item.lastName} </span>

              <Button
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#ffbdc7",
                  marginTop: "4px",
                }}
                onClick={() => unfollowUser(item._id)}
              >
                Unfollow
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="message3">This user's friend list is empty</div>
      )}
    </div>
  );
}
