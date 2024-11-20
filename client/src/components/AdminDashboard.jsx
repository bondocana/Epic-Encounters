import React, { useCallback, useState, useEffect } from "react";
import "./styles/adminDashboard.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import locationIcon from "./styles/icons/location-icon.png";
import { Button, TextField } from "@mui/material";
import AdminModal from "./AdminModal";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MakeAdminModal from "./MakeAdminModal";
import deleteIcon from "./styles/icons/delete-icon.png";

function AdminDashboard() {
  const [value, setValue] = React.useState("1");
  // const dispatch = useDispatch();
  // const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [unapprovedPosts, setUnapprovedPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState();
  const [users, setUsers] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

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
    if (token) {
      getNonAdmins();
    }
  }, [getNonAdmins]);

  // UPDATE A POST
  const updatePost = useCallback(async (updatedPost) => {
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
              title: updatedPost.title,
              description: updatedPost.description,
              location: updatedPost.location,
              // date: updatedPost.date,
              // time: updatedPost.time,
              isAproved: "true",
            }),
          }
        );

        if (response.ok) {
          const updatedPost2 = await response.json();
          toastSuccess("Post edited successfully");
          getUnapprovedPosts();
        } else {
          console.error("Failed to update the post");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = (updatedPost) => {
    console.log("andrei");
    updatePost(updatedPost);
    console.log("andrei");
  };

  // make user admin
  const makeAdmin = useCallback(async (user) => {
    if (currentUser) {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user._id}/make-admin`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          toastSuccess("This user is now an admin");
          getNonAdmins();
        } else {
          console.error("Failed to update the user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showAdminModal, setshowAdminModal] = useState(false);

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

  // CATEGORII FARA EVENIMENTE
  const [categoriesWithoutEvents, setCategoriesWithoutEvents] = useState([]);

  const getCategoriesWithoutEvents = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/categories/categories-without-events`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setCategoriesWithoutEvents(data);
    } catch (error) {
      console.error("Error fetching categories without events:", error);
    }
  }, [token]);

  useEffect(() => {
    getCategoriesWithoutEvents();
  }, [getCategoriesWithoutEvents]);

  // add category
  const addCategory = async (categoryName) => {
    try {
      const response = await fetch("http://localhost:3001/categories/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you use Bearer token authentication
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        toastSuccess("Category added successfully");
        fetchCategories(); // Fetch categories again to update the list
        getCategoriesWithoutEvents(); // Fetch categories without events
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // delete category
  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/categories/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //const data = await response.json();
      toastSuccess("Category deleted successfully");
      fetchCategories();
      getCategoriesWithoutEvents();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const handleMakeAdminclick = (event, item) => {
    setShowModal(true);
    event.stopPropagation(); // This stops the click event from bubbling up to the parent
    setCurrentUser(item);
  };

  const handleMakeAdmin = () => {
    makeAdmin(currentUser);
    setShowModal(false);
  };

  const buttonStyle = {
    border: "2px solid #ffbdc7",
    padding: "5px",
    borderRadius: "5px",
    background: "none",
    cursor: "pointer",
    color: "#ffbdc7",
  };

  const deletePost = useCallback(
    async (item) => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${item._id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        //const data = await response.json();
        toastSuccess("Post deleted successfully");
        getUnapprovedPosts();
      } catch (error) {
        console.error("Error delting post:", error);
      }
    },
    [token]
  );

  const handleDelete = () => {
    deletePost(currentPost);
  };

  return (
    <>
      <ToastContainer />
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
                          onClick={(event) => handleMakeAdminclick(event, item)}
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
                  value={categoryName} // Asociază starea cu valoarea TextField
                  onChange={handleCategoryNameChange} // Actualizează starea la schimbare
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
                  onClick={() => addCategory(categoryName)}
                >
                  Add
                </Button>
              </div>

              {categories.length > 0 ? (
                <div className="category-fields">
                  {categories.map((item) => (
                    <div className="category-field" key={item._id}>
                      {categoriesWithoutEvents.length > 0 &&
                      categoriesWithoutEvents.some(
                        (categoryWithoutEvents) =>
                          categoryWithoutEvents._id === item._id
                      ) ? (
                        <>
                          <div
                            className="category-text"
                            style={{ marginRight: "-4vw", width: "10vw" }}
                          >
                            {item.name}
                          </div>
                          <Button
                            style={buttonStyle}
                            className="delete-button"
                            onClick={() => deleteCategory(item._id)}
                          >
                            <img src={deleteIcon} alt="" />
                          </Button>
                        </>
                      ) : (
                        <div className="category-text">{item.name}</div>
                      )}
                    </div>
                  ))}
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
            handleDelete={handleDelete}
          />
        )}
        <MakeAdminModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleConfirm={handleMakeAdmin}
        />
      </div>
    </>
  );
}

export default AdminDashboard;
