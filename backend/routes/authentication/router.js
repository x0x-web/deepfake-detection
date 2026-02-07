
import { Router } from "express";
import loginUser from "./contorllers/login.js";
import registerUser from "./contorllers/register.js";

const router = Router()

router.post("/login",loginUser)
router.post("/register",registerUser)


export default router