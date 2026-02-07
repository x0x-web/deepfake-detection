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
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        console.log("error in predict video");
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default predictVideo;