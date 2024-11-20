import { setLogout } from "../state/authSlice.js";
import { useDispatch } from "react-redux";
import "./styles/sideMenu.css";
import icon from "./styles/icons/logout-icon.png";
import newEvent from "./styles/icons/new-event.png";
import home from "./styles/icons/home-icon.png";
import admin from "./styles/icons/admin-icon.png";
// import friends from "./styles/icons/friends-icon.png";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const isAdmin = useSelector((state) => state.isAdmin);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <div className="side-menu">
      <div className="logo">
        <span
          style={{
            color: "lightgray",
            fontFamily: "Rubik, sans-serif",
            fontSize: "28px",
          }}
        >
          Ǝ
        </span>
        <span style={{ fontFamily: "Rubik, sans-serif", fontSize: "28px" }}>
          E
        </span>
      </div>
      <div className="profile-picture">
        <img
          src={`http://localhost:3001/assets/${user.picturePath}`}
          alt=""
          onClick={() => navigate(`/profile/${userId}`)}
          className="profile-img"
        />
      </div>
      <div className="tabs-container">
        <div className="tab" onClick={() => navigate("/home")}>
          <img src={home} alt="" style={{ height: "30px", width: "30px" }} />
          <span> Home </span>
        </div>
        <div className="tab" onClick={() => navigate("/newPost")}>
          <img
            src={newEvent}
            alt=""
            style={{ height: "30px", width: "30px" }}
          />
          <span> Add Event</span>
        </div>

        {/* <div className="tab" onClick={() => navigate(`/profile/${userId}`)}>
          <img src={friends} alt="" style={{ height: "30px", width: "30px" }} />
          <span> Friends</span>
        </div> */}

        {isAdmin && (
          <div className="tab" onClick={() => navigate("/admin")}>
            <img src={admin} alt="" style={{ height: "30px", width: "30px" }} />
            <span> Admin</span>
          </div>
        )}
      </div>
      <div className="logout" onClick={() => dispatch(setLogout())}>
        <img src={icon} alt="" style={{ height: "30px", width: "30px" }} />
      </div>
    </div>
  );
};

export default SideMenu;
