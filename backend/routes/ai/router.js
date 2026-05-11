
import { Router } from "express";
import predictVideo from "./controllers/predict.js";
import multerUpload from "../../configurations/multer.js";
import authUser from "../helper/authorizeUser.js";
import checkSubscription from "../helper/checkSubscription.js";
const router = Router()


router.post("/predict", authUser, checkSubscription, multerUpload.single("video"), predictVideo)



export default router