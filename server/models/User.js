import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 20
    },
    password: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      default: "defaultProfilePicture.png",
    },
    friendRequests: {
      type: Array,
      default: [],
    },
    friends: {
      type: Array,
      default: [],
    },
    county: {
      type: String,
      maxlength: 50,
      required: true,
    },
    locality: {
      type: String,
      maxlength: 50,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
