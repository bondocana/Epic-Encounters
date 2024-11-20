import React, { useState, useEffect, useCallback } from "react";
import "./styles/firendsList.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FriendsList() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const [isOwner, setIsOwner] = useState();

  useEffect(() => {
    if (userId && userId2) {
      setIsOwner(userId === userId2);
    }
  }, [userId, userId2]);

  const toastSuccess = (message) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });

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
      toastSuccess("Friend removed successfully");
      getUsersFriends();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <>
      <ToastContainer />
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

                {isOwner && (
                  <Button
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      color: "#ffbdc7",
                      marginTop: "4px",
                    }}
                    onClick={() => unfollowUser(item._id)}
                  >
                    Remove friend
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="message3">This user's friend list is empty</div>
        )}
      </div>
    </>
  );
}
