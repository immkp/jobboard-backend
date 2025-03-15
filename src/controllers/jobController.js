import Job from "../models/Job.js";  // Import the Job model

export const getJobs = async (req, res) => {
    try {
        const { title } = req.query;
        let query = {};

        if (title) {
            query.title = { $regex: `\\b${title}\\b`, $options: "i" }; // Case-insensitive search
        }

        const jobs = await Job.find(query);  // Fetch from database
        res.json({ success: true, data: jobs });

    } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

