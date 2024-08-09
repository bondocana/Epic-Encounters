import mongoose from "mongoose";

const LocalitySchema = new mongoose.Schema(
  {
    idLocality: {
      type: String,
      required: true,
      unique: true,
    },
    idCounty: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Locality = mongoose.model("Locality", LocalitySchema);
export default Locality;
