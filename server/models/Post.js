import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      default: "defaultPostPicture.png",
    },
    isAproved: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
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
    location: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    attending: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
