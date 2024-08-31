import { useEffect, useState } from "react";
import "./styles/customModal.css";
import Button from "@mui/material/Button";

const CustomModal = ({ show, handleClose, handleConfirm }) => {
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
    <div className={`modal-overlay ${fade ? "fade-out" : ""}`}>
      <div className={`modal-content ${fade ? "fade-out" : ""}`}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this item?</p>
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
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CustomModal;
