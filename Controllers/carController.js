import Car from "../models/CarProfileModel.js";

const createCarProfile = async (req, res) => {
  const { carNickname, carType, location, profileColor, user } = req.body;

  const { id } = req.user;
  console.log(req.user);

  req.body.user = id;

  try {
    const car = await Car.create({
      carNickname,
      carType,
      location,
      profileColor,
      user: id,
    });

    res.status(201).json({ success: true, car });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};

const getAllCars = async (req, res) => {
  const userId = req.user.id;

  try {
    const cars = await Car.find({ user: userId });

    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};

const deleteCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findByIdAndDelete({ _id: carId });
    res.status(201).json({ success: true, car });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const editCarProfile = async (req, res) => {
  const { carId } = req.params;
  const { carNickname, carType, profileColor } = req.body;

  try {
    const updatedCarProfile = {};

    if (carNickname) updatedCarProfile.carNickname = carNickname;
    if (carType) updatedCarProfile.carType = carType;
    if (profileColor) updatedCarProfile.profileColor = profileColor;

    const updatedCar = await Car.findByIdAndUpdate(carId, updatedCarProfile, {
      new: true,
    });
    res.status(201).json({ success: true, updatedCar });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

export { createCarProfile, getAllCars, deleteCar, editCarProfile };
