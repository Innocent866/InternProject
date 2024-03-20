import {createCarProfile, getAllCars, deleteCar, editCarProfile, getACar} from "../Controllers/carController.js";
import express from 'express';
import auth from "../middleware/auth.js";
const router = express.Router();


router.post("/create", auth, createCarProfile)
router.get("/getall",auth, getAllCars)
router.route("/:carId", auth).delete(deleteCar).patch(editCarProfile).get(getACar)

export default router;