import mongoose from "mongoose";

const CountySchema = new mongoose.Schema(
  {
    idCounty: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const County = mongoose.model("County", CountySchema);
export default County;
