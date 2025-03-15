import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
// Middleware to parse JSON
app.use(cors({ 
  origin: "http://localhost:5173", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type,Authorization"
})); // Allow frontend to access backend

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle Preflight Requests
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  }

  next();
});

app.use(express.json()); 

app.use("/api", jobRoutes);


const PORT = process.env.PORT || 4061;
const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in .env

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


app.get("/api/scrape-jobs", (req, res) => {
  res.json({ message: "CORS fixed!", jobs: [] });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
