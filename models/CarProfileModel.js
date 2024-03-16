import mongoose, { Schema } from "mongoose";
import User from "./userModel.js";

const CarSchema = new Schema({
    carNickname:{
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    carType: {
        type: String,
        enum: ["sedan", "suv", "pickup"],
        default: "sedan",
        required: true,
    },
    profileColor: {
        type: String,
        enum: ["yellow", "green", "red"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    } 
}, {timestamps: true})

const Car = mongoose.model('Car', CarSchema);

export default Car;
