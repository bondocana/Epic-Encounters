// controllers/localityController.js

import Locality from "../models/Locality.js";

export const getLocalitiesByCounty = async (req, res) => {
  const { idCounty } = req.body;

  if (!idCounty || idCounty < 0 || idCounty > 42) {
    return res.status(400).json({
      message: "idCounty is required and must be a number between 0 and 42",
    });
  }

  try {
    const localities = await Locality.find({ idCounty }).select(
      "idCounty idLocality name"
    );
    res.status(200).json(localities);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
