import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import countyRoutes from "./routes/countyRoutes.js";
import localityRoutes from "./routes/localityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { register } from "./controllers/authController.js";
import { createPost } from "./controllers/postController.js";
import { verifyToken } from "./middleware/verifyToken.js";
// import Locality from "./models/Locality.js";
// import { localities } from "./data/localitiesData.js";
// import County from "./models/County.js";
// import { counties } from "./data/countiesData.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILES
// new user
app.post("/auth/register", upload.single("picture"), register);
// new post
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api", countyRoutes);
app.use("/api", localityRoutes);
app.use("/posts", postRoutes);
app.use("/categories", categoryRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // ADD DATA ONE TIME
    // Locality.insertMany(localities);
    //County.insertMany(counties);
  })
  .catch((error) => console.log(`${error} did not connect`));

// CREATE THE TABLE ONE TIME
// const newLocality = new Locality({
//   idLocality: "1",
//   idCounty: "1",
//   name: "Example Locality1",
// });

// newLocality.save();

// CREATE THE TABLE ONE TIME
// const newCounty = new County({
//   idCounty: "2",
//   name: "Example County",
// });

// newCounty.save();
