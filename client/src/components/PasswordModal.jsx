import { useEffect, useState } from "react";
import "./styles/passwordModal.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from "@mui/icons-material/Info"; // Import the icon

const PasswordModal = ({ show, handleClose, handleSave }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!show) {
      setFade(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle visibility for the specific field
    }));
  };

  const handleFadeOut = () => {
    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleSaveClick = () => {
    handleSave(passwords); // Pass the password data to the parent component
  };

  if (!show && !fade) return null;

  return (
    <div className={`modal-overlay3 ${fade ? "fade-out" : ""}`}>
      <div
        className={`modal-content3 ${fade ? "fade-out" : ""}`}
        style={{ width: "27vw", height: "41svh" }}
      >
        <h2
          style={{
            paddingBottom: "10px",
            paddingTop: "-100px",
            "font-family": "Quicksand, sans-serif",
            fontSize: "23px",
          }}
        >
          Change Password
        </h2>

        {/* Information Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
            fontFamily: "'Quicksand', sans-serif",
            color: "#dedede",
          }}
        >
          <InfoIcon
            style={{
              color: "var(--pink-color)",
              marginRight: "8px",
              fontSize: "24px",
            }}
          />
          <span>
            Once your password is successfully changed, you will be signed out
            to ensure your account's security
          </span>
        </div>

        {/* Current Password Field */}
        <div className="password-field">
          <input
            type={showPasswords.currentPassword ? "text" : "password"}
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="modal-input3"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "16px",
            }}
          />
          <IconButton
            onClick={() => toggleShowPassword("currentPassword")}
            className="visibility-toggle"
          >
            {showPasswords.currentPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <br />

        {/* New Password Field */}
        <div className="password-field">
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="modal-input3"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "16px",
            }}
          />
          <IconButton
            onClick={() => toggleShowPassword("newPassword")}
            className="visibility-toggle"
          >
            {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>

        {/* Confirm New Password Field */}
        <div className="password-field">
          <input
            type={showPasswords.confirmNewPassword ? "text" : "password"}
            name="confirmNewPassword"
            value={passwords.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="modal-input3"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "16px",
            }}
          />
          <IconButton
            onClick={() => toggleShowPassword("confirmNewPassword")}
            className="visibility-toggle"
          >
            {showPasswords.confirmNewPassword ? (
              <VisibilityOff />
            ) : (
              <Visibility />
            )}
          </IconButton>
        </div>

        <div className="modal-buttons3" style={{ paddingTop: "6px" }}>
          <Button
            variant="contained"
            onClick={handleFadeOut}
            style={{
              backgroundColor: "gray",
              marginRight: "10px",
              width: "6vw",
            }}
            sx={{ "font-family": "Quicksand, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "var(--pink-color)" }}
            sx={{ "font-family": "Quicksand, sans-serif", width: "6vw" }}
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
