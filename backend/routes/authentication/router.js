
import { Router } from "express";
import loginUser from "./contorllers/login.js";
import registerUser from "./contorllers/register.js";
import { getMe } from "./contorllers/me.js";
import authUser from "../helper/authorizeUser.js";

const router = Router()

router.post("/login",loginUser)
router.post("/register",registerUser)
router.get("/me",authUser,getMe)

export default router