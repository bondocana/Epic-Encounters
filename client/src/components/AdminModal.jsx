import React, { useEffect, useState } from "react";
import "./styles/adminModal.css";
import { useSelector } from "react-redux";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { parse, format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Formik } from "formik";
import * as yup from "yup";

function AdminModal({ show, handleClose, post, handleUpdate, handleDelete }) {
  const editPostSchema = yup.object().shape({
    title: yup.string(),
    description: yup.string(),
    categoryId: yup.string(),
    date: yup.string(),
    time: yup.string(),
    county: yup.string(),
    locality: yup.string(),
    location: yup.string(),
  });

  const initialValuesEditPost = {
    title: post.title,
    description: post.description,
    categoryId: post.categoryId,
    date: post.date,
    time: post.time,
    county: post.county,
    locality: post.locality,
    location: post.location,
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

  const [editedPost, setEditedPost] = useState({
    title: "",
    description: "",
    categoryId: "",
    date: "",
    time: "",
    county: "",
    locality: "",
    location: "",
  });
  const [fade, setFade] = useState(false);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
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
  }, [token]);

  useEffect(() => {
    if (show && post && categories.length > 0) {
      const category = categories.find(
        (category) => category._id === post.categoryId
      );
      if (category) {
        setCategoryName(category.name);
      } else {
        console.error("Category not found for the given categoryId.");
      }
    }
  }, [post, show, categories]);

  const [counties, setCounties] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(null);

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

  useEffect(() => {
    if (show && post && counties.length > 0) {
      const county = counties.find((cout) => cout.idCounty === post.county);
      if (county) {
        setSelectedCounty(county.name);
      } else {
        console.error("Category not found for the given categoryId.");
      }
    }
  }, [post, show, counties]);

  useEffect(() => {
    if (show && post) {
      setEditedPost({
        title: post.title,
        description: post.description,
        categoryId: categoryName,
        date: post.date,
        time: post.time,
        county: selectedCounty,
        locality: post.locality,
        location: post.location,
      });

      const [day, month, year] = post.date.split("/");
      const parsedDate = new Date(year, month - 1, day); // month is 0-indexed

      const parsedTime = parse(post.time, "HH:mm", new Date());

      setSelectedDate(parsedDate);
      setSelectedTime(parsedTime);
      setSelectedCounty(10);
    }
    if (!show) {
      setFade(false);
    }
  }, [post, show, categories]);

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

  const handleSaveClick = (values) => {
    console.log("ana");
    // const formattedDate = format(new Date(values.date), "dd/MM/yyyy");
    // console.log("Time value before formatting:", values.time);
    // const formattedTime = format(new Date(values.time), "HH:mm");

    // const formattedDate = format(new Date(values.date), "dd/MM/yyyy");
    // const formattedTime = format(new Date(values.time), "HH:mm");

    const updatedPost = {
      title: values.title,
      description: values.description,
      location: values.location,
      // date: formattedDate,
      // time: formattedTime,
    };
    console.log(updatedPost);

    handleUpdate(updatedPost);

    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleDelete2 = () => {
    handleDelete();

    setFade(true);
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  if (!show && !fade) return null;

  return (
    <div className={`modal-overlay2 ${fade ? "fade-out" : ""}`}>
      <div className={`modal-content2 ${fade ? "fade-out" : ""}`}>
        <h2>Edit Post</h2>
        {/* <input
          type="text"
          name="title"
          value={editedPost.title}
          onChange={handleChange}
          placeholder="Title"
          className="modal-input"
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
          className="modal-textarea"
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "16px",
          }}
        /> */}

        <Formik
          onSubmit={handleSaveClick}
          initialValues={initialValuesEditPost}
          validationSchema={editPostSchema}
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
                      }}
                    >
                      Category
                    </InputLabel>
                    <Select
                      labelId="categoryId-select-label"
                      id="categoryId-select"
                      label="categoryId"
                      value={editedPost.categoryId}
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
                        <MenuItem key={category.name} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="top-container" style={{ paddingRight: "30px" }}>
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
                        }}
                      >
                        County
                      </InputLabel>
                      <Select
                        labelId="county-select-label"
                        id="county-select"
                        label="County"
                        value={10}
                        name="county"
                        variant="outlined"
                        onChange={(event) =>
                          handleCountyChange(event, handleChange)
                        }
                        error={
                          Boolean(touched.locality) && Boolean(errors.locality)
                        }
                        MenuProps={MenuProps} // Apply custom MenuProps
                        sx={{
                          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--pink-color)",
                            },
                          color: "var(--pink-color)", // Text color
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
                        }}
                      >
                        Locality
                      </InputLabel>
                      <Select
                        labelId="locality-select-label"
                        id="locality-select"
                        label="Locality"
                        value={101}
                        name="locality"
                        variant="outlined"
                        onChange={handleChange}
                        error={
                          Boolean(touched.locality) && Boolean(errors.locality)
                        }
                        MenuProps={MenuProps} // Apply custom MenuProps
                        sx={{
                          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--pink-color)",
                            },
                          color: "var(--pink-color)", // Text color
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
                        {localities.map((locality) => (
                          <MenuItem
                            key={locality.idLocality}
                            value={locality.idLocality}
                            // sx={{
                            //   backgroundColor: "#222222",
                            //   "&:hover": {
                            //     backgroundColor: "#999999",
                            //   },
                            //   color: "white", // Optional: set text color for better contrast
                            // }}
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
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white",
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
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "white",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
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
                        renderInput={(params) => <TextField {...params} />}
                        ampm={false} // This line disables AM/PM and sets the time picker to 24-hour format
                        sx={{
                          color: "white",
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white",
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
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "white",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="modal-buttons">
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
                      sx={{
                        "font-family": "Quicksand, sans-serif",
                        width: "12vw",
                      }}
                      type="submit"
                    >
                      Approve and Save
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDelete2}
                      style={{
                        backgroundColor: "gray",
                        marginRight: "10px",
                        width: "12vw",
                      }}
                      sx={{ "font-family": "Quicksand, sans-serif" }}
                    >
                      Reject and Delete
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AdminModal;
