import path from "path"
import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const multerUpload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 300 }, // 300MB مثال (غيّرها)
});

export default multerUpload