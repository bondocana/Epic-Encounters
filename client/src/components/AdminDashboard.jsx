import React, { useCallback, useState, useEffect } from "react";
import "./styles/adminDashboard.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import locationIcon from "./styles/icons/location-icon.png";
import { Button, TextField } from "@mui/material";
import AdminModal from "./AdminModal";

function AdminDashboard() {
  const [value, setValue] = React.useState("1");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [unapprovedPosts, setUnapprovedPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState();
  const [users, setUsers] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const truncatedString = (str) => {
    return str.length > 170 ? `${str.substring(0, 170)}...` : str;
  };

  const handleEditClick = (event, item) => {
    setshowAdminModal(true);
    event.stopPropagation(); // This stops the click event from bubbling up to the parent
    setCurrentPost(item);
  };

  const getUnapprovedPosts = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/unapproved`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUnapprovedPosts(data);
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [token]);

  useEffect(() => {
    getUnapprovedPosts();
  }, [getUnapprovedPosts]);

  const getNonAdmins = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/non-admins`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token]);

  useEffect(() => {
    getNonAdmins();
  }, [getNonAdmins]);

  // UPDATE A POST
  const updatePost = useCallback(async (editedPost) => {
    try {
      if (currentPost) {
        const response = await fetch(
          `http://localhost:3001/posts/${currentPost._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: editedPost.title,
              description: editedPost.description,
            }),
          }
        );

        if (response.ok) {
          const updatedPost = await response.json();
          getUnapprovedPosts();
        } else {
          console.error("Failed to update the post");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  // make user admin
  const makeAdmin = useCallback(async (user) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user}/make-admin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        getNonAdmins();
      } else {
        console.error("Failed to update the user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const [showAdminModal, setshowAdminModal] = useState(false);
  const handleUpdate = (editedPost) => {
    updatePost(editedPost);
  };

  const [categories, setCategories] = useState([]);

  // Funcție pentru a prelua toate categoriile
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // add category
  const addCategory = async (categoryName) => {
    try {
      const response = await fetch("http://localhost:3000/categories/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you use Bearer token authentication
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await response.json();
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-title">Admin Dashboard</div>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "pink" }}>
            <TabList
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "pink",
                },
              }}
              onChange={handleChange}
              aria-label="lab API tabs example"
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
                label="Users"
                value="2"
              />
              <Tab
                sx={{
                  color: "white",
                  "&.Mui-selected": { color: "pink" },
                  "font-family": "Quicksand, sans-serif",
                }}
                label="Categories"
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="confirm-events-container">
              {unapprovedPosts.length > 0 ? (
                unapprovedPosts.map((item) => (
                  <div
                    className="post3"
                    key={item._id}
                    onClick={() => {
                      navigate(`/post/${item._id}`);
                    }}
                  >
                    <div
                      className="picture69"
                      style={{
                        backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                      }}
                    ></div>
                    <div className="info3">
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
                    <div className="date3">
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
                    <div
                      className="confirm-buttons"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <Button
                        sx={{
                          width: "7vw",
                          height: "3vw",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255, 189, 199, 0.9)", // Semi-transparent pink
                          color: "#555",
                          fontFamily: "Quicksand, sans-serif",
                          fontSize: "16px",
                          fontWeight: "1000",
                          border: "none",
                          outline: "none",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 189, 199, 0.7)",
                            cursor: "pointer",
                          },
                          "&:active": {
                            backgroundColor: "rgba(255, 189, 199, 1)",
                          },
                        }}
                        onClick={(event) => handleEditClick(event, item)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="message3">No unapproved posts found</div>
              )}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="friends-container3">
              {users.length > 0 ? (
                users.map((item) => (
                  <div className="friend-container3">
                    <div
                      className="picture3"
                      style={{
                        backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                      }}
                      onClick={() => navigate(`/profile/${item._id}`)}
                    ></div>
                    <div
                      className="bottom-section3"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      <span style={{ color: "white" }}>
                        {" "}
                        {item.firstName + " " + item.lastName}{" "}
                      </span>

                      <Button
                        style={{
                          fontFamily: "'Quicksand', sans-serif",
                          color: "#ffbdc7",
                          marginTop: "4px",
                        }}
                        onClick={() => makeAdmin(item._id)}
                      >
                        Make admin
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="message3">All users are admins</div>
              )}
            </div>
          </TabPanel>
          <TabPanel value="3" className="categories">
            <div className="add-category-input">
              <TextField
                className="category-input"
                label="Category Name"
                name="CategoryName"
                sx={{
                  "& .MuiFormLabel-root": {
                    color: "white",
                    fontFamily: "'Quicksand', sans-serif",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    color: "var(--pink-color)", // Label color when focused
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "var(--pink-color)", // Outline color when focused
                    },
                  "& .MuiOutlinedInput-root": {
                    color: "white", // Text color
                    fontFamily: "'Quicksand', sans-serif",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white", // Base outline color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white", // Outline color on hover
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--pink-color)", // Text color for input
                  },
                }}
              ></TextField>
              <Button
                className="add-category-button"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#ffbdc7",
                  border: "1px solid #ffbdc7",
                }}
              >
                Add
              </Button>
            </div>

            {categories.length > 0 ? (
              <div className="category-fields">
                {categories.map((item) => (
                  <div className="category-field">{item.name}</div>
                ))}
                <br />
                <br />
              </div>
            ) : (
              <div>No category found</div>
            )}
          </TabPanel>
        </TabContext>
      </Box>
      {currentPost && (
        <AdminModal
          show={showAdminModal}
          handleClose={() => setshowAdminModal(false)}
          post={currentPost}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
