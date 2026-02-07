
import { Router } from "express";
import predictVideo from "./controllers/predict.js";
import multerUpload from "../../configurations/multer.js";
const router = Router()


router.post("/predict",multerUpload.single("video"),predictVideo)



export default router