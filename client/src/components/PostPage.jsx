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
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";
import editIcon from "./styles/icons/edit-icon.png";
import deleteIcon from "./styles/icons/delete-icon.png";
import CustomModal from "./CustomModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Post = () => {
  const { postId } = useParams();
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState();

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

  const [showModal, setShowModal] = useState(false);
  const handleDelete = () => {
    deletePost();
    console.log("Item deleted");
    setShowModal(false);
    navigate("/home");
  };

  return (
    <>
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
                <div className="postTitle">Color Run Event</div>
                {isOwner && (
                  <div className="editDelete">
                    <Button style={buttonStyle}>
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
                  </div>
                )}
              </div>
              <br></br>
              <hr></hr>
              <br></br>
              <div>attending</div>
              <br></br>
              <div className="timelineMap">
                <div>
                  <Timeline sx={{ marginLeft: "-25vw" }}>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot>
                          <FastfoodIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="var(--pink-color)"
                        >
                          Eat
                        </Typography>
                        <Typography color="white">
                          Because you need strength
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary">
                          <LaptopMacIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="var(--pink-color)"
                        >
                          Code
                        </Typography>
                        <Typography color="white">
                          Because it&apos;s awesome!
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary" variant="outlined">
                          <HotelIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="var(--pink-color)"
                        >
                          Sleep
                        </Typography>
                        <Typography color="white">
                          Because you need rest
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="secondary">
                          <RepeatIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                          color="var(--pink-color)"
                        >
                          Repeat
                        </Typography>
                        <Typography color="white">
                          Because this is the life you love!
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
                    style={{ height: "40vh", width: "50vw", zIndex: "-2" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Post;
