import User from '../models/userModel.js';

const getOneUser = async (req, res) => {
    try {
        let user;
        if (req.params.id) {
            user = await User.findById(req.params.id);
        } else {
            user = await User.findOne({ email: req.user.email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { _id } = req.params;
        const { fullname, phoneNumber, address, password } = req.body;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullname = fullname || user.fullname;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        
        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;

        const deletedUser = await User.findOneAndDelete({ _id });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


  

export { getOneUser, getAllUsers, updateUserDetails, deleteUser };