import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
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
import "./styles/login.css";
import { useDispatch } from "react-redux";
import { setLogin } from "../state/authSlice.js";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setLogout } from "../state/authSlice.js";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().required("required"),
  phone: yup
    .string()
    // .matches(/^07[0-9]{8}$/, "Invalid phone number.")
    .required("required"),
  password: yup
    .string()
    // .matches(
    //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    //   "The password does not meet the required conditions."
    // )
    .required("required"),
  county: yup.string().required("required"),
  locality: yup.string().required("required"),
  picture: yup.string(),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  county: "",
  locality: "",
  picture: "",
};

// Custom MenuProps for Select component
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200, // Set the maximum height of the dropdown menu
      width: 180, // Optionally set a fixed width
    },
  },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // REGISTER
  const register = async (values, onSubmitProps) => {
    const isValidPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
        values.password
      );

    if (!values.email.includes("@") || !values.email.includes(".")) {
      toastError("Email is invalid");
    } else if (!isValidPassword) {
      toastError("The password does not meet the required conditions");
    } else if (!/^07[0-9]{8}$/.test(values.phone)) {
      toastError("Invalid phone number");
    } else {
      try {
        // this allows us to send form info with image
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
        formData.append("picturePath", values.picture.name);

        const savedUserResponse = await fetch(
          "http://localhost:3001/auth/register",
          {
            method: "POST",
            body: formData,
          }
        );
        const savedUser = await savedUserResponse.json();

        // aici trebuie cu try catch
        // aici trebuie tratate erorile din backend (de ex validarile pe parola)

        // intra pe if-ul asta in orice caz pentru ca endpoint-ul returneaza mesaj de eroare
        // if (savedUser) {
        //   navigate("/home");
        //   // si aici sa il bage direct in site nu sa il puna sa se mai logheze
        //   // adica sa ii pun user ul si token ul
        // }

        // LOGIN
        const loggedInResponse = await fetch(
          "http://localhost:3001/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        // aici la fel orice returneaza endpoint-ul aceasta variabila va avea ceva in ea
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if (savedUser && loggedIn.user && loggedIn.token) {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
              isAdmin: loggedIn.user.isAdmin,
            })
          );
          navigate("/home");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  // COUNTIES AND LOCALITIES
  const [counties, setCounties] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");

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

  return (
    <div className="body">
      <div>
        <ToastContainer />
      </div>
      <div className="form-container">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesRegister}
          validationSchema={registerSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="title">
                <span style={{ color: "lightgray" }}>Ǝ</span>
                <span style={{ fontFamily: "Rubik, sans-serif" }}>E</span>
              </div>
              <div
                className="title"
                style={{
                  fontSize: "38px",
                }}
              >
                <span style={{ color: "lightgray" }}>Epic</span> Encounters
              </div>
              <div className="label-container" style={{ gap: "2vw" }}>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  // helperText={
                  //   touched.firstName && errors.firstName
                  //     ? errors.firstName
                  //     : ""
                  // }
                  sx={{
                    width: "17vw",
                    "& .MuiFormLabel-root": {
                      color: "white",
                      "font-family": "Quicksand, sans-serif",
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
                      "font-family": "Quicksand, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Outline color on hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--pink-color)", // Text color for input
                      "font-family": "Quicksand, sans-serif",
                    },
                  }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  sx={{
                    width: "17vw",
                    "& .MuiFormLabel-root": {
                      color: "white",
                      "font-family": "Quicksand, sans-serif",
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
                      "font-family": "Quicksand, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Outline color on hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--pink-color)", // Text color for input
                      "font-family": "Quicksand, sans-serif",
                    },
                  }}
                />
              </div>
              <div className="label-container">
                <FormControl sx={{ width: "11.5vw" }} variant="outlined">
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                      color:
                        touched.locality && errors.locality ? "red" : "white",
                      "&.Mui-focused": {
                        color:
                          touched.locality && errors.locality
                            ? "red"
                            : "var(--pink-color)",
                      },
                      "font-family": "Quicksand, sans-serif",
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
                    error={Boolean(touched.county) && Boolean(errors.county)}
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
                          touched.locality && errors.locality ? "red" : "white",
                      },
                      "font-family": "Quicksand, sans-serif",
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
                <FormControl sx={{ width: "11.5vw" }} variant="outlined">
                  <InputLabel
                    sx={{
                      color:
                        touched.locality && errors.locality ? "red" : "white",
                      "&.Mui-focused": {
                        color:
                          touched.locality && errors.locality
                            ? "red"
                            : "var(--pink-color)",
                      },
                      "font-family": "Quicksand, sans-serif",
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
                      Boolean(touched.locality) && Boolean(errors.locality)
                    }
                    sx={{
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "var(--pink-color)",
                        },
                      color: "var(--pink-color)", // Text color
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          touched.locality && errors.locality ? "red" : "white",
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
                          touched.locality && errors.locality ? "red" : "white",
                      },
                      "font-family": "Quicksand, sans-serif",
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
                <TextField
                  label="Phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  error={Boolean(touched.phone) && Boolean(errors.phone)}
                  // helperText={touched.phone && errors.phone ? errors.phone : ""}
                  sx={{
                    width: "11.5vw",
                    "& .MuiFormLabel-root": {
                      color: "white",
                      "font-family": "Quicksand, sans-serif",
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
                      "font-family": "Quicksand, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Outline color on hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--pink-color)", // Text color for input
                      "font-family": "Quicksand, sans-serif",
                    },
                  }}
                />
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
                            sx={{ "font-family": "Quicksand, sans-serif" }}
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

              {/** email and password */}
              <div className="label-container2" style={{ gap: "2vw" }}>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  sx={{
                    width: "15.5vw",
                    "& .MuiFormLabel-root": {
                      color: "white",
                      "font-family": "Quicksand, sans-serif",
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                      color: "var(--pink-color)", // Label color when focused
                      "font-family": "Quicksand, sans-serif",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "var(--pink-color)", // Outline color when focused
                      },
                    "& .MuiOutlinedInput-root": {
                      color: "white", // Text color
                      "font-family": "Quicksand, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Outline color on hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--pink-color)", // Text color for input
                      "font-family": "Quicksand, sans-serif",
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  sx={{
                    width: "15.5vw",
                    "& .MuiFormLabel-root": {
                      color: "white",
                      "font-family": "Quicksand, sans-serif",
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                      color: "var(--pink-color)", // Label color when focused
                      "font-family": "Quicksand, sans-serif",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "var(--pink-color)", // Outline color when focused
                      },
                    "& .MuiOutlinedInput-root": {
                      color: "white", // Text color
                      "font-family": "Quicksand, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Outline color on hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--pink-color)", // Text color for input
                      "font-family": "Quicksand, sans-serif",
                    },
                  }}
                />
                <Tooltip
                  title={
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      Password must be at least 8 characters long, include at
                      least one uppercase letter, one lowercase letter, and one
                      number.
                    </span>
                  }
                  arrow
                >
                  <IconButton
                    style={{ marginLeft: "-20px", color: "var(--pink-color)" }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </div>
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
                  "font-family": "Quicksand, sans-serif",
                }}
              >
                REGISTER
              </Button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#808080",
                    "font-family": "Quicksand, sans-serif",
                  }}
                >
                  Already have an account?
                </span>
                &nbsp;
                <Typography
                  onClick={() => {
                    navigate("/");
                    resetForm();
                  }}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                    color: "var(--pink-color)",
                    fontWeight: "600",
                    "font-family": "Quicksand, sans-serif",
                  }}
                >
                  Login here
                </Typography>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div></div>
    </div>
  );
};

export default RegisterPage;
