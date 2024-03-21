import User from "../models/userModel.js";

const getOneUser = async (req, res) => {
  try {
    let user;
    if (req.params.id) {
      user = await User.findById(req.params.id);
    } else {
      user = await User.findOne({ email: req.user.email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { _id } = req.params;
    const { fullname, phoneNumber, address, password } = req.body;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname || user.fullname;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;

    const deletedUser = await User.findOneAndDelete({ _id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserContactPreferences = async (req, res) => {
  const { email, phoneNumber, preferences } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's contact preferences
    user.contactPreferences = {
      email: preferences.includes("email"),
      phoneNumber: preferences.includes("phoneNumber"),
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Contact preferences updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePersonalInformation = async (req, res) => {
  const { fullname, email, phoneNumbers, contactPreferences, location } =
    req.body;
  const { id } = req.params;

  try {
    let updateInfo = {};

    if (fullname) {
      updateInfo.fullname = fullname;
    }

    if (email) {
      updateInfo.email = email;
    }

    if (phoneNumbers) {
      updateInfo.phoneNumbers = phoneNumbers;
    }

    if (contactPreferences) {
      updateInfo.contactPreferences = contactPreferences;
    }

    if (location) {
      updateInfo.location = location;
    }

    const profile = await User.findByIdAndUpdate({ _id: id }, updateInfo, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }


    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export {
  getOneUser,
  getAllUsers,
  updateUserDetails,
  deleteUser,
  updateUserContactPreferences,
  updatePersonalInformation,
};
