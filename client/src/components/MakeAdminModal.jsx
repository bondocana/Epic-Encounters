import { useEffect, useState } from "react";
import "./styles/makeAdminModal.css";
import Button from "@mui/material/Button";

const MakeAdminModal = ({ show, handleClose, handleConfirm }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!show) {
      setFade(false);
    }
  }, [show]);

  const handleFadeOut = () => {
    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500); // Durata animației fade-out trebuie să fie aceeași cu cea din CSS
  };

  if (!show && !fade) return null;

  return (
    <div className={`modal-overlay3 ${fade ? "fade-out" : ""}`}>
      <div className={`modal-content3 ${fade ? "fade-out" : ""}`}>
        <h2>Confirm Admin</h2>
        <p>Are you sure you want to give this user admin privileges?</p>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFadeOut}
          style={{ backgroundColor: "gray" }}
          sx={{ "font-family": "Quicksand, sans-serif" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
          style={{ backgroundColor: "pink" }}
          sx={{ "font-family": "Quicksand, sans-serif" }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default MakeAdminModal;
