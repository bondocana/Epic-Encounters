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

const ProfilePage = () => {
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState();
  const navigate = useNavigate();

  const truncatedString = (str) => {
    return str.length > 230 ? `${str.substring(0, 230)}...` : str;
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
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [token, userId]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="profile-container">
      <div className="left-container">
        <div className="name-container">
          <div className="name">
            {user && user.firstName + " " + user.lastName}
          </div>
          <Button style={buttonStyle}>Follow</Button>
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
                    label="Posts"
                    value="1"
                  />
                  <Tab
                    sx={{
                      color: "white",
                      "&.Mui-selected": { color: "pink" },
                      "font-family": "Quicksand, sans-serif",
                    }}
                    label="Friends"
                    value="2"
                  />
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
                      This user has not created any posts.
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel sx={{ color: "white" }} value="2">
                Item Two
              </TabPanel>
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
