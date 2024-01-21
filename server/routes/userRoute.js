import express from "express";
import { updateUserLevel, signupUser } from "../controllers/userController.js";

const router = express.Router();

router.post('/signup',signupUser);
router.post('/find',updateUserLevel);

export {router as userRoute} 