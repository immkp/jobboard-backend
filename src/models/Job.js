import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  experience: String,
  applicationLink: String,
  datePosted: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
