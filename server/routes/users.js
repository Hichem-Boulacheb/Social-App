import express from "express";
import { signin,signup,signupWithGoogle,signinWithGoogle } from "../controllers/users.js";

const router=express.Router();

router.post("/signin",signin);
router.post("/signup",signup);
router.post("/signupWithGoogle",signupWithGoogle)
router.post("/signinWithGoogle",signinWithGoogle)


export default router;