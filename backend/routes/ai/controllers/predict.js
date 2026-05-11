import fs from "fs";
import path from "path";
import History from "../../../models/history.model.js";

const PLAN_LIMITS = { free: 5, pro: 20, premium: Infinity };

const predictVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log(req.file);
        const filePath = path.resolve(req.file.path);
        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer], { type: req.file.mimetype });

        const formData = new FormData();
        formData.append("video", blob, req.file.originalname);

        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        // Delete the file after prediction
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
            else console.log("File deleted successfully");
        });

        // Increment predictions used
        const userDoc = req.userDoc;
        if (userDoc) {
            userDoc.predictionsUsed += 1;
            await userDoc.save();
        }

        // Save prediction to history
        try {
            const label = result.result || result.prediction || result.label || "Unknown";
            await History.create({
                userId: req.user.id,
                fileName: req.file.originalname,
                result: label.toUpperCase() === "FAKE" ? "FAKE" : "REAL",
                confidence: result.score || result.confidence || result.probability || null,
                framesProcessed: result.frames_processed || 0,
            });
        } catch (historyErr) {
            console.log("Error saving history:", historyErr.message);
            // Don't fail the whole request if history save fails
        }

        const limit = PLAN_LIMITS[userDoc?.plan] || PLAN_LIMITS.free;
        return res.status(200).json({
            ...result,
            usage: {
                plan: userDoc?.plan || "free",
                predictionsUsed: userDoc?.predictionsUsed || 0,
                limit: limit === Infinity ? "unlimited" : limit,
            },
        });
    } catch (error) {
        console.log(error);
        console.log("error in predict video");

        // Clean up file if it exists
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file on error:", err);
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export default predictVideo;