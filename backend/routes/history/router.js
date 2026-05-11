import { Router } from "express";
import authUser from "../helper/authorizeUser.js";
import getHistory from "./controllers/getHistory.js";

const router = Router();

router.get("/", authUser, getHistory);

export default router;
