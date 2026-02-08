
import { Router } from "express";
import predictVideo from "./controllers/predict.js";
import multerUpload from "../../configurations/multer.js";
import authUser from "../helper/authorizeUser.js";
const router = Router()


router.post("/predict",authUser,multerUpload.single("video"),predictVideo)



export default router