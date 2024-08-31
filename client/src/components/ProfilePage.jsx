import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./styles/profilePage.css";
import { Button, colors } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import locationIcon from "./styles/icons/location-icon.png";
import { useNavigate } from "react-router-dom";
import FriendsList from "./FriendsList";
import FriendRequests from "./FriendRequests";

const ProfilePage = () => {
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState();
  const navigate = useNavigate();

  const truncatedString = (str) => {
    return str.length > 170 ? `${str.substring(0, 170)}...` : str;
  };

  useEffect(() => {
    if (userId && userId2) {
      setIsOwner(userId === userId2);
    }
  }, [userId, userId2]);

  const buttonStyle = {
    border: "2px solid #ffbdc7",
    padding: "5px",
    borderRadius: "5px",
    background: "none",
    cursor: "pointer",
    color: "#ffbdc7",
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [posts, setPosts] = useState([]);
  const [attendingPosts, setAttendingPosts] = useState([]);

  // GET USERS POSTS
  const getUsersPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/user/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [token, userId]);

  useEffect(() => {
    getUsersPosts();
  }, [getUsersPosts]);

  // GET USERS ATTENDING POSTS
  const getUsersAttendingPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/user-attending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAttendingPosts(data);
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [token, userId]);

  useEffect(() => {
    getUsersAttendingPosts();
  }, [getUsersAttendingPosts]);

  // GET USER
  const getUser = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setValue("1");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [token, userId]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const [areFriends, setAreFriends] = useState();

  const checkIfUsersAreFriends = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/are-users-friends",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming token-based authentication
          },
          body: JSON.stringify({ userId1: userId, userId2: userId2 }),
        }
      );

      const data = await response.json();
      setAreFriends(data.areFriends);
    } catch (error) {
      console.error("Error:", error);
      return { error: error.message };
    }
  }, [token, userId]);

  useEffect(() => {
    checkIfUsersAreFriends();
  }, [checkIfUsersAreFriends]);

  // UNFOLLOW USER
  const unfollowUser = async () => {
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
            userId1: userId2,
            userId2: userId,
          }),
        }
      );

      const data = await response.json();
      checkIfUsersAreFriends();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // follow a user / send friend request
  const sendFriendRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/send-friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId1: userId2, userId2: userId }),
        }
      );

      const data = await response.json();
      checkIfFriendRequestSent(userId2, userId);
      checkIfUsersAreFriends();
      setSentRequest(responseRequest);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [sentRequest, setSentRequest] = useState();
  const [receivedRequest, setReceivedRequest] = useState();
  const [responseRequest, setResponseRequest] = useState();

  const checkIfFriendRequestSent = async (userId1, userId2) => {
    try {
      const response = await fetch(
        "http://localhost:3001/users/check-friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming JWT for auth
          },
          body: JSON.stringify({ userId1: userId1, userId2: userId2 }),
        }
      );

      const data = await response.json();
      setResponseRequest(data.hasSentRequest);
      checkIfUsersAreFriends();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    checkIfFriendRequestSent(userId2, userId);
    setSentRequest(responseRequest);
    console.log(sentRequest);
    checkIfFriendRequestSent(userId, userId2);
    setReceivedRequest(responseRequest);
  }, []);

  return (
    <div className="profile-container">
      <div className="left-container">
        <div className="name-container">
          <div className="name">
            {user && user.firstName + " " + user.lastName}
          </div>
          {!isOwner && areFriends && (
            <Button style={buttonStyle} onClick={() => unfollowUser()}>
              Unfollow
            </Button>
          )}
          {!isOwner && !areFriends && (
            <Button style={buttonStyle} onClick={() => sendFriendRequest()}>
              Follow
            </Button>
          )}
          {!isOwner && !areFriends && sentRequest ? (
            <div>A friend request has been sent to this user</div>
          ) : (
            !isOwner &&
            !areFriends &&
            receivedRequest && (
              <div>This user has sent you a friend request</div>
            )
          )}
        </div>
        <div style={{ marginTop: "10px" }}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "pink" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "pink",
                    },
                  }}
                >
                  <Tab
                    sx={{
                      color: "white",
                      "&.Mui-selected": { color: "pink" },
                      "font-family": "Quicksand, sans-serif",
                    }}
                    label="Events"
                    value="1"
                  />
                  <Tab
                    sx={{
                      color: "white",
                      "&.Mui-selected": { color: "pink" },
                      "font-family": "Quicksand, sans-serif",
                    }}
                    label="Attending"
                    value="2"
                  />
                  <Tab
                    sx={{
                      color: "white",
                      "&.Mui-selected": { color: "pink" },
                      "font-family": "Quicksand, sans-serif",
                    }}
                    label="Friends"
                    value="3"
                  />
                  {isOwner && (
                    <Tab
                      sx={{
                        color: "white",
                        "&.Mui-selected": { color: "pink" },
                        "font-family": "Quicksand, sans-serif",
                      }}
                      label="Friend Requests"
                      value="4"
                    />
                  )}
                </TabList>
              </Box>
              <TabPanel sx={{ color: "white" }} value="1">
                <div className="feed-posts2">
                  {posts.length > 0 ? (
                    posts.map((item) => (
                      <div
                        className="post2"
                        key={item._id}
                        onClick={() => {
                          navigate(`/post/${item._id}`);
                        }}
                      >
                        <div
                          className="picture2"
                          style={{
                            backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                          }}
                        ></div>
                        <div className="info2">
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: "1000",
                              marginBottom: "15px",
                            }}
                          >
                            {item.title}
                            <span
                              style={{
                                color: "#dedede",
                                fontSize: "13px",
                                fontWeight: "100",
                                marginLeft: "20px",
                              }}
                            >
                              <img
                                src={locationIcon}
                                alt=""
                                style={{ height: "12px", width: "12px" }}
                              ></img>
                              {" " + item.locality + ", " + item.county}
                            </span>
                          </span>
                          <span style={{ color: "white", lineHeight: 1.2 }}>
                            {truncatedString(item.description)}
                          </span>
                        </div>
                        <div className="date">
                          <div>
                            {new Date(
                              item.date.split("/").reverse().join("-")
                            ).getDate()}
                          </div>
                          <div>
                            {new Date(item.date.split("/").reverse().join("-"))
                              .toLocaleString("default", { month: "short" })
                              .toUpperCase()}
                          </div>
                          <div>
                            {new Date(
                              item.date.split("/").reverse().join("-")
                            ).getFullYear()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="message2">
                      This user has not created any posts
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel sx={{ color: "white" }} value="2">
                <div>
                  <div className="feed-posts2">
                    {attendingPosts.length > 0 ? (
                      attendingPosts.map((item) => (
                        <div
                          className="post2"
                          key={item._id}
                          onClick={() => {
                            navigate(`/post/${item._id}`);
                          }}
                        >
                          <div
                            className="picture2"
                            style={{
                              backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                            }}
                          ></div>
                          <div className="info2">
                            <span
                              style={{
                                fontSize: "20px",
                                fontWeight: "1000",
                                marginBottom: "15px",
                              }}
                            >
                              {item.title}
                              <span
                                style={{
                                  color: "#dedede",
                                  fontSize: "13px",
                                  fontWeight: "100",
                                  marginLeft: "20px",
                                }}
                              >
                                <img
                                  src={locationIcon}
                                  alt=""
                                  style={{ height: "12px", width: "12px" }}
                                ></img>
                                {" " + item.locality + ", " + item.county}
                              </span>
                            </span>
                            <span style={{ color: "white", lineHeight: 1.2 }}>
                              {truncatedString(item.description)}
                            </span>
                          </div>
                          <div className="date">
                            <div>
                              {new Date(
                                item.date.split("/").reverse().join("-")
                              ).getDate()}
                            </div>
                            <div>
                              {new Date(
                                item.date.split("/").reverse().join("-")
                              )
                                .toLocaleString("default", { month: "short" })
                                .toUpperCase()}
                            </div>
                            <div>
                              {new Date(
                                item.date.split("/").reverse().join("-")
                              ).getFullYear()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="message2">
                        There are currently no events attended by this user
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel sx={{ color: "white" }} value="3">
                <FriendsList />
              </TabPanel>
              {isOwner && (
                <TabPanel sx={{ color: "white" }} value="4">
                  <FriendRequests />
                </TabPanel>
              )}
            </TabContext>
          </Box>
        </div>
      </div>
      <div className="right-container">
        <div className="profile-pic-container">
          {user && (
            <img
              src={`http://localhost:3001/assets/${user.picturePath}`}
              alt=""
              className="profile-pic"
            />
          )}
        </div>
        <div className="sub-title">Contact</div>
        <hr className="hr2" />
        <div className="sub-sub-title">✉️ Email</div>
        <div className="profile-info">{user && user.email}</div>
        <div className="sub-sub-title">📱 Phone number</div>
        <div className="profile-info">{user && user.phone}</div>
        <div className="sub-title">Details</div>
        <hr className="hr2" />
        <div className="sub-sub-title">📍 Location</div>
        <div className="profile-info">
          {user && user.county + ", " + user.locality}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
