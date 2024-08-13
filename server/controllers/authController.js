import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      picturePath,
      county,
      locality,
      isAdmin,
    } = req.body;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.status(500).json({
        error:
          "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: passwordHash,
      picturePath:
        picturePath === "undefined" ? "defaultProfilePicture.png" : picturePath,
      county,
      locality,
      isAdmin,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.errors) {
      if (err.errors.firstName) {
        return res
          .status(500)
          .json({ error: "First Name must not exceed 50 characters." });
      }
      if (err.errors.lastName) {
        return res
          .status(500)
          .json({ error: "Last Name must not exceed 50 characters." });
      }
    } else {
      if (err.errorResponse) {
        return res.status(500).json({ error: "This email is already taken." });
      }
    }
    return res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exists." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
