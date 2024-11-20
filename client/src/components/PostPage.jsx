import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/postPage.css";
import { Button } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import editIcon from "./styles/icons/edit-icon.png";
import deleteIcon from "./styles/icons/delete-icon.png";
import CustomModal from "./CustomModal";
import EditModal from "./EditModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = () => {
  const { postId } = useParams();
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const isAdmin = useSelector((state) => state.isAdmin);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState();
  const [isAttending, setIsAttending] = useState();
  const [coordinates, setCoordinates] = useState(null);

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

  // GET POST
  const getPost = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPost(data);
      if (data.userId && userId2) {
        setIsOwner(data.userId === userId2);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, token]);

  useEffect(() => {
    getPost();
  }, [getPost]); // Added postId as a dependency

  // GET USER
  const getUser = useCallback(async () => {
    if (!post || !post.userId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/users/${post.userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [post, token]);

  useEffect(() => {
    getUser();
  }, [getUser]); // Now it will run whenever post changes

  const buttonStyle = {
    border: "2px solid #ffbdc7",
    padding: "5px",
    borderRadius: "5px",
    background: "none",
    cursor: "pointer",
    color: "#ffbdc7",
  };

  const deletePost = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      //const data = await response.json();
    } catch (error) {
      console.error("Error delting post:", error);
    }
  }, [postId, token]);

  // UPDATE A POST
  const updatePost = useCallback(
    async (editedPost) => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedPost.title,
            description: editedPost.description,
          }),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          toastSuccess("Post edited successfully");
          setPost(updatedPost);
        } else {
          console.error("Failed to update the post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setPost]
  );

  const [showModal, setShowModal] = useState(false);
  const handleDelete = () => {
    deletePost();
    setShowModal(false);
    navigate("/home");
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const handleSave = (editedPost) => {
    updatePost(editedPost);
  };

  const [attendingUsers, setAttendingUsers] = useState([]);
  // GET ATTENDING USERS
  const getAttendingUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/attending/${postId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setAttendingUsers(data);
    } catch (error) {
      console.error("Error delting post:", error);
    }
  }, [postId, token]);

  useEffect(() => {
    getAttendingUsers();
  }, [getAttendingUsers]); // Now it will run whenever post changes

  // GET COORDINATES
  const getCoordinates = useCallback(async () => {
    try {
      if (post) {
        const response = await fetch(
          `http://localhost:3001/api/get-coordinates`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              county: post.county,
              locality: post.locality,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setCoordinates({ lat: data.latitude, lon: data.longitude });
        } else {
          setCoordinates(null);
          throw new Error("Failed to fetch coordinates.");
        }
      }
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [post]);

  useEffect(() => {
    getCoordinates();
  }, [getCoordinates]); // Now it will run whenever post changes

  const checkUserAttendance = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/posts/check-user-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your JWT token here if necessary
          },
          body: JSON.stringify({
            userId: userId2, // The user whose attendance is being checked
            postId: postId, // The post to check attendance against
          }),
        }
      );

      const data = await response.json();

      setIsAttending(data.IsAttending);
    } catch (error) {
      console.error("Error checking user attendance:", error);
    }
  }, [postId]);

  useEffect(() => {
    checkUserAttendance();
  }, [token]);

  const addUserToAttending = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/posts/add-to-attending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your JWT token here if necessary
          },
          body: JSON.stringify({ userId: userId2, postId: postId }),
        }
      );

      const data = await response.json();
      setIsAttending(true);
      toastSuccess("You are now attending this event");
      getAttendingUsers();
    } catch (error) {
      console.error("Error adding user to attending list:", error);
    }
  }, []);

  const removeUserFromAttending = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/posts/remove-from-attending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your JWT token here if necessary
          },
          body: JSON.stringify({ userId: userId2, postId: postId }),
        }
      );

      const data = await response.json();
      setIsAttending(false);
      toastSuccess("You are no longer attending this event");
      getAttendingUsers();
    } catch (error) {
      console.error("Error adding user to attending list:", error);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
      />
      <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
      <div className="postPageContainer">
        {post && (
          <>
            {user && (
              <img
                src={`http://localhost:3001/assets/${post.picturePath}`}
                alt=""
                className="imageTop"
              />
            )}

            <div className="bottom">
              <div className="titleContainer">
                <div className="postTitle">{post && post.title}</div>
                {isAdmin ? (
                  <div>
                    <div className="editDelete" style={{ marginRight: "20px" }}>
                      {!isAttending && (
                        <Button
                          style={buttonStyle}
                          onClick={() => addUserToAttending()}
                        >
                          Attend
                        </Button>
                      )}
                      {isAttending && (
                        <Button
                          style={buttonStyle}
                          onClick={() => removeUserFromAttending()}
                        >
                          Unattend
                        </Button>
                      )}
                      <Button
                        style={buttonStyle}
                        onClick={() => setShowEditModal(true)}
                      >
                        <img src={editIcon} alt=""></img>
                      </Button>
                      <Button
                        style={buttonStyle}
                        onClick={() => setShowModal(true)}
                      >
                        <img src={deleteIcon} alt=""></img>
                      </Button>
                      <CustomModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleConfirm={handleDelete}
                      />
                      {post && (
                        <EditModal
                          show={showEditModal}
                          handleClose={() => setShowEditModal(false)}
                          post={post}
                          handleSave={handleSave}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {isOwner && (
                      <div
                        className="editDelete"
                        style={{ marginRight: "20px" }}
                      >
                        <Button
                          style={buttonStyle}
                          onClick={() => setShowEditModal(true)}
                        >
                          <img src={editIcon} alt=""></img>
                        </Button>
                        <Button
                          style={buttonStyle}
                          onClick={() => setShowModal(true)}
                        >
                          <img src={deleteIcon} alt=""></img>
                        </Button>
                        <CustomModal
                          show={showModal}
                          handleClose={() => setShowModal(false)}
                          handleConfirm={handleDelete}
                        />
                        {post && (
                          <EditModal
                            show={showEditModal}
                            handleClose={() => setShowEditModal(false)}
                            post={post}
                            handleSave={handleSave}
                          />
                        )}
                      </div>
                    )}
                    {!isOwner && !isAttending && (
                      <Button
                        style={buttonStyle}
                        sx={{ marginRight: "20px" }}
                        onClick={() => addUserToAttending()}
                      >
                        Attend
                      </Button>
                    )}
                    {!isOwner && isAttending && (
                      <Button
                        style={buttonStyle}
                        sx={{ marginRight: "20px" }}
                        onClick={() => removeUserFromAttending()}
                      >
                        Unattend
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <hr />
              <br />
              <div className="timelineMap">
                <div>
                  <div className="friend-avatars">
                    {attendingUsers.length > 0 ? (
                      <>
                        <Typography
                          variant="h6"
                          component="span"
                          color="#ffffff"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                            marginLeft: "4px",
                          }}
                        >
                          Attending
                        </Typography>
                        <AvatarGroup total={attendingUsers.length} max={10}>
                          {attendingUsers.map((item, index) => (
                            <Avatar
                              key={index}
                              alt={`${item.firstName} ${item.lastName}`}
                              src={`http://localhost:3001/assets/${item.picturePath}`}
                              onClick={() => {
                                navigate(`/profile/${item._id}`);
                              }}
                              className="avatar"
                            />
                          ))}
                        </AvatarGroup>
                      </>
                    ) : (
                      <Typography
                        variant="h6"
                        component="span"
                        color="#555"
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          marginLeft: "4px",
                          margin: "3vh 0 3vh 0",
                        }}
                      >
                        No people attending yet !
                      </Typography>
                    )}
                  </div>

                  <Timeline sx={{ marginLeft: "-25vw" }}>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ backgroundColor: "#ff8a9c" }}>
                          <PersonIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="#ffffff"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Posted by
                        </Typography>
                        <Typography
                          color="#6a6a6a"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                          onClick={() => {
                            navigate(`/profile/${user._id}`);
                          }}
                        >
                          <span className="span-link">
                            {user && user.firstName + " " + user.lastName}
                          </span>
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ backgroundColor: "#ff8a9c" }}>
                          <CategoryIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="#ffffff"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Category
                        </Typography>
                        <Typography
                          color="#6a6a6a"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          {post && post.categoryId}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ backgroundColor: "#ff8a9c" }}>
                          <CalendarTodayIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="#ffffff"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Date and time
                        </Typography>
                        <Typography
                          color="#6a6a6a"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          {post &&
                            post.date.split("/").join(".") + " " + post.time}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ backgroundColor: "#ff8a9c" }}>
                          <LocationOnIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="#ffffff"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Location
                        </Typography>
                        <Typography
                          color="#6a6a6a"
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          {post &&
                            post.location +
                              " " +
                              post.locality +
                              ", " +
                              post.county}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </div>
                <div>
                  <MapContainer
                    center={[45.8422222, 24.97138888888889]}
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{
                      height: "50vh",
                      width: "55vw",
                      zIndex: "2",
                      marginLeft: "3vw",
                      borderRadius: "20px",
                      border: "2px solid #ff8a9c",
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {coordinates && (
                      <Marker position={[coordinates.lat, coordinates.lon]}>
                        <Popup>{post && post.location}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </div>
              <br />
              <br />
              <div className="titleContainer">
                <div className="postTitle">Description</div>
              </div>
              <hr />
              <br />
              <br />
              <div className="post-description">
                {post &&
                  post.description.charAt(0).toUpperCase() +
                    post.description.slice(1)}
              </div>
              <br />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Post;
