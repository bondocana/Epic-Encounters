import User from "../models/User.js";
import County from "../models/County.js";
import Locality from "../models/Locality.js";

/* GET A USER */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Găsește utilizatorul după ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Găsește județul după atributul countyid din user
    const county = await County.findOne({ idCounty: user.county });

    // Găsește localitatea după atributul localityid din user
    const locality = await Locality.findOne({ idLocality: user.locality });

    // Creează un obiect cu datele utilizatorului, incluzând numele județului și localității
    const userResponse = {
      ...user._doc,
      county: county ? county.name : null, // returnează numele sau null dacă nu este găsit
      locality: locality ? locality.name : null, // returnează numele sau null dacă nu este găsit
    };

    // Trimite răspunsul
    res.status(200).json(userResponse);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
