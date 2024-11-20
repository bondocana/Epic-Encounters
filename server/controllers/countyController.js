import County from "../models/County.js";

// GET ALL POSTS
export const getAllCounties = async (req, res) => {
  try {
    const counties = await County.find().select("idCounty name");
    res.status(200).json(counties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
