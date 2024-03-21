import express from "express";
const router = express.Router();
import {
  getOneUser,
  getAllUsers,
  updateUserDetails,
  deleteUser,
  updateUserContactPreferences,
  updatePersonalInformation,
} from "../Controllers/userController.js";

router.get("/details/:id", getOneUser);

router.get("/all", getAllUsers);

router.put("/update/:_id", updateUserDetails);

router.patch("/profile/:id", updatePersonalInformation);

router.delete("/delete/:_id", deleteUser);

router.post("/contact-preferences", updateUserContactPreferences);

export default router;
