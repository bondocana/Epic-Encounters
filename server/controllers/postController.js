import Post from "../models/Post.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import County from "../models/County.js";
import Locality from "../models/Locality.js";

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

    const category = await Category.findOne({ name: categoryId });

    const newPost = new Post({
      userId,
      title,
      description,
      picturePath:
        picturePath === "undefined" ? "defaultPostPicture.png" : picturePath,
      isAproved,
      categoryId: category._id,
      date,
      time,
      county,
      locality,
      location,
      likes: [],
      comments: [],
      attending: [userId],
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

    // Găsește postarea după ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Găsește județul după atributul idCounty din postare
    const county = await County.findOne({ idCounty: post.county });

    // Găsește localitatea după atributul idLocality din postare
    const locality = await Locality.findOne({ idLocality: post.locality });

    const category = await Category.findOne({ _id: post.categoryId });

    // Creează un obiect cu datele postării, incluzând numele județului și localității
    const postResponse = {
      ...post._doc,
      county: county ? county.name : null, // returnează numele sau null dacă nu este găsit
      locality: locality ? locality.name : null, // returnează numele sau null dacă nu este găsit
      categoryId: category ? category.name : null,
    };

    // Trimite răspunsul
    res.status(200).json(postResponse);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// GET USERS POST
export const getUsersPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Găsește utilizatorul după ID
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Găsește toate postările utilizatorului
    const usersPosts = await Post.find({ userId: userId, isAproved: true });

    // Funcție pentru a parsa stringul de dată din formatul "DD/MM/YYYY" într-un obiect Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filtrează și sortează postările
    const sortedPosts = usersPosts
      .filter((post) => parseDate(post.date) > new Date()) // Afișează doar postările cu data mai mare decât cea curentă
      .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Sortează în ordine descrescătoare după dată

    // Pentru fiecare postare, înlocuiește ID-urile cu numele corespunzătoare
    const postsWithLocationNames = await Promise.all(
      sortedPosts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
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

    const allPosts = await Post.find({
      county: currentUser.county,
      isAproved: true,
    });

    // Funcție pentru a parsa stringul de dată din formatul "DD/MM/YYYY" într-un obiect Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filtrează și sortează postările
    const sortedPosts = allPosts
      .filter((post) => parseDate(post.date) > new Date()) // Afișează doar postările cu data mai mare decât cea curentă
      .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Sortează în ordine descrescătoare după dată

    const postsWithLocationNames = await Promise.all(
      sortedPosts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// GET POSTS ORDERED BY DATA
export const getPostsByDate = async (req, res) => {
  try {
    const allPosts = await Post.find({ isAproved: true });

    // Funcție pentru a parsa stringul de dată din formatul "DD/MM/YYYY" într-un obiect Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filtrează și sortează postările
    const sortedPosts = allPosts
      .filter((post) => parseDate(post.date) > new Date()) // Afișează doar postările cu data mai mare decât cea curentă
      .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Sortează în ordine descrescătoare după dată

    const postsWithLocationNames = await Promise.all(
      sortedPosts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET POSTS BY CATEGORY ID, ORDERED BY DATE
export const getPostsByCategoryAndDate = async (req, res) => {
  const { categoryid } = req.params; // Extract category ID from the request parameters

  try {
    // Find posts where the categoryid matches and sort them in descending order by date
    const categoryPosts = await Post.find({
      categoryId: categoryid,
      isAproved: true,
    });

    // Funcție pentru a parsa stringul de dată din formatul "DD/MM/YYYY" într-un obiect Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filtrează și sortează postările
    const sortedPosts = categoryPosts
      .filter((post) => parseDate(post.date) > new Date()) // Afișează doar postările cu data mai mare decât cea curentă
      .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Sortează în ordine descrescătoare după dată

    const postsWithLocationNames = await Promise.all(
      sortedPosts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
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

    // Găsește județul după atributul idCounty din postare
    const county = await County.findOne({ idCounty: updatedPost.county });

    // Găsește localitatea după atributul idLocality din postare
    const locality = await Locality.findOne({
      idLocality: updatedPost.locality,
    });

    const category = await Category.findOne({ _id: updatedPost.categoryId });

    // Creează un obiect cu datele postării, incluzând numele județului și localității
    const postResponse = {
      ...updatedPost._doc,
      county: county ? county.name : null, // returnează numele sau null dacă nu este găsit
      locality: locality ? locality.name : null, // returnează numele sau null dacă nu este găsit
      categoryId: category ? category.name : null,
    };

    res.status(200).json(postResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS THAT ARE ATTENDING TO AN EVENT
export const getAttendingUsers = async (req, res) => {
  const { postId } = req.params;
  try {
    // Find the post by postId
    const post = await Post.findById(postId);

    // If post not found, return a 404 error
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const attendingUsers = await User.find({ _id: { $in: post.attending } });

    // Return the attending array
    res.status(200).json(attendingUsers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// CHECK IF USER IS ATTENDING A POST
export const checkUserAttendance = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the userId is in the post's attending array
    const isAttending = post.attending.includes(userId);

    if (isAttending) {
      return res.status(200).json({ IsAttending: true });
    } else {
      return res.status(200).json({ IsAttending: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "error", error: err.message });
  }
};

// ADD USER TO ATTENDING ARRAY OF A POST
export const addUserToAttending = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is already in the attending array
    const isAlreadyAttending = post.attending.includes(userId);
    if (isAlreadyAttending) {
      return res
        .status(400)
        .json({ message: "User is already attending this post" });
    }

    // Add the userId to the attending array
    post.attending.push(userId);

    // Save the updated post
    await post.save();

    return res.status(200).json({ message: "User added to attending list" });
  } catch (err) {
    return res.status(500).json({ message: "error", error: err.message });
  }
};

// REMOVE USER FROM ATTENDING ARRAY OF A POST
export const removeUserFromAttending = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is in the attending array
    const isAttending = post.attending.includes(userId);
    if (!isAttending) {
      return res
        .status(400)
        .json({ message: "User is not attending this post" });
    }

    // Remove the userId from the attending array
    post.attending = post.attending.filter((id) => id.toString() !== userId);

    // Save the updated post
    await post.save();

    return res
      .status(200)
      .json({ message: "User removed from attending list" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET UNAPROVED POSTS ORDERED BY DATA
export const getUnapprovedPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({ isAproved: false });

    // Funcție pentru a parsa stringul de dată din formatul "DD/MM/YYYY" într-un obiect Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filtrează și sortează postările
    const sortedPosts = allPosts
      .filter((post) => parseDate(post.date) > new Date()) // Afișează doar postările cu data mai mare decât cea curentă
      .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Sortează în ordine descrescătoare după dată

    const postsWithLocationNames = await Promise.all(
      sortedPosts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostsUserAttending = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all posts where userId is in the attending array
    const posts = await Post.find({ attending: userId, isAproved: true });

    if (!posts.length) {
      return res
        .status(404)
        .json({ message: "No posts found where user is attending." });
    }

    const postsWithLocationNames = await Promise.all(
      posts.map(async (post) => {
        const county = await County.findOne({ idCounty: post.county });
        const locality = await Locality.findOne({ idLocality: post.locality });

        return {
          ...post._doc,
          county: county ? county.name : null, // Înlocuiește ID-ul județului cu numele
          locality: locality ? locality.name : null, // Înlocuiește ID-ul localității cu numele
        };
      })
    );

    res.status(200).json(postsWithLocationNames);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Error fetching posts where user is attending.",
      error: error.message,
    });
  }
};
