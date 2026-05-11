import { Router } from "express";
import authUser from "../helper/authorizeUser.js";
import getSubscriptionStatus from "./controllers/status.js";
import upgradePlan from "./controllers/upgrade.js";

const router = Router();

router.get("/status", authUser, getSubscriptionStatus);
router.put("/upgrade", authUser, upgradePlan);

export default router;
