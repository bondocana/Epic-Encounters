import Category from "../models/Category.js";

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
