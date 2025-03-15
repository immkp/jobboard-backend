import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import connectDB from "./config/db.js"; // Import the connectDB function

dotenv.config(); // Load environment variables

const app = express();
// Middleware to parse JSON
app.use(cors({ 
  origin: "https://jobboard-frontend-one.vercel.app", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type,Authorization"
})); // Allow frontend to access backend

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://jobboard-frontend-one.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle Preflight Requests
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  }

  next();
});

app.use(express.json()); 

connectDB();
app.use("/api", jobRoutes);


const PORT = process.env.PORT || 4061;
const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in .env

// Connect to MongoDB


app.get("/api/scrape-jobs", (req, res) => {
  res.json({ message: "CORS fixed!", jobs: [] });
});
app.get("/test-scrape", async (req, res) => {
  try {
    const jobs = await scrapeJobs("React Developer", 2, 97); // Example parameters
    res.json(jobs);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
