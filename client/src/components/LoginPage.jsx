import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setLogin } from "../state/authSlice.js";
import { setLogout } from "../state/authSlice.js";
import { TextField, Typography, Button } from "@mui/material";
import "./styles/login.css";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    // aici la fel orice returneaza endpoint-ul aceasta variabila va avea ceva in ea
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn.user && loggedIn.token) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
  };

  return (
    <div className="body">
      <div></div>
      <div
        className="form-container-login"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesLogin}
          validationSchema={loginSchema}
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
              <div className="label-container-login">
                {/** email and password */}
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)} // Boolean(touched.email) &&
                  sx={{
                    width: "24vw",
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
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                        "font-family": "Quicksand, sans-serif",
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
                  error={Boolean(touched.password) && Boolean(errors.password)} // Boolean(touched.password) &&
                  sx={{
                    width: "24vw",
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
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Base outline color
                        "font-family": "Quicksand, sans-serif",
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

              {/** buttons */}
              <Button
                type="submit"
                sx={{
                  width: "24vw",
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
                LOGIN
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
                  Don't have an account?
                </span>
                &nbsp;
                <Typography
                  onClick={() => {
                    navigate("/register");
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
                  Register here
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

export default LoginPage;
