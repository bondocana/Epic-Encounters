import Category from "../models/Category.js";
import Post from "../models/Post.js";

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ADD CATEGORY
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new Category({
      name,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json(savedCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find and delete the category by ID
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // Check if the category exists
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES WITHOUT EVENTS
export const getCategoriesWithoutEvents = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // For each category, check if there are any posts/events associated with it
    const categoriesWithoutEvents = [];

    for (const category of categories) {
      const events = await Post.find({ categoryId: category._id });

      // If no events are found, add the category to the result
      if (events.length === 0) {
        categoriesWithoutEvents.push(category);
      }
    }

    res.status(200).json(categoriesWithoutEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
