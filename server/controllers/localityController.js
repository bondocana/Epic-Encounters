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

// GET COORDINATES
export const getCoordinates = async (req, res) => {
  const { county, locality } = req.body;

  if (!county || !locality) {
    return res
      .status(400)
      .json({ message: "Judetul si localitatea sunt necesare." });
  }

  try {
    // Formatăm interogarea pentru API-ul Nominatim
    const query = `${locality}, ${county}, Romania`;

    // Efectuăm o cerere la API-ul Nominatim pentru a obține coordonatele
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`
    );

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ message: "Locatia nu a fost gasita." });
    }

    // Extragem coordonatele din primul rezultat
    const { lat, lon } = data[0];

    return res.status(200).json({ latitude: lat, longitude: lon });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Eroare", error: err.message });
  }
};
