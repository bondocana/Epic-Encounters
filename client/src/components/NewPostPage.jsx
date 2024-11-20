import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./styles/newPost.css";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import WhiteEventIcon from "./styles/icons/event-white.png";
import WhiteNewPostIcon from "./styles/icons/confetti-white.png";
import WhiteHomeIcon from "./styles/icons/home-white.png";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const newPostSchema = yup.object().shape({
  title: yup.string().required("required"),
  description: yup.string().required("required"),
  picture: yup.string(),
  categoryId: yup.string().required("required"),
  date: yup.string().required("required"),
  time: yup.string().required("required"),
  county: yup.string().required("required"),
  locality: yup.string().required("required"),
  location: yup.string().required("required"),
});

const initialValuesNewPost = {
  title: "",
  description: "",
  picture: "",
  categoryId: "",
  date: "",
  time: "",
  county: "",
  locality: "",
  location: "",
};

// Custom MenuProps for Select component
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200, // Set the maximum height of the dropdown menu
      width: 250, // Optionally set a fixed width
    },
  },
};

const NewPostPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [postId, setPostId] = useState();

  const toastError = (message) =>
    toast.error(message, {
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

  //NEW POST
  const newPost = async (values, onSubmitProps) => {
    if (values.title.length > 50) {
      toastError("The title must be 50 characters or less.");
    } else {
      try {
        // this allows us to send form info with image
        // Formatează datele și timpul
        const formattedDate = format(new Date(values.date), "dd/MM/yyyy");
        const formattedTime = format(new Date(values.time), "HH:mm");

        // Crează obiectul FormData
        const formData = new FormData();
        for (let value in values) {
          if (value !== "date" && value !== "time") {
            formData.append(value, values[value]);
          }
        }
        formData.append("date", formattedDate);
        formData.append("time", formattedTime);
        formData.append("picturePath", values.picture.name);
        formData.append("userId", userId);

        const response = await fetch("http://localhost:3001/posts", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();
        setPostId(data._id);
        onSubmitProps.resetForm();
        setIsSubmitted(true); // Set the submission state to true
      } catch (err) {
        console.error("Error creating new post", err);
      }
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await newPost(values, onSubmitProps);
  };

  // COUNTIES AND LOCALITIES
  const [counties, setCounties] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch counties when the component mounts
    const fetchCounties = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/counties");
        const data = await response.json();
        setCounties(data);
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    };

    fetchCounties();
  }, []);

  useEffect(() => {
    if (selectedCounty) {
      // Fetch localities when a county is selected
      const fetchLocalities = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/localities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCounty: selectedCounty }),
          });
          const data = await response.json();
          setLocalities(data);
        } catch (error) {
          console.error("Error fetching localities:", error);
        }
      };

      fetchLocalities();
    }
  }, [selectedCounty]);

  const handleCountyChange = (event, handleChange) => {
    const { value } = event.target;
    setSelectedCounty(value);
    handleChange(event);
  };

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
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
    };

    fetchCategories();
  }, [token]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <>
      <div className="body">
        <ToastContainer />
        {isSubmitted ? ( // Check if the form is submitted
          <div className="container">
            <div
              className="titlu"
              style={{
                "margin-top": "20vh",
                "font-family": "Quicksand, sans-serif",
              }}
            >
              Your event has been submitted successfully !
            </div>

            <div
              className="subtitle"
              style={{ "font-family": "Quicksand, sans-serif" }}
            >
              The event will be available after the admin validates it
            </div>

            <div className="button-group">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  navigate(`/post/${postId}`);
                }}
                sx={{
                  width: "20vw",
                  height: "10vh",
                  backgroundColor: "var(--pink-color)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "var(--dark-pink-color)",
                  },
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2vw",
                  }}
                >
                  <img
                    src={WhiteEventIcon}
                    alt=""
                    className="white-image"
                  ></img>
                  <span style={{ fontFamily: "Quicksand, sans-serif" }}>
                    View Event
                  </span>
                </span>
              </Button>
              <Button
                onClick={() => setIsSubmitted(false)}
                sx={{
                  width: "20vw",
                  height: "10vh",
                  backgroundColor: "var(--pink-color)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "var(--dark-pink-color)",
                  },
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2vw",
                  }}
                >
                  <img
                    src={WhiteNewPostIcon}
                    alt=""
                    className="white-image"
                  ></img>
                  <span style={{ fontFamily: "Quicksand, sans-serif" }}>
                    Add Another Event
                  </span>
                </span>
              </Button>

              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  navigate("/home");
                }}
                sx={{
                  width: "20vw",
                  height: "10vh",
                  backgroundColor: "var(--pink-color)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "var(--dark-pink-color)",
                  },
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2vw",
                  }}
                >
                  <img src={WhiteHomeIcon} alt="" className="white-image"></img>
                  <span style={{ fontFamily: "Quicksand, sans-serif" }}>
                    Home Page
                  </span>
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="container">
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValuesNewPost}
              validationSchema={newPostSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="top-container">
                    <div className="titlu">Add a new Event!</div>
                    <div className="subtitle">General Information</div>

                    <div className="top-section">
                      <TextField
                        label="Title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        name="title"
                        error={Boolean(touched.title) && Boolean(errors.title)}
                        sx={{
                          width: "17vw",
                          "& .MuiFormLabel-root": {
                            color: "white",
                            fontFamily: "Quicksand, sans-serif",
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
                            fontFamily: "Quicksand, sans-serif",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Base outline color
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "var(--pink-color)", // Text color for input
                            fontFamily: "Quicksand, sans-serif",
                          },
                        }}
                      />
                      <TextField
                        label="Description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
                        name="description"
                        error={
                          Boolean(touched.description) &&
                          Boolean(errors.description)
                        }
                        sx={{
                          width: "17vw",
                          "& .MuiFormLabel-root": {
                            color: "white",
                            fontFamily: "Quicksand, sans-serif",
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
                            fontFamily: "Quicksand, sans-serif",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Base outline color
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "var(--pink-color)", // Text color for input
                            fontFamily: "Quicksand, sans-serif",
                          },
                        }}
                      />

                      <FormControl sx={{ width: "17vw" }} variant="outlined">
                        <InputLabel
                          sx={{
                            color:
                              touched.categoryId && errors.categoryId
                                ? "red"
                                : "white",
                            "&.Mui-focused": {
                              color:
                                touched.categoryId && errors.categoryId
                                  ? "red"
                                  : "var(--pink-color)",
                            },
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Category
                        </InputLabel>
                        <Select
                          labelId="categoryId-select-label"
                          id="categoryId-select"
                          label="categoryId"
                          value={values.categoryId}
                          name="categoryId"
                          variant="outlined"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            Boolean(touched.categoryId) &&
                            Boolean(errors.categoryId)
                          }
                          sx={{
                            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "var(--pink-color)",
                              },
                            color: "var(--pink-color)", // Text color
                            fontFamily: "Quicksand, sans-serif",

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                touched.categoryId && errors.categoryId
                                  ? "red"
                                  : "white",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                touched.categoryId && errors.categoryId
                                  ? "red"
                                  : "var(--pink-color)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                            "& .MuiSvgIcon-root": {
                              color:
                                touched.categoryId && errors.categoryId
                                  ? "red"
                                  : "white",
                            },
                          }}
                        >
                          {categories.map((category) => (
                            <MenuItem
                              key={category.name}
                              value={category.name}
                              sx={{ "font-family": "Quicksand, sans-serif" }}
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {/** Dropzone for profile picture */}
                    <Box
                      gridColumn="span 4"
                      border={`1px solid`}
                      borderRadius="5px"
                      p="1rem"
                      width="34vw"
                      borderColor={"white"}
                    >
                      <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) =>
                          setFieldValue("picture", acceptedFiles[0])
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed`}
                            p="1rem"
                            sx={{
                              "&:hover": { cursor: "pointer" },
                            }}
                            borderColor={"white"}
                          >
                            <input {...getInputProps()} />
                            {!values.picture ? (
                              <div
                                style={{
                                  color: "white",
                                  "font-family": "Quicksand, sans-serif",
                                  fontSize: "1rem",
                                }}
                              >
                                Add picture here
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  color: "var(--pink-color)",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "Quicksand, sans-serif",
                                  }}
                                >
                                  {values.picture.name}
                                </Typography>
                                <EditOutlinedIcon />
                              </div>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>
                  </div>

                  <div className="top-container">
                    <div className="subtitle">Address Information</div>
                    <div className="top-section">
                      {/* <TextField
                  label="Locality"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.locality}
                  name="locality"
                  error={Boolean(touched.locality) && Boolean(errors.locality)}
                  sx={{
                    width: "17vw",
                    "& .MuiFormLabel-root.Mui-focused": {
                      color: "var(--pink-color)", // Label color when focused
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "var(--pink-color)", // Outline color when focused
                      },
                  }}
                /> */}
                      <FormControl sx={{ width: "17vw" }} variant="outlined">
                        <InputLabel
                          id="demo-simple-select-label"
                          sx={{
                            color:
                              touched.county && errors.county ? "red" : "white",
                            "&.Mui-focused": {
                              color:
                                touched.county && errors.county
                                  ? "red"
                                  : "var(--pink-color)",
                            },
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          County
                        </InputLabel>
                        <Select
                          labelId="county-select-label"
                          id="county-select"
                          label="County"
                          value={values.county}
                          name="county"
                          variant="outlined"
                          onChange={(event) =>
                            handleCountyChange(event, handleChange)
                          }
                          error={
                            Boolean(touched.locality) &&
                            Boolean(errors.locality)
                          }
                          MenuProps={MenuProps} // Apply custom MenuProps
                          sx={{
                            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "var(--pink-color)",
                              },
                            color: "var(--pink-color)", // Text color
                            fontFamily: "Quicksand, sans-serif",

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Base outline color
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "var(--pink-color)", // Outline color when focused
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                            "& .MuiSvgIcon-root": {
                              color:
                                touched.locality && errors.locality
                                  ? "red"
                                  : "white",
                            },
                          }}
                        >
                          {counties.map((county) => (
                            <MenuItem
                              key={county.idCounty}
                              value={county.idCounty}
                              sx={{ "font-family": "Quicksand, sans-serif" }}
                            >
                              {county.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ width: "17vw" }} variant="outlined">
                        <InputLabel
                          sx={{
                            color:
                              touched.locality && errors.locality
                                ? "red"
                                : "white",
                            "&.Mui-focused": {
                              color:
                                touched.locality && errors.locality
                                  ? "red"
                                  : "var(--pink-color)",
                            },
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          Locality
                        </InputLabel>
                        <Select
                          labelId="locality-select-label"
                          id="locality-select"
                          label="Locality"
                          value={values.locality}
                          name="locality"
                          variant="outlined"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            Boolean(touched.locality) &&
                            Boolean(errors.locality)
                          }
                          sx={{
                            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "var(--pink-color)",
                              },
                            color: "var(--pink-color)", // Text color
                            fontFamily: "Quicksand, sans-serif",

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                touched.locality && errors.locality
                                  ? "red"
                                  : "white",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                touched.locality && errors.locality
                                  ? "red"
                                  : "var(--pink-color)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                            "& .MuiSvgIcon-root": {
                              color:
                                touched.locality && errors.locality
                                  ? "red"
                                  : "white",
                            },
                          }}
                        >
                          {localities.map((locality) => (
                            <MenuItem
                              key={locality.idLocality}
                              value={locality.idLocality}
                              sx={{ "font-family": "Quicksand, sans-serif" }}
                            >
                              {locality.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/** location */}

                      <TextField
                        label="Location"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.location}
                        name="location"
                        error={
                          Boolean(touched.location) && Boolean(errors.location)
                        }
                        sx={{
                          width: "17vw",
                          "& .MuiFormLabel-root": {
                            color: "white",
                            fontFamily: "Quicksand, sans-serif",
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
                            fontFamily: "Quicksand, sans-serif",

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Base outline color
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // Outline color on hover
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "var(--pink-color)", // Text color for input
                            fontFamily: "Quicksand, sans-serif",
                          },
                        }}
                      />
                    </div>

                    <div className="top-section">
                      {/** date selector */}
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        locale={enGB}
                      >
                        <DatePicker
                          label="Select the date"
                          value={selectedDate}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                            setFieldValue("date", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={
                                selectedDate
                                  ? format(selectedDate, "dd-MM-yyyy")
                                  : ""
                              }
                            />
                          )}
                          minDate={new Date()}
                          sx={{
                            color: "white",
                            "& .MuiInputBase-input": {
                              color: "white",
                              fontFamily: "Quicksand, sans-serif",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "white",
                                fontFamily: "Quicksand, sans-serif",
                              },
                              "&:hover fieldset": {
                                borderColor: "white",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "white",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontFamily: "Quicksand, sans-serif",
                              color: "white",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "white",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "white",
                              fontFamily: "Quicksand, sans-serif",
                            },
                          }}
                        />
                      </LocalizationProvider>

                      {/** time picker */}

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="Select the time"
                          value={selectedTime}
                          onChange={(newValue) => {
                            setSelectedTime(newValue);
                            setFieldValue("time", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ "font-family": "Quicksand, sans-serif" }}
                              {...params}
                            />
                          )}
                          ampm={false} // This line disables AM/PM and sets the time picker to 24-hour format
                          sx={{
                            color: "white",
                            "& .MuiInputBase-input": {
                              color: "white",
                              fontFamily: "Quicksand, sans-serif",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "white",
                                fontFamily: "Quicksand, sans-serif",
                              },
                              "&:hover fieldset": {
                                borderColor: "white",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "white",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "white",
                              fontFamily: "Quicksand, sans-serif",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "white",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "white",
                              fontFamily: "Quicksand, sans-serif",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "3vh",
                      }}
                    >
                      {/** buttons */}
                      <Button
                        type="submit"
                        sx={{
                          width: "36vw",
                          p: "1rem",
                          backgroundColor: "#808080",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#999999",
                          },
                          "&:active": {
                            backgroundColor: "#b2b2b2",
                          },
                          fontFamily: "Quicksand, sans-serif",
                        }}
                      >
                        Post the Event!
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  );
};

export default NewPostPage;
