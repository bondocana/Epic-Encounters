// EditPostModal.js
import { useEffect, useState } from "react";
import "./styles/editModal.css";
import Button from "@mui/material/Button";

const EditPostModal = ({ show, handleClose, post, handleSave }) => {
  const [editedPost, setEditedPost] = useState({
    title: "",
    description: "",
  });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (show && post) {
      setEditedPost({ title: post.title, description: post.description });
    }
    if (!show) {
      setFade(false);
    }
  }, [post, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFadeOut = () => {
    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500); // Durata animației fade-out trebuie să fie aceeași cu cea din CSS
  };

  const handleSaveClick = () => {
    handleSave(editedPost);

    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  if (!show && !fade) return null;

  return (
    <div className={`modal-overlay ${fade ? "fade-out" : ""}`}>
      <div className={`modal-content ${fade ? "fade-out" : ""}`}>
        <h2>Edit Post</h2>
        <input
          type="text"
          name="title"
          value={editedPost.title}
          onChange={handleChange}
          placeholder="Title"
          className="modal-input2"
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "16px",
          }}
        />
        <textarea
          name="description"
          value={editedPost.description}
          onChange={handleChange}
          placeholder="Description"
          rows="5"
          className="modal-textarea2"
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "16px",
          }}
        />
        <div className="modal-buttons2">
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

export default EditPostModal;
