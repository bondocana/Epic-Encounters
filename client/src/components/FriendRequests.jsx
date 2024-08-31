import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import locationIcon from "./styles/icons/location-icon.png";
import "./styles/friendRequests.css";
import { Button } from "@mui/material";

function FriendRequests() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

  const getUsersFriends = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friend-requests`,
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

  // DECLINE FRIEND REQUEST
  const declineFriendRequest = async (userId2) => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/decline-friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // If using JWT authentication
          },
          body: JSON.stringify({ userId1: userId2, userId2: userId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        getUsersFriends();
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // ACCEPT FRIEND REQUEST
  const acceptFriendRequest = async (userId2) => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/accept-friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // If using JWT authentication
          },
          body: JSON.stringify({ userId1: userId2, userId2: userId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        getUsersFriends();
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="friends-requests-container">
      {friends.length > 0 ? (
        friends.map((item) => (
          <div className="friend-requests-container">
            <div
              className="picture4"
              style={{
                backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
              }}
              onClick={() => navigate(`/profile/${item._id}`)}
            ></div>
            <div
              className="bottom-section2"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              <span> {item.firstName + " " + item.lastName} </span>

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Button
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    color: "#ffbdc7",
                    marginTop: "4px",
                  }}
                  onClick={() => acceptFriendRequest(item._id)}
                >
                  Accept
                </Button>
                <Button
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    color: "#ffbdc7",
                    marginTop: "4px",
                  }}
                  onClick={() => declineFriendRequest(item._id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="message4">No friend requests found</div>
      )}
    </div>
  );
}

export default FriendRequests;
