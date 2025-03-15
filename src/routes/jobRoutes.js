import express from "express";
import { scrapeJobs } from "../utils/crawler.js"; // Scraping function
import Job from "../models/Job.js";

const router = express.Router();

// 🟢 Route to trigger job scraping manually
router.get("/scrape-jobs", async (req, res) => {
  try {
    const jobTitle = req.query.jobTitle; // Extract from query params
    const experience = req.query.experience; // Extract from query params
    const cityTypeGid = req.query.cityTypeGid; // Extract from query params

    if (!jobTitle || jobTitle.trim() === "") {
      return res.status(400).json({ message: "⚠️ Job title is required!" });
    }

    const jobs = await scrapeJobs(jobTitle,experience,cityTypeGid); // Call scraper function

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found!" });
    }

    await Job.insertMany(jobs, { ordered: false }).catch(err => {
      console.log("⚠️ Some duplicates skipped:", err.message);
    });

    res.json({ message: "✅ Job scraping completed!", data: jobs });

  } catch (error) {
    console.error("❌ Scraping Error:", error);
    res.status(500).json({ message: "Error scraping jobs", error: error.message });
  }
});



// 🟢 GET all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs

    const uniqueJobs = [];
    const jobMap = new Map();

    jobs.forEach((job) => {
      const key = `${job.title}-${job.company}-${job.location}`;
      if (!jobMap.has(key)) {
        jobMap.set(key, true);
        uniqueJobs.push(job);
      }
    });
    res.json({ count: uniqueJobs.length, data: uniqueJobs });
    // res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});



export default router;


