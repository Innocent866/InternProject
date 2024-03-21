import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../Controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/updatePassword", auth, updatePassword);

export default router;
