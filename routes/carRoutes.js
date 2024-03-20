import {createCarProfile, getAllCars, deleteCar, editCarProfile} from "../Controllers/carController.js";
import express from 'express';
import auth from "../middleware/auth.js";
const router = express.Router();


router.post("/create", auth, createCarProfile)
router.get("/getall",auth, getAllCars)
router.route("/:carId", auth).delete(deleteCar).patch(editCarProfile)

export default router;