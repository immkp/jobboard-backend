import puppeteer from "puppeteer-core"; // Use puppeteer-core
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
puppeteer.use(StealthPlugin());

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected in Scraper"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
}

export async function scrapeJobs(jobTitle, experience, cityTypeGid) {
  if (!jobTitle) {
    console.error("❌ Job title is undefined!");
    return [];
  }

  const formattedJobTitle = jobTitle.trim().toLowerCase().replace(/\s+/g, "-");
  let naukriURL = `https://www.naukri.com/${encodeURIComponent(jobTitle)}-jobs?experience=${experience}`;

  if (cityTypeGid) {
    naukriURL = `${naukriURL}&cityTypeGid=${cityTypeGid}`;
  }

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome", // Path to Chromium in production
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for production
    headless: "new",
  });

  const page = await browser.newPage();

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ];

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  await page.setUserAgent(randomUserAgent);

  await page.goto(naukriURL, { waitUntil: "networkidle2" });

  console.log("Waiting for jobs to load...");
  await page.waitForSelector(".cust-job-tuple");

  const jobs = await page.evaluate(() => {
    const jobElements = document.querySelectorAll(".cust-job-tuple");
    return Array.from(jobElements).map((job) => ({
      title: job.querySelector(".title")?.innerText || "No title",
      company: job.querySelector(".comp-name")?.innerText || "No company",
      location: job.querySelector(".locWdth")?.innerText || "No location",
      experience: job.querySelector(".expwdth")?.innerText || "No experience",
      applicationLink: job.querySelector("a")?.getAttribute("href") || "No link",
    }));
  });

  await browser.close();
  return jobs;
}