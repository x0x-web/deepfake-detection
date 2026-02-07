import fs from "fs";
import path from "path";

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

        return res.status(200).json(result);
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