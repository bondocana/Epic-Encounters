import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      picturePath,
      isAproved,
      categoryId,
      date,
      time,
      county,
      locality,
      location,
    } = req.body;

    const newPost = new Post({
      userId,
      title,
      description,
      picturePath:
        picturePath === "undefined" ? "defaultPostPicture.png" : picturePath,
      isAproved,
      categoryId,
      date,
      time,
      county,
      locality,
      location,
      likes: [],
      comments: [],
      attending: [],
    });

    const savedPost = await newPost.save();

    return res.status(201).json(savedPost);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

// DELETE A POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET A POST
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// GET POSTS BY USER'S COUNTY ORDERED BY DATA
export const getUserCountyPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allPosts = await Post.find({ county: currentUser.county });

    // // Function to parse the date string
    // const parseDate = (dateStr) => {
    //   const [day, month, yearTime] = dateStr.split(".");
    //   const [year, time] = yearTime.split(" ");
    //   return new Date(`${year}-${month}-${day}T${time}:00`);
    // };

    // // Sort the posts by date in descending order
    // const sortedPosts = allPosts.sort((a, b) => {
    //   const dateA = parseDate(a.date);
    //   const dateB = parseDate(b.date);
    //   return -(dateB - dateA);
    // });

    res.status(200).json(allPosts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// GET POSTS ORDERED BY DATA
export const getPostsByDate = async (req, res) => {
  try {
    const allPosts = await Post.find();

    // // Function to parse the date string
    // const parseDate = (dateStr) => {
    //   const [day, month, yearTime] = dateStr.split(".");
    //   const [year, time] = yearTime.split(" ");
    //   return new Date(`${year}-${month}-${day}T${time}:00`);
    // };

    // // Sort the posts by date in descending order
    // const sortedPosts = allPosts.sort((a, b) => {
    //   const dateA = parseDate(a.date);
    //   const dateB = parseDate(b.date);
    //   return -(dateB - dateA);
    // });

    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET POSTS BY CATEGORY ID, ORDERED BY DATE
export const getPostsByCategoryAndDate = async (req, res) => {
  const { categoryid } = req.params; // Extract category ID from the request parameters

  try {
    // Find posts where the categoryid matches and sort them in descending order by date
    const categoryPosts = await Post.find({ categoryId: categoryid });

    // Function to parse the date string
    const parseDate = (dateStr) => {
      const [day, month, yearTime] = dateStr.split(".");
      const [year, time] = yearTime.split(" ");
      return new Date(`${year}-${month}-${day}T${time}:00`);
    };

    // Sort the posts by date in descending order
    const sortedPosts = categoryPosts.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return -(dateB - dateA);
    });

    res.status(200).json(sortedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE A POST
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body; // This will contain only the fields to be updated

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Use $set to update only the specified fields
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

